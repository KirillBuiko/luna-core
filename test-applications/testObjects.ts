import type {GetInfo, GetInfo_Strict} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import fs from "fs";
import path from "path";

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
            id: "test_Convolution"
        },
        value: fs.readFileSync(path.join(__dirname, "./test-data/Convolution/description.json"), 'utf-8')
    }
}

const getModuleInfo: GetInfo_Strict = {
    requestType: "CODE_F",
    infoType: "codeFGet",
    codeFGet: {
         id: "Convolution"
    }
}

const setModuleInfo: DataInfo = {
    requestType: "CODE_F",
    dataType: "BYTES",
    dataValueType: "codeF",
    codeF: {
        getInfo: {
            id: "test_Convolution"
        },
        value: fs.readFileSync(path.join(__dirname, "./test-data/Convolution/description.json"), 'utf-8')
    }
}

// Program requests to GRPC endpoint (server-grpc)
// Module requests to Rest API endpoint (server-restapi)
export const testObjects =
    // {get: getProgramInfo, set: setProgramInfo}
    {get: getModuleInfo, set: setModuleInfo}
