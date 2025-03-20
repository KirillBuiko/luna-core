import type {DataInfo_Strict} from "@grpc-build/DataInfo";
import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";
import {varStorageUris} from "@/endpoints/specific-endpoints/endpointsUris";
import {SpecificRestApiEndpoint} from "@/endpoints/specific-endpoints/SpecificRestApiEndpoint";

const p = "REST_API";
type P = typeof p;
const uris = varStorageUris;

export class VariableStorageEndpoint extends SpecificRestApiEndpoint {
    getMapper = {
        VAR_VALUE: this.getValue,
        VAR_VALUE_LIST: this.getList,
    } as const satisfies SpecRequestHandlers<P, "GET", "VAR">;

    setMapper = {
        VAR_VALUE: this.addValue,
        VAR_VALUE_DELETE: this.deleteValue,
    } as const satisfies SpecRequestHandlers<P, "SET", "VAR">;

    protected getList(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        const uri = uris.getList;
        return this.getSpecificEndpoint(info, {
            type: "GET",
            inputOptions: {
                uri: uri[1],
                httpMethod: uri[0]
            }
        })
    }

    protected addValue(info: DataInfo_Strict): SpecHandlerReturnType<P, "SET"> {
        const uri = uris.addValue;
        return this.getSpecificEndpoint(info, {
            type: "SET",
            getInfoName: "varValueGet",
            inputOptions: {
                uri: uri[1],
                httpMethod: uri[0],
                bodyType: "bytes",
            },
            outputOptions: {
                text: (text) => ({
                    id: text
                }),
            }
        })
    }

    protected getValue(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        const uri = uris.getValue;
        return this.getSpecificEndpoint(info, {
            type: "GET",
            getInfoName: "varValueGet",
            requirements: ["id"],
            inputOptions: {
                uri: (info) => uri[1](info!.id!),
                httpMethod: uri[0]
            }
        })
    }

    protected deleteValue(info: DataInfo_Strict): SpecHandlerReturnType<P, "SET"> {
        const uri = uris.deleteValue;
        return this.getSpecificEndpoint(info, {
            type: "SET",
            getInfoName: "varValueGet",
            requirements: ["id"],
            inputOptions: {
                uri: (info) => uri[1](info!.id!),
                httpMethod: uri[0],
                bodyType: "none",
            },
            outputOptions: {
                empty: true
            }
        })
    }
}
