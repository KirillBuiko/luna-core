import type {DataInfo_Strict} from "@grpc-build/DataInfo";
import type {GetInfo, GetInfo_Strict} from "@grpc-build/GetInfo";
import type {MultipartTransferObject} from "@/types/general";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import {codeFUris} from "@/endpoints/specific-endpoints/endpointsUrls";
import {SpecificRestApiEndpoint} from "@/endpoints/specific-endpoints/SpecificRestApiEndpoint";

const p = "REST_API";
type P = typeof p;

export class CodeFStorageEndpoint extends SpecificRestApiEndpoint {
    getMapper: SpecRequestHandlers<P, "GET", "CODE_F"> = {
        CODE_F: this.getFragment,
        CODE_F_LIST: this.getList,
        CODE_F_INFO: this.getInfo,
        CODE_F_PLUGINS_LIST: this.getPluginsList,
        CODE_F_PLUGIN_PROCEDURE: this.getPluginProcedure,
    } as const;

    setMapper: SpecRequestHandlers<P, "SET", "CODE_F"> = {
        CODE_F: this.addFragment,
        CODE_F_PLUGIN: this.addPlugin,
    } as const;

    protected getFragment(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        // const name: keyof DataInfo_Strict = "codeF";
        const getName: keyof GetInfo = "codeFGet";
        const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.id) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const stream = await this.requestStream({
                    url: this.config.host + codeFUris.getFragment[1](getInfo.id),
                    method: codeFUris.getFragment[0]
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

    protected getInfo(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo_Strict = "codeFInfo";
        const getName: keyof GetInfo = "codeFInfoGet";
        const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.id) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const json = await this.requestJson({
                    url: this.config.host + codeFUris.getInfo[1](getInfo.id),
                    method: codeFUris.getInfo[0]
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

    protected getList(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo_Strict = "codeFList";
        // const getName: keyof GetInfo = "";
        // const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.requestJson({
                    url: this.config.host + codeFUris.getList[1](),
                    method: codeFUris.getList[0]
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

    protected getPluginsList(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo_Strict = "codeFPluginsList";
        // const getName: keyof GetInfo = "";
        // const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.requestJson({
                    url: this.config.host + codeFUris.getPluginsList[1]()
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

    protected getPluginProcedure(info: GetInfo_Strict): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo_Strict = "codeFPluginsList";
        const getName: keyof GetInfo = "codeFPluginProcedureGet";
        const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.codeFId || !getInfo.type) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const value = await this.requestJson({
                    url: this.config.host + codeFUris.getPluginProcedure[1](getInfo.codeFId, getInfo.type),
                    method: codeFUris.getPluginProcedure[0]
                });
                return {
                    info: {
                        requestType: info.requestType,
                        dataType: "JSON",
                        dataValueType: name,
                        [name]: {value: value}
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

    protected addFragment(info: DataInfo_Strict): SpecHandlerReturnType<P, "SET"> {
        const name: keyof DataInfo_Strict = "codeF";
        // const getName: keyof GetInfo = "codeFGet";
        const setInfo = this.getDataInfo<DataInfo_Strict[typeof name]>(info);

        if (!setInfo.getInfo || !setInfo.getInfo.id || !setInfo.value) {
            throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
        }

        // console.log(setInfo.getInfo.id);

        const {reader, dataWriter} = this.sendMultipart({
            url: this.config.host + codeFUris.addFragment[1](),
            method: codeFUris.addFragment[0],
            streamName: "file",
            fields: [
                {key: "id", value: setInfo.getInfo.id, contentType: "text/plain"},
                {key: "json", value: setInfo.value, contentType: "application/json"}
            ]
        })

        const transformedReader = (async (): Promise<GetInfo_Strict> => {
            await reader;
            return {
                requestType: info.requestType
            } as GetInfo_Strict
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    protected addPlugin(info: DataInfo_Strict): SpecHandlerReturnType<P, "SET"> {
        const name: keyof DataInfo_Strict = "codeFPlugin";
        // const getName: keyof GetInfo = "codeF";
        const setInfo = this.getDataInfo<DataInfo_Strict[typeof name]>(info);

        if (!setInfo.getInfo || !setInfo.getInfo.id) {
            throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
        }

        const {reader, dataWriter} = this.sendMultipart({
            url: this.config.host + codeFUris.addPlugin[1](),
            method: codeFUris.addPlugin[0],
            streamName: "file",
            fields: [
                {key: "id", value: setInfo.getInfo.id},
            ]
        })

        const transformedReader = (async (): Promise<GetInfo_Strict> => {
            await reader;
            return {
                requestType: info.requestType
            } as GetInfo_Strict
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }
}
