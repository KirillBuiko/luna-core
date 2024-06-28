import type {NarrowedDestination, ProtocolType, RequestName} from "@/types/Types";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {RequestType__Output} from "@grpc-build/RequestType";
import type {FieldType} from "@/endpoints/RestApiEndpoint";
import type {Duplex} from "stream";
import type {ErrorDto} from "@/endpoints/ErrorDto";
import type {HTTPMethods} from "fastify/types/utils";

type SelectByName<M extends string, T extends string> =
    { [key in T]: key extends `${M}${infer R}` ? key : never }[T];
export type SpecHandlerReturnType<P extends ProtocolType, R extends RequestName> =
    Pick<NarrowedDestination<P, R>, "destReader" | "destWriter">;
type SpecRequestHandler<P extends ProtocolType, R extends RequestName> =
    (info: R extends "GET" ? GetInfo__Output : DataInfo__Output) => SpecHandlerReturnType<P, R>
export type SpecRequestHandlers<P extends ProtocolType, R extends RequestName, RT extends string> =
    { [request in SelectByName<RT, RequestType__Output>]?: SpecRequestHandler<P, R> }

type SpecificDataConverters<I> = {
    json?: (response: object) => object,
    text?: (response: string) => string,
    stream?: Duplex,

    // smth wrong with mp - output should receive fields+stream and return multipartDto, but now i don't care
    mp?: (info: I) => {
        fields?: FieldType[],
        streamName?: string,
        transformer?: Duplex
    }
}

export type SpecificRequestDescriptor<N extends keyof GetInfo__Output = keyof GetInfo__Output,
    I = NonNullable<GetInfo__Output[N]>> = {
    names: [N, keyof DataInfo__Output],
    requirements?: (keyof I)[],
    inputOptions: {
        url: (info: I) => string,
        httpMethod: HTTPMethods
    },
    outputOptions?: {
        endpointErrorHandler: (error: ErrorDto) => ErrorDto
    }
} & ({
    type: "SET",
    inputOptions: {
        bodyType?: "json" | "bytes" | "text",
    } & SpecificDataConverters<I>,
    outputOptions: {
        json?: (response: object) => GetInfo__Output[N],
        text?: (response: string) => GetInfo__Output[N],
        empty?: true
    }
} | {
    type: "GET",
    outputOptions?: SpecificDataConverters<I>
})

const a: SpecificRequestDescriptor<"varValueGet"> = {
    names: ["varValueGet", "varValue"],
    type: "GET",
    requirements: ["id"],
    inputOptions: {
        url: (info) => `var/${info.id}`,
        httpMethod: "GET"
    }
}
