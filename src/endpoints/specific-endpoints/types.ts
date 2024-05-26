import type {NarrowedDestination, ProtocolType, RequestName} from "@/types/Types";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {RequestType__Output} from "@grpc-build/RequestType";

type SelectByName<M extends string, T extends string> =
    { [key in T]: key extends `${M}${infer R}` ? key : never }[T];
export type SpecHandlerReturnType<P extends ProtocolType, R extends RequestName> =
    Pick<NarrowedDestination<P, R>, "destReader" | "destWriter">;
type SpecRequestFunction<P extends ProtocolType, R extends RequestName> =
    (info: R extends "GET" ? GetInfo__Output : DataInfo__Output) => SpecHandlerReturnType<P, R>
export type SpecRequestFunctions<P extends ProtocolType, R extends RequestName, RT extends string> =
    { [request in SelectByName<RT, RequestType__Output>]?: SpecRequestFunction<P, R> }
