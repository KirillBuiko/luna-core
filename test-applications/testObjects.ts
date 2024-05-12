import type {GetInfo, GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";

const getProgramInfo: GetInfo = {
    requestType: "CODE_F",
    infoType: "codeFGet",
    codeFGet: {
        id: "123123"
    }
}

const setProgramInfo: DataInfo = {
    requestType: "CODE_F",
    dataType: "BYTES",
    dataValueType: "codeF",
    codeF: {
        getInfo: {
            id: "123123"
        }
    }
}

const getModuleInfo: GetInfo__Output = {
    requestType: "CODE_F",
    infoType: "codeFGet",
    codeFGet: {
         id: "123123"
    }
}

const setModuleInfo: DataInfo = {
    requestType: "CODE_F",
    dataType: "BYTES",
    dataValueType: "codeF",
    codeF: {
        getInfo: {
            id: "123123"
        },
        value: "wwdqwd3"
    }
}

// Program requests to GRPC endpoint (server-grpc)
// Module requests to Rest API endpoint (server-restapi)
export const testObjects =
    // {get: getProgramInfo, set: setProgramInfo}
    {get: getModuleInfo, set: setModuleInfo}
