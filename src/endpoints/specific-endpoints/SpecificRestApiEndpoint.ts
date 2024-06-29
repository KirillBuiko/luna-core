import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {NarrowedDestination} from "@/types/general";
import type {
    SpecHandlerReturnType,
    SpecificRequestDescriptor,
    SpecificRequestGetDescriptor, SpecificRequestSetDescriptor
} from "@/endpoints/specific-endpoints/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import {Readable, PassThrough, Writable} from "node:stream";
import {chunk} from "lodash";

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
                           descriptor: SpecificRequestSetDescriptor):
        { writer: Writable, reader: Promise<string | undefined> | Readable, contentType?: string } {
        const passThrough = new PassThrough();
        let reader: Promise<string | undefined> | Readable = passThrough;
        if (descriptor.inputOptions.json) {
            reader = this.waitTextStream(passThrough)
                .then(text => JSON.stringify(
                    descriptor.inputOptions.json && descriptor.inputOptions.json(JSON.parse(text))))
        } else if (descriptor.inputOptions.text) {
            reader = this.waitTextStream(passThrough)
                .then(text => descriptor.inputOptions.text && descriptor.inputOptions.text(text))
        } else if (descriptor.inputOptions.stream) {
            reader = passThrough.pipe(descriptor.inputOptions.stream)
        }
        const contentTypeMap: Record<string, string> = {
            json: "application/json",
            text: "text/plain",
            bytes: "application/octet-stream"
        };
        return {
            writer: passThrough,
            reader,
            contentType: contentTypeMap[descriptor.inputOptions.bodyType]
        }
    }

    getSpecificSetBody(getInfo: GetInfo__Output[keyof GetInfo__Output],
                             descriptor: SpecificRequestSetDescriptor):
        { contentType?: string, headers?: Record<string, string>,
            reader: Promise<string | undefined> | Readable, writer: Writable } {
        let body: string | object | Readable | undefined;
        let contentType = "";
        let header: Record<string, string> = {}

        if (descriptor.inputOptions.mp) {
            const mpOptions = descriptor.inputOptions.mp(getInfo);
            const mp = this.createMultipartBody({
                method: descriptor.inputOptions.httpMethod,
                fields: mpOptions.fields,
                streamName: mpOptions.streamName
            })
            if (mpOptions.transformer) {
                mpOptions.transformer.pipe(mp.writer);
            }
            return {
                contentType: "multipart/form-data",
                headers: mp.headers,
                writer: mpOptions.transformer || mp.writer,
                reader: mp.reader
            }
        } else {
            const body = this.basicBodyOutputPrepare(getInfo, descriptor);
            return {
                contentType: body.contentType,
                writer: body.writer,
                reader: body.reader,
            }
        }
    }

    async getSpecificGetEndpoint(info: GetInfo__Output[keyof GetInfo__Output],
                                 descriptor: SpecificRequestGetDescriptor):
        Promise<SpecHandlerReturnType<"REST_API", "GET">> {

    }

    async getSpecificEndpoint(info: GetInfo__Output | DataInfo__Output,
                              descriptor: SpecificRequestDescriptor) {
        // 1. Check requirements
        const getInfo = this.extractGetInfo(info);
        const key = this.checkRequirements(getInfo, descriptor.requirements);
        if (key) {
            throw new ErrorDto("invalid-argument", strTemplates.notProvided(key));
        }
        // 2. Prepare body and url.
        if (descriptor.type == "SET") {
            return this.getSpecificSetEndpoint(getInfo, descriptor);
        } else {
            return this.getSpecificGetEndpoint(getInfo, descriptor);
        }
        // 3. Handle response: if 'json/text' wait and handle, if 'stream' pipe, if 'mp' - get stream name from options
        //    and send to data (+transform). If 'empty' - ...
        // 4. Pack reader with info promises, return writer + reader
    }
}
