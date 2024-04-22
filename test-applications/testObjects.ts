import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";

const getProgramInfo: GetRequestInfo = {
    requestType: "PROGRAM",
    codeFragmentGet: {
        id: "123123"
    }
}

const setProgramInfo: DataRequestInfo = {
    requestType: "PROGRAM",
    dataType: "FILE",
    codeFragment: {
        getInfo: {
            id: "123123"
        }
    }
}

const getModuleInfo: GetRequestInfo = {
    requestType: "CODE_FRAGMENT",
    codeFragmentGet: {
         id: "123123"
    }
}

const setModuleInfo: DataRequestInfo = {
    requestType: "CODE_FRAGMENT",
    dataType: "FILE",
    codeFragment: {
        getInfo: {
            id: "123123"
        }
    }
}

// Program requests to GRPC endpoint (server-grpc)
// Module requests to Rest API endpoint (server-restapi)
export const testObjects =
    // {get: getProgramInfo, set: setProgramInfo}
    {get: getModuleInfo, set: setModuleInfo}
