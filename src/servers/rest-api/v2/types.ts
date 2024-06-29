import type {HTTPMethods} from "fastify/types/utils";
import type {RequestType__Output} from "@grpc-build/RequestType";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {FastifyReply} from "fastify";
import type {KeysOfObjects, MultipartTransferObject} from "@/types/general";

export type GetRouteHandler = (opts: { res: FastifyReply, error: any, value?: MultipartTransferObject | null }) => void
export type SetRouteHandler = (opts: { res: FastifyReply, error: any, info?: GetInfo | null }) => void

export type V2RouteDescriptor = {
    http: [HTTPMethods, string],
    requestType: RequestType__Output,
    successCode: number,
    // failCode: number,
} & ({
    requestName: "GET",
    params?: KeysOfObjects<GetInfo[keyof GetInfo]>[],
    manualHandler?: GetRouteHandler
} | {
    requestName: "SET",
    params?: KeysOfObjects<GetInfo[keyof GetInfo]>,
    manualHandler?: SetRouteHandler
})
