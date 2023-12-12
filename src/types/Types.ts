import type {BusboyFileStream} from "@fastify/busboy";
import type {DataRequestsClient, DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {Readable, Writable} from "node:stream";

export type ProtocolType =
    | "GRPC"
    | "REST_API"

export type RequestName =
    | "GET"
    | "SET"

export type RequestDirection =
    | "FROM"
    | "TO"

export type StreamType =
    | "READER"
    | "WRITER"

interface SourceReaderWriterOptions<
    ProtocolT extends ProtocolType, RequestN extends RequestName,
    SourceReaderT, SourceWriterT> {
    protocol: ProtocolT;
    requestName: RequestN;
    sourceReader?: SourceReaderT;
    writer?: SourceWriterT;
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
    void, Parameters<DataRequestsHandlers["Get"]>[0]>

    | SourceReaderWriterOptions<"REST_API", "GET",
    void, Writable>

    | SourceReaderWriterOptions<"GRPC", "SET",
    Parameters<DataRequestsHandlers["Set"]>[0], Parameters<DataRequestsHandlers["Set"]>[1]>

    | SourceReaderWriterOptions<"REST_API", "SET",
    BusboyFileStream, Parameters<DataRequestsHandlers["Set"]>[1]>

export type DestinationOptionsType =
    | DestinationReaderWriterOptions<"GRPC", "GET",
    ReturnType<DataRequestsClient["Get"]>, void>

    | DestinationReaderWriterOptions<"GRPC", "SET",
    Promise<NonNullable<Parameters<Parameters<DataRequestsClient["Set"]>[0]>[1]>>, ReturnType<DataRequestsClient["Set"]>>

    | DestinationReaderWriterOptions<"REST_API", "GET",
    Readable, void>

    | DestinationReaderWriterOptions<"REST_API", "SET",
    Promise<NonNullable<Parameters<Parameters<DataRequestsClient["Set"]>[0]>[1]>>, Writable>

// TODO: add rest destination types

export type NarrowedOptionsType<
    ProtocolT extends ProtocolType, RequestN extends RequestName, OptionsT> =
    OptionsT extends {protocol: ProtocolT, requestName: RequestN}
        ? OptionsT : never;

export type NarrowedSourceOptionsType<
    ProtocolT extends ProtocolType = ProtocolType, RequestN extends RequestName = RequestName> =
    NarrowedOptionsType<ProtocolT, RequestN, SourceOptionsType>

export type NarrowedDestinationOptionsType<
    ProtocolT extends ProtocolType = ProtocolType, RequestN extends RequestName = RequestName> =
    NarrowedOptionsType<ProtocolT, RequestN, DestinationOptionsType>

export interface RestApiQueryType {
    info: GetRequestInfo__Output
}
