import type {GetInfo, GetInfo__Output} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";

const getProgramInfo: GetInfo = {
    requestType: "CF",
    infoType: "cfGet",
    cfGet: {
        id: "123123"
    }
}

const setProgramInfo: DataInfo = {
    requestType: "CF",
    dataType: ["FILE"],
    dataValueType: "cf",
    cf: {
        getInfo: {
            id: "123123"
        }
    }
}

const getModuleInfo: GetInfo__Output = {
    requestType: "CF",
    infoType: "cfGet",
    cfGet: {
         id: "123123"
    }
}

const setModuleInfo: DataInfo = {
    requestType: "CF",
    dataType: ["FILE"],
    dataValueType: "cf",
    cf: {
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
