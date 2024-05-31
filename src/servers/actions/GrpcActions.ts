import type {MainRequestsHandlers} from "@grpc-build/MainRequests";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";

export class GrpcActions {
    constructor(private requestManager: IRequestManager){};

    getHandler: MainRequestsHandlers["Get"] = (call) => {
        this.requestManager?.register({
            protocol: "GRPC",
            requestName: "GET",
            sourceWriter: call,
            sourceReader: undefined
        }, call.request);
    }

    setHandler: MainRequestsHandlers["Set"] = (call, callback) => {
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
