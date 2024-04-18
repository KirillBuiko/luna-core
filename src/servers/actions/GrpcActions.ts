import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {IRequestManager} from "@/app/types/IRequestManager";

export class GrpcActions {
    constructor(private requestManager: IRequestManager){};

    getHandler: DataRequestsHandlers["Get"] = (call) => {
        this.requestManager?.register({
            protocol: "GRPC",
            requestName: "GET",
            sourceWriter: call,
            sourceReader: undefined
        }, call.request);
    }

    setHandler: DataRequestsHandlers["Set"] = (call, callback) => {
        call.once("data", info => {
            if (info.infoOrData === "info") {
                this.requestManager?.register({
                    protocol: "GRPC",
                    requestName: "SET",
                    sourceWriter: callback,
                    sourceReader: call
                }, info.info);
            } else {
                call.destroy(ErrorMessage.create(Status.FAILED_PRECONDITION, "Not info first"));
            }
        })
    }
}
