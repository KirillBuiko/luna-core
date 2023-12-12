import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";

const getProgramInfo: GetRequestInfo = {
    requestType: "PROGRAM",
    variableGetInfo: {
        variableId: "123123"
    }
}

const setProgramInfo: DataRequestInfo = {
    requestType: "PROGRAM",
    dataType: "FILE",
    variableDataInfo: {
        getInfo: {
            variableId: "123123"
        }
    }
}

const getModuleInfo: GetRequestInfo = {
    requestType: "MODULE",
    variableGetInfo: {
        variableId: "123123"
    }
}

const setModuleInfo: DataRequestInfo = {
    requestType: "MODULE",
    dataType: "FILE",
    variableDataInfo: {
        getInfo: {
            variableId: "123123"
        }
    }
}

// Program requests to GRPC endpoint (server-grpc)
// Module requests to Rest API endpoint (server-restapi)
export const testObjects =
    // {get: getProgramInfo, set: setProgramInfo}
    {get: getModuleInfo, set: setModuleInfo}
