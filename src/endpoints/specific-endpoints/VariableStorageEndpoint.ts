import type {DataInfo_Strict} from "@grpc-build/DataInfo";
import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import type {MultipartTransferObject} from "@/types/general";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import {varStorageUrls} from "@/endpoints/specific-endpoints/endpointsUrls";
import {SpecificRestApiEndpoint} from "@/endpoints/specific-endpoints/SpecificRestApiEndpoint";

const p = "REST_API";
type P = typeof p;
const urls = varStorageUrls;

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
        const name: keyof DataInfo_Strict = "varValueList";
        // const getName: keyof GetInfo = "";
        // const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.requestJson({
                    url: urls.getList[1](this.config.host),
                    method: urls.getList[0]
                })
                return {
                    info: {
                        requestType: info.requestType,
                        dataType: "JSON",
                        dataValueType: name,
                        [name]: {value: json}
                    }
                }
            } catch (e) {
                throw e;
            }
        })()
        return {
            destReader: reader
        }
    }

    protected addValue(info: DataInfo_Strict): SpecHandlerReturnType<P, "SET"> {
        // const name: keyof DataInfo_Strict = "varValue";
        const getName: keyof GetInfo_Strict = "varValueGet";
        // const setInfo = this.getDataInfo<DataInfo_Strict[typeof name]>(info);

        const {reader, dataWriter} = this.sendStream({
            url: urls.addValue[1](this.config.host),
            method: urls.addValue[0],
        })

        const transformedReader = (async (): Promise<GetInfo_Strict> => {
            const id = await (await reader).text();
            return {
                requestType: info.requestType,
                infoType: getName,
                [getName]: {
                    id: id
                }
            } as GetInfo_Strict
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    protected getValue(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        // const name: keyof DataInfo_Strict = "varValue";
        const getName: keyof GetInfo_Strict = "varValueGet";
        const getInfo = this.getGetInfo<GetInfo_Strict[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.id) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const stream = await this.requestStream({
                    url: urls.getValue[1](this.config.host, getInfo.id),
                    method: urls.getValue[0]
                });
                return {
                    info: {
                        requestType: info.requestType,
                        dataType: "BYTES"
                    },
                    data: stream
                }
            } catch (e) {
                throw e;
            }
        })()

        return {
            destReader: reader
        }
    }

    protected deleteValue(info: DataInfo_Strict): SpecHandlerReturnType<P, "SET"> {
        const name: keyof DataInfo_Strict = "varValueDelete";
        // const getName: keyof GetInfo_Strict = "var";
        const setInfo = this.getDataInfo<DataInfo_Strict[typeof name]>(info);

        const reader = (async (): Promise<GetInfo_Strict> => {
            if (!setInfo.getInfo || !setInfo.getInfo.id) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                await this.baseFetch({
                    url: urls.deleteValue[1](this.config.host, setInfo.getInfo.id),
                    method: urls.deleteValue[0]
                })
                return {
                    requestType: info.requestType,
                } as GetInfo_Strict
            } catch (e) {
                throw e;
            }
        })()

        return {
            destReader: reader
        }
    }
}
