import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {MultipartTransferObject, NarrowedDestination, ProtocolType, RequestName} from "@/types/Types";
import type {RequestType__Output} from "@grpc-build/RequestType";
import {PassThrough} from "node:stream";

const p = "REST_API";
type P = typeof p;

type SelectByName<M extends string, T extends string> =
    { [key in T]: key extends `${M}${infer R}` ? key : never }[T];
type SpecHandlerReturnType<P extends ProtocolType, R extends RequestName> =
    Pick<NarrowedDestination<P, R>, "destReader" | "destWriter">;
type SpecRequestFunction<P extends ProtocolType, R extends RequestName> =
    (info: R extends "GET" ? GetInfo__Output : DataInfo__Output) => SpecHandlerReturnType<P, R>

type SpecRequestFunctions<P extends ProtocolType, R extends RequestName, RT extends string> =
    { [request in SelectByName<RT, RequestType__Output>]?: SpecRequestFunction<P, R> }

export class codeFStorageEndpoint extends RestApiEndpoint {
    getMapper: SpecRequestFunctions<P, "GET", "CODE_F"> = {
        CODE_F: this.codeFGetHandler,
        CODE_F_LIST: this.codeFListGetHandler,
        CODE_F_INFO: this.codeFInfoHandler,
        CODE_F_PLUGINS_LIST: this.codeFPluginsListGetHandler,
        CODE_F_PLUGIN_PROCEDURE: this.codeFPluginProcedureGetHandler,
    } as const;

    setMapper: SpecRequestFunctions<P, "SET", "CODE_F"> = {
        CODE_F: this.codeFSetHandler,
        CODE_F_PLUGIN: this.codeFPluginSetHandler,
    } as const;

    protected getGetHandler(info: GetInfo__Output): NarrowedDestination<P, "GET"> {
        if (!(info.requestType && info.requestType in this.getMapper)) throw "Request type is not supported";
        const handlers: SpecHandlerReturnType<P, "GET"> =
            (this.getMapper[info.requestType].bind(this))(info);
        return {
            requestName: "GET",
            protocol: p,
            ...handlers
        }
    }

    protected getSetHandler(info: DataInfo__Output): NarrowedDestination<P, "SET"> {
        if (!(info.requestType && info.requestType in this.setMapper)) throw "Request type is not supported";
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
        const getInfoName = "codeFGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
            try {
                const stream = await this.getFile({
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
        const getInfoName = "codeFInfoGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
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
        // /codeFs
        const name: keyof DataInfo__Output = "codeFList";
        // const getInfo = info["codeFListGet"];
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
        // const getInfo = info["codeFPluginsListGet"];
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
        const getInfoName = "codeFPluginProcedureGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
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
        const setInfo = info["codeF"];

        if (!setInfo) {
            return {
                destWriter: new PassThrough(),
                destReader: Promise.reject("dataInfo is not provided")
            }
        }

        if (!setInfo.getInfo || !setInfo.getInfo.id || !setInfo.value) {
            return {
                destWriter: new PassThrough(),
                destReader: Promise.reject("dataInfo is not valid")
            }
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
                requestType: info.requestType,
                infoType: "response",
                response: response
            }
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    protected codeFPluginSetHandler(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        // /add_plugin
        // const name: keyof DataInfo__Output = "codeFPlugin";
        const setInfo = info["codeFPlugin"];

        if (!setInfo) {
            return {
                destWriter: new PassThrough(),
                destReader: Promise.reject("dataInfo is not provided")
            }
        }

        if (!setInfo.getInfo || !setInfo.getInfo.pluginId) {
            return {
                destWriter: new PassThrough(),
                destReader: Promise.reject("dataInfo is not valid")
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
                requestType: info.requestType,
                infoType: "response",
                response: response
            }
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
