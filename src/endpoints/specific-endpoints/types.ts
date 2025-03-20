import type {
    NarrowedDestination, ObjectGetInfo,
    ProtocolType,
    RequestName
} from "@/types/general";
import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import type {DataInfo_Strict} from "@grpc-build/DataInfo";
import type {RequestType_Strict} from "@grpc-build/RequestType";
import type {FieldType} from "@/endpoints/RestApiEndpoint";
import type {Transform} from "node:stream";
import type {ErrorDto} from "@/endpoints/ErrorDto";
import type {HTTPMethods} from "fastify/types/utils";
import type {KeysOfObjects} from "@/types/general";

type SelectByName<M extends string, T extends string> =
    { [key in T]: key extends `${M}${infer R}` ? key : never }[T];
export type SpecHandlerReturnType<P extends ProtocolType, R extends RequestName = RequestName> =
    { [name in R]: Pick<NarrowedDestination<P, R>, "destReader" | "destWriter"> }[R];
type SpecRequestHandler<P extends ProtocolType, R extends RequestName> =
    (info: R extends "GET" ? GetInfo_Strict : DataInfo_Strict) => SpecHandlerReturnType<P, R>
export type SpecRequestHandlers<P extends ProtocolType, R extends RequestName, RT extends string> =
    { [request in SelectByName<RT, RequestType_Strict>]?: SpecRequestHandler<P, R> }

type SpecificTransformers = {
    json?: (response: object) => object,
    text?: (response: string) => string,
    stream?: Transform,
}

type SpecificSetBodyTransformers<I> = SpecificTransformers & {
    mp?: (info?: I | undefined) => {
        fields?: FieldType[],
        streamName?: string,
        transformer?: Transform
    }
}

type SpecificGetResponseTransformers<I> = SpecificTransformers & {
    mp?: true
}

type SpecificSetResponseTransformers<I> = {
    empty?: true
    json?: (response: object) => I,
    text?: (response: string) => I,
}

export type SpecificRequestBaseDescriptor<N extends keyof ObjectGetInfo = keyof ObjectGetInfo> = {
    // names: [N, keyof DataInfo_Strict],
    getInfoName?: N,
    requirements?: KeysOfObjects<ObjectGetInfo[N]>[],
    inputOptions: {
        uri: (info?: ObjectGetInfo[N]) => string,
        httpMethod: HTTPMethods
    },
    outputOptions?: {
        endpointErrorHandler?: (error: ErrorDto) => ErrorDto
    }
}

export type SpecificRequestGetDescriptor<N extends keyof ObjectGetInfo = keyof ObjectGetInfo> =
    SpecificRequestBaseDescriptor<N> & {
    type: "GET",
    outputOptions?: SpecificGetResponseTransformers<ObjectGetInfo[N]>
}

export type SpecificRequestSetDescriptor<N extends keyof ObjectGetInfo = keyof ObjectGetInfo> =
    SpecificRequestBaseDescriptor<N> & {
    type: "SET",
    getInfoName: N,
    inputOptions: {
        bodyType: "json" | "bytes" | "text" | "mp" | "none",
    } & SpecificSetBodyTransformers<ObjectGetInfo[N]>,
    outputOptions?: SpecificSetResponseTransformers<ObjectGetInfo[N]>
}

export type SpecificRequestDescriptor<N extends keyof ObjectGetInfo = keyof ObjectGetInfo> =
    SpecificRequestGetDescriptor<N> | SpecificRequestSetDescriptor<N>

export type SpecificRequestUris = {[name: string]: [string, ((...args: string[]) => string) | (() => string)] }
