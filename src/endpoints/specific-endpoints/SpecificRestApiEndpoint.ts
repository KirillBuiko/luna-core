import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
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

    getGetHandler(info: GetInfo__Output): NarrowedDestination<P, "GET"> {
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

    getSetHandler(info: DataInfo__Output): NarrowedDestination<P, "SET"> {
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

    extractGetInfo(info: GetInfo__Output | DataInfo__Output) {
        if ("dataValueType" in info) {
            const dataValue = info[info["dataValueType"]];
            return (typeof dataValue == "object" && "getInfo" in dataValue) ? dataValue["getInfo"] : undefined;
        } else {
            const getInfo = info.infoType && info[info.infoType];
            return (typeof getInfo == "object") ? getInfo : undefined;
        }
    }

    checkRequirements(getInfo: GetInfo__Output[keyof GetInfo__Output] | undefined,
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
            }) || undefined;
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

    basicBodyOutputPrepare(info: GetInfo__Output[keyof GetInfo__Output],
                           descriptor: SpecificRequestSetDescriptor): BodyGetterDescriptor {
        const passThrough = new PassThrough();
        const {inputOptions: options} = descriptor;
        const reader = (() => {
            if (options.json) {
                return this.waitTextStream(passThrough)
                    .then(text => JSON.stringify(options.json && options.json(JSON.parse(text))));
            } else if (options.text) {
                return this.waitTextStream(passThrough)
                    .then(text => options.text && options.text(text));
            } else if (options.stream) {
                return passThrough.pipe(options.stream);
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

    getSpecificSetBody(getInfo: FieldsNotType<GetInfo__Output, string> | undefined,
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

    async getTransformedGetResponse<D extends SpecificRequestGetDescriptor>(response: Response, descriptor: D):
        Promise<NodeJS.ReadableStream | undefined> {
        const passThrough = new PassThrough();
        const {outputOptions: options} = descriptor;
        if (!options || !response.body) {
            return response.body;
        }
        if (options.json || options.text) {
            const string =
                options.json
                    ? await response.json().then(json => JSON.stringify(options.json!(json)))
                    : await response.text().then(text => options.text!(text))
            passThrough.write(Buffer.from(string))
            return passThrough;
        }
        if (options.stream) {
            return response.body.pipe(options.stream);
        }
    }

    async getTransformedSetResponse(response: Response, descriptor: SpecificRequestSetDescriptor):
        Promise<FieldsNotType<GetInfo__Output, string> | undefined> {
        const {outputOptions: options} = descriptor;
        if (!options || !response.body) {
            return undefined
        }
        if (options.empty) return undefined;
        if (options.json) {
            return response.json().then(json => options.json!(json));
        }
        if (options.text) {
            return response.text().then(text => options.text!(text));
        }
    }


    // getSpecificEndpoint(info: GetInfo__Output,
    //                     descriptor: SpecificRequestDescriptor): Promise<SpecHandlerReturnType<"REST_API", "GET">>;
    // getSpecificEndpoint(info: DataInfo__Output,
    //                     descriptor: SpecificRequestDescriptor): Promise<SpecHandlerReturnType<"REST_API", "SET">>;

    getSpecificEndpoint(info: GetInfo__Output, descriptor: SpecificRequestGetDescriptor):
        SpecHandlerReturnType<"REST_API", "GET">;
    getSpecificEndpoint(info: DataInfo__Output, descriptor: SpecificRequestSetDescriptor):
        SpecHandlerReturnType<"REST_API", "SET">;
    getSpecificEndpoint<D extends SpecificRequestDescriptor>
    (info: GetInfo__Output | DataInfo__Output, descriptor: SpecificRequestDescriptor):
        SpecHandlerReturnType<"REST_API"> {
        // 1. Check requirements
        const getInfo = this.extractGetInfo(info);
        const key = this.checkRequirements(getInfo, descriptor.requirements);
        if (key) {
            throw new ErrorDto("invalid-argument", strTemplates.notProvided(key));
        }
        // 2. Prepare body and url.
        const url = descriptor.inputOptions.url(getInfo);
        const body = descriptor.type == "GET" || descriptor.inputOptions.bodyType == "none"
            ? undefined
            : this.getSpecificSetBody(getInfo, descriptor);
        // 3. Handle response: if 'json/text' wait and handle, if 'stream' pipe, if 'mp' - get stream name from options
        //    and send to data (+transform). If 'empty' - ...
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
                let stream: NodeJS.ReadableStream | undefined;
                if (descriptor.outputOptions?.mp) {
                    const response = await this.requestMultipart(await getFetchOptions());
                    stream = response.stream;
                } else {
                    const response = await this.baseFetch(await getFetchOptions());
                    stream = await this.getTransformedGetResponse(response, descriptor);
                }
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
            const reader = (async (): Promise<GetInfo__Output> => {
                const response = await this.baseFetch(await getFetchOptions());
                const transformed = await this.getTransformedSetResponse(response, descriptor);
                return {
                    requestType: info.requestType,
                    ...(transformed && {
                        infoType: descriptor.names[0],
                        [descriptor.names[0]]: transformed
                    })
                } as GetInfo__Output
            })()
            return {
                destWriter: body?.writer,
                destReader: reader
            }
        }
    }
}
