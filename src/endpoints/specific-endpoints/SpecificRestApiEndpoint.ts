import type {DataInfo_Strict} from "@grpc-build/DataInfo";
import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import {FetchOptions, RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {FieldsNotType, MultipartTransferObject, NarrowedDestination} from "@/types/general";
import type {
    SpecHandlerReturnType,
    SpecificRequestDescriptor,
    SpecificRequestGetDescriptor,
    SpecificRequestSetDescriptor
} from "@/endpoints/specific-endpoints/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import {PassThrough, Readable, Writable} from "node:stream";
import type {Response} from "node-fetch";

interface BodyGetterDescriptor {
    contentType?: string,
    headers?: Record<string, string>,
    reader: Promise<string | undefined> | Readable,
    writer: Writable
}

const p = "REST_API";
type P = typeof p;

export abstract class SpecificRestApiEndpoint extends RestApiEndpoint {
    abstract getMapper;

    abstract setMapper;

    getGetHandler(info: GetInfo_Strict): NarrowedDestination<P, "GET"> {
        if (!(this.getMapper && info.requestType && info.requestType in this.getMapper))
            throw new ErrorDto("not-supported", strTemplates.notSupported("Request type"));
        const handlers: SpecHandlerReturnType<P, "GET"> =
            (this.getMapper[info.requestType].bind(this))(info);
        return {
            requestName: "GET",
            protocol: p,
            ...handlers
        }
    }

    getSetHandler(info: DataInfo_Strict): NarrowedDestination<P, "SET"> {
        if (!(info.requestType && info.requestType in this.setMapper))
            throw new ErrorDto("not-supported", strTemplates.notSupported("Request type"));
        const handlers: SpecHandlerReturnType<P, "SET"> =
            (this.setMapper[info.requestType].bind(this))(info);
        return {
            requestName: "SET",
            protocol: p,
            ...handlers
        }
    }

    extractGetInfo(info: GetInfo_Strict | DataInfo_Strict) {
        if ("dataValueType" in info) {
            const dataValue = info[info["dataValueType"]];
            return (typeof dataValue == "object" && "getInfo" in dataValue) ? dataValue["getInfo"] : undefined;
        } else {
            const getInfo = info.infoType && info[info.infoType];
            return (typeof getInfo == "object") ? getInfo : undefined;
        }
    }

    checkRequirements(getInfo: GetInfo_Strict[keyof GetInfo_Strict] | undefined,
                      requirements: SpecificRequestDescriptor["requirements"]): undefined | string {
        if (!requirements) return;
        if (typeof getInfo != "object") {
            return "info";
        } else {
            const keys = Object.keys(getInfo);
            return requirements.find(key => {
                if (!keys.includes(key)) {
                    return true;
                }
            });
        }
    }

    async waitTextStream(stream: Readable): Promise<string> {
        let str = "";
        return new Promise((resolve, reject) => {
            stream
                .on("data", (chunk) => {
                    str += chunk.toString();
                })
                .on("end", () => resolve(str))
                .on("error", (error) => reject(error));
        })
    }

    basicBodyOutputPrepare(info: GetInfo_Strict[keyof GetInfo_Strict],
                           descriptor: SpecificRequestSetDescriptor): BodyGetterDescriptor {
        const passThrough = new PassThrough();
        const {inputOptions: options} = descriptor;
        const reader = (() => {
            if (options.json || options.text) {
                return this.waitTextStream(passThrough).then(text => {
                    return options.json
                        ? JSON.stringify(options.json!(JSON.parse(text)))
                        : options.text!(text)
                })
            } else if (options.stream) {
                return passThrough.end(options.stream);
            }
            return passThrough;
        })()
        const contentTypeMap: Record<string, string> = {
            json: "application/json",
            text: "text/plain",
            bytes: "application/octet-stream"
        };
        return {
            writer: passThrough,
            reader,
            contentType: contentTypeMap[options.bodyType]
        }
    }

    getOutputBody(getInfo: FieldsNotType<GetInfo_Strict, string> | undefined,
                  descriptor: SpecificRequestSetDescriptor): BodyGetterDescriptor {
        if (descriptor.inputOptions.mp) {
            const mpOptions = descriptor.inputOptions.mp(getInfo);
            const mpBody = this.createMultipartBody({
                method: descriptor.inputOptions.httpMethod,
                fields: mpOptions.fields,
                streamName: mpOptions.streamName
            })
            if (mpOptions.transformer) {
                mpOptions.transformer.pipe(mpBody.writer);
            }
            return {
                contentType: "multipart/form-data",
                headers: mpBody.headers,
                writer: mpOptions.transformer || mpBody.writer,
                reader: mpBody.reader
            }
        } else {
            return this.basicBodyOutputPrepare(getInfo, descriptor);
        }
    }

    async transformGetResponse<D extends SpecificRequestGetDescriptor>(response: Response, descriptor: D):
        Promise<NodeJS.ReadableStream | undefined> {
        const passThrough = new PassThrough();
        const {outputOptions: options} = descriptor;
        if (!options || !response.body) {
            return response.body;
        }
        if (options.json || options.text) {
            const string = options.json
                ? await (response.json().then(json => JSON.stringify(options.json!(json))))
                : await (response.text().then(text => options.text!(text)))
            passThrough.end(Buffer.from(string))
            return passThrough;
        }
        if (options.stream) {
            return response.body.pipe(options.stream);
        }
    }

    async transformSetResponse(response: Response, descriptor: SpecificRequestSetDescriptor):
        Promise<FieldsNotType<GetInfo_Strict, string> | undefined> {
        const {outputOptions: options} = descriptor;
        if (!options || options.empty || !response.body) {
            return undefined
        }
        if (options.json) {
            return response.json().then(json => options.json!(json));
        }
        if (options.text) {
            return response.text().then(text => options.text!(text));
        }
    }

    getSpecificEndpoint(info: GetInfo_Strict, descriptor: SpecificRequestGetDescriptor):
        SpecHandlerReturnType<"REST_API", "GET">;
    getSpecificEndpoint(info: DataInfo_Strict, descriptor: SpecificRequestSetDescriptor):
        SpecHandlerReturnType<"REST_API", "SET">;
    getSpecificEndpoint<D extends SpecificRequestDescriptor>
    (info: GetInfo_Strict | DataInfo_Strict, descriptor: SpecificRequestDescriptor):
        SpecHandlerReturnType<"REST_API"> {
        // 1. Check requirements
        const getInfo = this.extractGetInfo(info);
        const key = this.checkRequirements(getInfo, descriptor.requirements);
        if (key) {
            throw new ErrorDto("invalid-argument", strTemplates.notProvided(key));
        }
        // 2. Prepare body and url.
        const url = this.config.host + descriptor.inputOptions.uri(getInfo);
        const body = descriptor.type == "GET" || descriptor.inputOptions.bodyType == "none"
            ? undefined
            : this.getOutputBody(getInfo, descriptor);
        // 3. Do request, handle response and pack in reader with info object.
        const getFetchOptions = async (): Promise<FetchOptions> => ({
            url,
            method: descriptor.inputOptions.httpMethod,
            ...(body && {
                headers: body?.headers,
                body: await body?.reader,
                contentType: body?.contentType
            })
        })
        if (descriptor.type == "GET") {
            const reader = (async (): Promise<MultipartTransferObject> => {
                let stream = descriptor.outputOptions?.mp
                    ? (await this.requestMultipart(await getFetchOptions())).stream
                    : (await this.transformGetResponse(await this.baseFetch(await getFetchOptions()), descriptor))
                return {
                    info: {
                        requestType: info.requestType,
                        dataType: "BYTES",
                    },
                    data: stream
                }
            })()
            return {
                destReader: reader
            }
        } else {
            const reader = (async (): Promise<GetInfo_Strict> => {
                const response = await this.baseFetch(await getFetchOptions());
                const transformed = await this.transformSetResponse(response, descriptor);
                return {
                    requestType: info.requestType,
                    ...(transformed && {
                        infoType: descriptor.getInfoName,
                        [descriptor.getInfoName]: transformed
                    })
                } as GetInfo_Strict
            })()
            return {
                destWriter: body?.writer,
                destReader: reader
            }
        }
    }
}
