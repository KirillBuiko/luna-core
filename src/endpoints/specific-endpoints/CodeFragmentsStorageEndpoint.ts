import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo, GetInfo__Output} from "@grpc-build/GetInfo";
import type {MultipartTransferObject} from "@/types/general";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";
import {codeFApi} from "@/endpoints/specific-endpoints/endpointsUrls";
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

    protected getFragment(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // const name: keyof DataInfo__Output = "codeF";
        const getName: keyof GetInfo = "codeFGet";
        const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.id) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const stream = await this.requestStream({
                    url: codeFApi.getFragment[1](this.config.host, getInfo.id),
                    method: codeFApi.getFragment[0]
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

    protected getInfo(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo__Output = "codeFInfo";
        const getName: keyof GetInfo = "codeFInfoGet";
        const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.id) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const json = await this.requestJson({
                    url: codeFApi.getInfo[1](this.config.host, getInfo.id),
                    method: codeFApi.getInfo[0]
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

    protected getList(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo__Output = "codeFList";
        // const getName: keyof GetInfo = "";
        // const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.requestJson({
                    url: codeFApi.getList[1](this.config.host),
                    method: codeFApi.getList[0]
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

    protected getPluginsList(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo__Output = "codeFPluginsList";
        // const getName: keyof GetInfo = "";
        // const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.requestJson({
                    url: codeFApi.getPluginsList[1](this.config.host)
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

    protected getPluginProcedure(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo__Output = "codeFPluginsList";
        const getName: keyof GetInfo = "codeFPluginProcedureGet";
        const getInfo = this.getGetInfo<GetInfo[typeof getName]>(info);

        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo.codeFId || !getInfo.type) {
                throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
            }
            try {
                const value = await this.requestJson({
                    url: codeFApi.getPluginProcedure[1](this.config.host, getInfo.codeFId, getInfo.type),
                    method: codeFApi.getPluginProcedure[0]
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

    protected addFragment(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        const name: keyof DataInfo__Output = "codeF";
        // const getName: keyof GetInfo = "codeFGet";
        const setInfo = this.getDataInfo<DataInfo__Output[typeof name]>(info);

        if (!setInfo.getInfo || !setInfo.getInfo.id || !setInfo.value) {
            throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
        }

        // console.log(setInfo.getInfo.id);

        const {reader, dataWriter} = this.sendMultipart({
            url: codeFApi.addFragment[1](this.config.host),
            method: codeFApi.addFragment[0],
            streamName: "file",
            fields: [
                {key: "id", value: setInfo.getInfo.id, contentType: "text/plain"},
                {key: "json", value: setInfo.value, contentType: "application/json"}
            ]
        })

        const transformedReader = (async (): Promise<GetInfo__Output> => {
            await reader;
            return {
                requestType: info.requestType
            } as GetInfo__Output
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    protected addPlugin(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        const name: keyof DataInfo__Output = "codeFPlugin";
        // const getName: keyof GetInfo = "codeF";
        const setInfo = this.getDataInfo<DataInfo__Output[typeof name]>(info);

        if (!setInfo.getInfo || !setInfo.getInfo.id) {
            throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
        }

        const {reader, dataWriter} = this.sendMultipart({
            url: codeFApi.addPlugin[1](this.config.host),
            method: codeFApi.addPlugin[0],
            streamName: "file",
            fields: [
                {key: "id", value: setInfo.getInfo.id},
            ]
        })

        const transformedReader = (async (): Promise<GetInfo__Output> => {
            await reader;
            return {
                requestType: info.requestType
            } as GetInfo__Output
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }
}
