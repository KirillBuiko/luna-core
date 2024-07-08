import type {DataInfo_Strict} from "@grpc-build/DataInfo";
import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";
import {varStorageUris} from "@/endpoints/specific-endpoints/endpointsUris";
import {SpecificRestApiEndpoint} from "@/endpoints/specific-endpoints/SpecificRestApiEndpoint";

const p = "REST_API";
type P = typeof p;
const uris = varStorageUris;

export class VariableStorageEndpoint extends SpecificRestApiEndpoint {
    getMapper: SpecRequestHandlers<P, "GET", "VAR"> = {
        VAR_VALUE: this.getValue,
        VAR_VALUE_LIST: this.getList,
        // VAR_VALUE_META: this,
    } as const;

    setMapper: SpecRequestHandlers<P, "SET", "VAR"> = {
        VAR_VALUE: this.addValue,
        VAR_VALUE_DELETE: this.deleteValue,
        // VAR_VALUE_META: this.varValueMetaSetHandler,
        // VAR_VALUE_META_DELETE: this.varValueMetaDeleteSetHandler,
    } as const;

    protected getList(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        // const name: keyof DataInfo_Strict = "varValueList";
        // const getName: keyof GetInfo = "";
        // const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        // const reader = (async (): Promise<MultipartTransferObject> => {
        //     try {
        //         const json = await this.requestJson({
        //             url: urls.getList[1](this.config.host),
        //             method: urls.getList[0]
        //         })
        //         return {
        //             info: {
        //                 requestType: info.requestType,
        //                 dataType: "JSON",
        //                 dataValueType: name,
        //                 [name]: {value: json}
        //             }
        //         }
        //     } catch (e) {
        //         throw e;
        //     }
        // })()
        // return {
        //     destReader: reader
        // }
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
        // // const name: keyof DataInfo_Strict = "varValue";
        // const getName: keyof GetInfo_Strict = "varValueGet";
        // // const setInfo = this.getDataInfo<DataInfo_Strict[typeof name]>(info);
        //
        // const {reader, dataWriter} = this.sendStream({
        //     url: urls.addValue[1](),
        //     method: urls.addValue[0],
        // })
        //
        // const transformedReader = (async (): Promise<GetInfo_Strict> => {
        //     const id = await (await reader).text();
        //     return {
        //         requestType: info.requestType,
        //         infoType: getName,
        //         [getName]: {
        //             id: id
        //         }
        //     } as GetInfo_Strict
        // })()
        //
        // return {
        //     destReader: transformedReader,
        //     destWriter: dataWriter
        // }
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
                })
            }
        })
    }

    protected getValue(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        // const name: keyof DataInfo_Strict = "varValue";
        // const getName: keyof GetInfo_Strict = "varValueGet";
        // const getInfo = this.getGetInfo<GetInfo_Strict[typeof getName]>(info);
        //
        // const reader = (async (): Promise<MultipartTransferObject> => {
        //     if (!getInfo.id) {
        //         throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
        //     }
        //     try {
        //         const stream = await this.requestStream({
        //             url: uris.getValue[1](getInfo.id),
        //             method: uris.getValue[0]
        //         });
        //         return {
        //             info: {
        //                 requestType: info.requestType,
        //                 dataType: "BYTES"
        //             },
        //             data: stream
        //         }
        //     } catch (e) {
        //         throw e;
        //     }
        // })()
        //
        // return {
        //     destReader: reader
        // }
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
