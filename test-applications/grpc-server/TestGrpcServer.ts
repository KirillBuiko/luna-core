import {AbstractGrpcServer} from "@/servers/AbstractGrpcServer";
import type {sendUnaryData, ServerReadableStream, ServerWritableStream} from "@grpc/grpc-js";
import type {GetRequestInfo, GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataStream, DataStream__Output} from "@grpc-build/DataStream";

export class TestGrpcServer extends AbstractGrpcServer {
    constructor(protoPath: string) {
        super(protoPath);
    }

    getHandler = (call: ServerWritableStream<GetRequestInfo__Output, DataStream>) => {

    }

    setHandler = (call: ServerReadableStream<DataStream__Output, GetRequestInfo>,
                  callback: sendUnaryData<GetRequestInfo>) => {

    }
}