import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {NarrowedDestination} from "@/types/Types";
import type {SpecHandlerReturnType} from "@/endpoints/specific-endpoints/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";

const p = "REST_API";
type P = typeof p;

export abstract class SpecificRestApiEndpoint extends RestApiEndpoint {
    abstract getMapper;

    abstract setMapper;

    protected getGetHandler(info: GetInfo__Output): NarrowedDestination<P, "GET"> {
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

    protected getSetHandler(info: DataInfo__Output): NarrowedDestination<P, "SET"> {
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
}