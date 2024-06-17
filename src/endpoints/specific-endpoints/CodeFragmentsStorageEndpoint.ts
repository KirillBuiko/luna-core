import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {MultipartTransferObject, NarrowedDestination} from "@/types/Types";
import {PassThrough} from "node:stream";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";
import type {CodeFGet} from "@grpc-build/CodeFGet";
import type {CodeFInfoGet} from "@grpc-build/CodeFInfoGet";
import type {CodeFPluginProcedureGet} from "@grpc-build/CodeFPluginProcedureGet";
import type {CodeFData} from "@grpc-build/CodeFData";
import type {CodeFPluginData} from "@grpc-build/CodeFPluginData";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {strTemplates} from "@/endpoints/strTemplates";

const p = "REST_API";
type P = typeof p;

export class CodeFStorageEndpoint extends RestApiEndpoint {
    getMapper: SpecRequestHandlers<P, "GET", "CODE_F"> = {
        CODE_F: this.codeFGetHandler,
        CODE_F_LIST: this.codeFListGetHandler,
        CODE_F_INFO: this.codeFInfoHandler,
        CODE_F_PLUGINS_LIST: this.codeFPluginsListGetHandler,
        CODE_F_PLUGIN_PROCEDURE: this.codeFPluginProcedureGetHandler,
    } as const;

    setMapper: SpecRequestHandlers<P, "SET", "CODE_F"> = {
        CODE_F: this.codeFSetHandler,
        CODE_F_PLUGIN: this.codeFPluginSetHandler,
    } as const;

    protected getGetHandler(info: GetInfo__Output): NarrowedDestination<P, "GET"> {
        if (!(info.requestType && info.requestType in this.getMapper))
            throw new ErrorDto("not-supported", strTemplates.notSupported("Request type"));
        const handlers: SpecHandlerReturnType<P, "GET"> =
            (this.getMapper[info.requestType].bind(this))(info);
        return {
            requestName: "GET",
            protocol: p,
            ...handlers
        }
    }

    protected getSetHandler(info: DataInfo__Output): NarrowedDestination<P, "SET"> {
        if (!(info.requestType && info.requestType in this.setMapper))
            throw new ErrorDto("not-supported", strTemplates.notSupported("Request type"));
        const handlers: SpecHandlerReturnType<P, "SET"> =
            (this.setMapper[info.requestType].bind(this))(info);
        return {
            requestName: "SET",
            protocol: p,
            ...handlers
        }
    }

    protected codeFGetHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /{className}/target_code
        // const name: keyof DataInfo__Output = "codeF";
        const getInfo = this.getGetInfo(info) as CodeFGet;
        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const stream = await this.getStream({
                    url: `${this.config.host}/${getInfo.id}/target_code`
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

    protected codeFInfoHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /{codeF_id}/info
        const name: keyof DataInfo__Output = "codeFInfo";
        const getInfo = this.getGetInfo(info) as CodeFInfoGet;
        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.getJson({
                    url: `${this.config.host}/${getInfo.id}/info`
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

    protected codeFListGetHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        const name: keyof DataInfo__Output = "codeFList";
        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.getJson({
                    url: `${this.config.host}/code_fragments`
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

    protected codeFPluginsListGetHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /plugins
        const name: keyof DataInfo__Output = "codeFPluginsList";
        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const json = await this.getJson({
                    url: `${this.config.host}/plugins`
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

    protected codeFPluginProcedureGetHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /{codeF_id}/pluginProcedure
        const name: keyof DataInfo__Output = "codeFPluginProcedure";
        const getInfo = this.getGetInfo(info) as CodeFPluginProcedureGet;
        const reader = (async (): Promise<MultipartTransferObject> => {
            try {
                const value = await this.getJson({
                    url: `${this.config.host}/${getInfo.codeFId}` +
                        `/pluginProcedure?type=${getInfo.type}`
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

    protected codeFSetHandler(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        // /add_codeF
        // const name: keyof DataInfo__Output = "codeF";
        const setInfo = this.getDataInfo(info) as CodeFData;

        if (!setInfo.getInfo || !setInfo.getInfo.id || !setInfo.value) {
            throw new ErrorDto("invalid-argument", strTemplates.notValid("Data info"))
        }

        // console.log(setInfo.getInfo.id);

        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/add_code_fragment`,
            streamName: "file",
            fields: [
                {key: "id", value: setInfo.getInfo.id, contentType: "text/plain"},
                {key: "json", value: setInfo.value, contentType: "application/json"}
            ]
        })

        const transformedReader = (async (): Promise<GetInfo__Output> => {
            const response = await reader;
            return {
                requestType: info.requestType
            } as GetInfo__Output
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    protected codeFPluginSetHandler(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        // /add_plugin
        // const name: keyof DataInfo__Output = "codeFPlugin";
        const setInfo = info[info.dataValueType] as CodeFPluginData;

        if (!setInfo) {
            return {
                destWriter: new PassThrough(),
                destReader: Promise.reject(
                    new ErrorDto("invalid-argument", strTemplates.notProvided("Data info")))
            }
        }

        if (!setInfo.getInfo || !setInfo.getInfo.pluginId) {
            return {
                destWriter: new PassThrough(),
                destReader: Promise.reject(
                    new ErrorDto("invalid-argument", strTemplates.notValid("Data info")))
            }
        }

        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/add_plugin`,
            streamName: "file",
            fields: [
                {key: "id", value: setInfo.getInfo.pluginId},
            ]
        })

        const transformedReader = (async (): Promise<GetInfo__Output> => {
            const response = await reader;
            return {
                requestType: info.requestType
            } as GetInfo__Output
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    //-  /codeFs
    //?  /{codeF_id}/plugins <=codeF_id
    //-  /plugins
    //-  /{codeF_id}/info <=codeF_id
    //   /add_codeF <=MP(id, json, file) (json?)=>
    //   /add_plugin <=MP(id, file) (json?)=>
    //-  /{codeF_id}/pluginProcedure
    //-  /{className}/target_code
}
