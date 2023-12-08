import {AbstractGrpcServer} from "@/servers/AbstractGrpcServer";
import type {sendUnaryData, ServerReadableStream, ServerWritableStream} from "@grpc/grpc-js";
import type {GetRequestInfo, GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import type {DataStream, DataStream__Output} from "@grpc-build/DataStream";
import fs from "fs";
import path from "path";

export class TestGrpcServer extends AbstractGrpcServer {
    constructor(protoPath: string) {
        super(protoPath);
    }

    getHandler = async (call: ServerWritableStream<GetRequestInfo__Output, DataStream>) => {
        console.log("GET REQUEST");
        call.write({
            info: {
                requestType: call.request.requestType,
                dataType: "FILE"
            }
        });
        const fileStream = fs.createReadStream(path.join(__dirname, "..", "test-data.txt"));
        fileStream.on("data", data => {
            call.write({
                chunkData: data
            });
        })
        fileStream.on("end", () => call.end())
    }

    setHandler = (call: ServerReadableStream<DataStream__Output, GetRequestInfo>,
                  callback: sendUnaryData<GetRequestInfo>) => {
        console.log("SET REQUEST");
        call.on("data", data => {
            console.log(data.infoOrData == "info" ? data.info : data.chunkData.toString());
        })

        call.on("end", () => {
            callback(null, {
                taskGetInfo: {
                    taskId: "123123"
                }
            })
        })
    }
}