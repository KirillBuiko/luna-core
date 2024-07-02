import type {
    FieldsNotType,
    KeysNotType,
    NarrowedDestination,
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
    mp?: (info?: I) => {
        fields?: FieldType[],
        streamName?: string,
        transformer?: Transform
    }
}

type SpecificGetResponseTransformers<I> = SpecificTransformers & {
    mp?: true
}

type SpecificSetResponseTransformers<I = FieldsNotType<GetInfo_Strict, string>> = {
    empty?: true
    json?: (response: object) => I,
    text?: (response: string) => I,
}

export type SpecificRequestBaseDescriptor<N extends keyof GetInfo_Strict = KeysNotType<GetInfo_Strict, string>,
    I = GetInfo_Strict[N]> = {
    names: [N, keyof DataInfo_Strict],
    requirements?: KeysOfObjects<I>[],
    inputOptions: {
        url: (info?: I) => string,
        httpMethod: HTTPMethods
    },
    outputOptions?: {
        endpointErrorHandler?: (error: ErrorDto) => ErrorDto
    }
}

export type SpecificRequestGetDescriptor<N extends keyof GetInfo_Strict = KeysNotType<GetInfo_Strict, string>,
    I = GetInfo_Strict[N]> = SpecificRequestBaseDescriptor<N, I> & {
    type: "GET",
    outputOptions?: SpecificGetResponseTransformers<I>
}

export type SpecificRequestSetDescriptor<N extends keyof GetInfo_Strict = KeysNotType<GetInfo_Strict, string>,
    I = GetInfo_Strict[N]> = SpecificRequestBaseDescriptor<N, I> & {
    type: "SET",
    inputOptions: {
        bodyType: "json" | "bytes" | "text" | "mp" | "none",
    } & SpecificSetBodyTransformers<I>,
    outputOptions?: SpecificSetResponseTransformers<I>
}

export type SpecificRequestDescriptor<N extends keyof GetInfo_Strict = KeysNotType<GetInfo_Strict, string>,
    I = GetInfo_Strict[N]> = SpecificRequestGetDescriptor<N, I> | SpecificRequestSetDescriptor<N, I>
