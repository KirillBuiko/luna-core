import type {HTTPMethods} from "fastify/types/utils";
import type {RequestType__Output} from "@grpc-build/RequestType";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {FastifyReply} from "fastify";
import type {MultipartTransferObject} from "@/types/Types";

export type GetRouteHandler = (opts: { res: FastifyReply, error: any, value?: MultipartTransferObject | null }) => void
export type SetRouteHandler = (opts: { res: FastifyReply, error: any, info?: GetInfo | null }) => void

type Keys<T> = T extends object ? keyof T : never;
export type V2RouteDescriptor = {
    http: [HTTPMethods, string],
    requestType: RequestType__Output,
    successCode: number, failCode: number,
} & ({
    requestName: "GET",
    params?: Keys<GetInfo[keyof GetInfo]>[],
    manualHandler?: GetRouteHandler
} | {
    requestName: "SET",
    params?: Keys<GetInfo[keyof GetInfo]>,
    manualHandler?: SetRouteHandler
})
