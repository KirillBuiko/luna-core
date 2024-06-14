import type {BusboyFileStream} from "@fastify/busboy";
import type {MainRequestsClient, MainRequestsHandlers} from "@grpc-build/MainRequests";
import type {Readable, Writable} from "node:stream";
import type {DataInfo} from "@grpc-build/DataInfo";

export type ProtocolType =
    | "GRPC"
    | "REST_API"

export type RequestName =
    | "GET"
    | "SET"

interface SourceReaderWriterOptions<
    ProtocolT extends ProtocolType, RequestN extends RequestName,
    SourceReaderT, SourceWriterT> {
    protocol: ProtocolT;
    requestName: RequestN;
    sourceReader?: SourceReaderT;
    sourceWriter?: SourceWriterT;
}

interface DestinationReaderWriterOptions<
    ProtocolT extends ProtocolType, RequestN extends RequestName,
    DestReaderT, DestWriterT> {
    protocol: ProtocolT,
    requestName: RequestN,
    destReader?: DestReaderT;
    destWriter?: DestWriterT;
}

export type SourceOptionsType =
    | SourceReaderWriterOptions<"GRPC", "GET",
    void, Parameters<MainRequestsHandlers["Get"]>[0]>

    | SourceReaderWriterOptions<"REST_API", "GET",
    void, (error, value?: MultipartTransferObject) => void>

    | SourceReaderWriterOptions<"GRPC", "SET",
    Parameters<MainRequestsHandlers["Set"]>[0], Parameters<MainRequestsHandlers["Set"]>[1]>

    | SourceReaderWriterOptions<"REST_API", "SET",
    BusboyFileStream, Parameters<MainRequestsHandlers["Set"]>[1]>

export type DestinationOptionsType =
    | DestinationReaderWriterOptions<"GRPC", "GET",
    ReturnType<MainRequestsClient["Get"]>, void>

    | DestinationReaderWriterOptions<"GRPC", "SET",
    Promise<NonNullable<Parameters<Parameters<MainRequestsClient["Set"]>[0]>[1]>>, ReturnType<MainRequestsClient["Set"]>>

    | DestinationReaderWriterOptions<"REST_API", "GET",
    Promise<MultipartTransferObject>, void>

    | DestinationReaderWriterOptions<"REST_API", "SET",
    Promise<NonNullable<Parameters<Parameters<MainRequestsClient["Set"]>[0]>[1]>>, Writable>

export type NarrowedOptionsType<
    ProtocolT extends ProtocolType, RequestN extends RequestName, OptionsT> =
    OptionsT extends { protocol: ProtocolT, requestName: RequestN }
        ? OptionsT : never;

export type NarrowedSource<
    ProtocolT extends ProtocolType = ProtocolType, RequestN extends RequestName = RequestName> =
    NarrowedOptionsType<ProtocolT, RequestN, SourceOptionsType>

export type NarrowedDestination<
    ProtocolT extends ProtocolType = ProtocolType, RequestN extends RequestName = RequestName> =
    NarrowedOptionsType<ProtocolT, RequestN, DestinationOptionsType>

export interface MultipartTransferObject<D = DataInfo, S = Readable> {
    info: D,
    data?: S
}
