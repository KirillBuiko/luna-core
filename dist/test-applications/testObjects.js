"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testObjects = void 0;
const getProgramInfo = {
    requestType: "PROGRAM",
    variableGetInfo: {
        variableId: "123123"
    }
};
const setProgramInfo = {
    requestType: "PROGRAM",
    dataType: "FILE",
    variableDataInfo: {
        getInfo: {
            variableId: "123123"
        }
    }
};
const getModuleInfo = {
    requestType: "MODULE",
    variableGetInfo: {
        variableId: "123123"
    }
};
const setModuleInfo = {
    requestType: "MODULE",
    dataType: "FILE",
    variableDataInfo: {
        getInfo: {
            variableId: "123123"
        }
    }
};
// Program requests to GRPC endpoint (server-grpc)
// Module requests to Rest API endpoint (server-restapi)
exports.testObjects = 
// {get: getProgramInfo, set: setProgramInfo}
{ get: getModuleInfo, set: setModuleInfo };
