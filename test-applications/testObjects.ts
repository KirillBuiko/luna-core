import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";

export const getProgramInfo: GetRequestInfo = {
    requestType: "PROGRAM",
    variableGetInfo: {
        variableId: "123123"
    }
}

export const setProgramInfo: DataRequestInfo = {
    requestType: "PROGRAM",
    variableDataInfo: {
        getInfo: {
            variableId: "123123"
        }
    }
}
