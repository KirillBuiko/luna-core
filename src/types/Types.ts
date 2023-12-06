import type {BusboyFileStream} from "@fastify/busboy";
import type {DataRequestsClient, DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {FastifyReply} from "fastify";
import type {ProtocolType, RequestName} from "@/types/Enums";

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
    | SourceReaderWriterOptions<ProtocolType.GRPC, RequestName.GET,
    void, Parameters<DataRequestsHandlers["Get"]>[0]>

    | SourceReaderWriterOptions<ProtocolType.REST_API, RequestName.GET,
    void, FastifyReply>

    | SourceReaderWriterOptions<ProtocolType.GRPC, RequestName.SET,
    Parameters<DataRequestsHandlers["Set"]>[0], Parameters<DataRequestsHandlers["Set"]>[1]>

    | SourceReaderWriterOptions<ProtocolType.REST_API, RequestName.SET,
    BusboyFileStream, Parameters<DataRequestsHandlers["Set"]>[1]>

export type DestinationOptionsType =
    | DestinationReaderWriterOptions<ProtocolType.GRPC, RequestName.GET,
    ReturnType<DataRequestsClient["Get"]>, void>

    | DestinationReaderWriterOptions<ProtocolType.GRPC, RequestName.SET,
    Promise<NonNullable<Parameters<Parameters<DataRequestsClient["Set"]>[0]>[1]>>, ReturnType<DataRequestsClient["Set"]>>

export type NarrowedOptionsType<
    ProtocolT extends ProtocolType, RequestN extends RequestName, OptionsT> =
    OptionsT extends {protocol: ProtocolT, requestName: RequestN}
        ? OptionsT : never;

export type NarrowedSourceOptionsType<
    ProtocolT extends ProtocolType, RequestN extends RequestName> =
    NarrowedOptionsType<ProtocolT, RequestN, SourceOptionsType>

export type NarrowedDestinationOptionsType<
    ProtocolT extends ProtocolType, RequestN extends RequestName> =
    NarrowedOptionsType<ProtocolT, RequestN, DestinationOptionsType>

export interface RestApiQueryType {
    info: GetRequestInfo__Output
}
