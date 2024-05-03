import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {MultipartTransferObject, NarrowedDestinationOptionsType, ProtocolType, RequestName} from "@/types/Types";
import type {RequestType__Output} from "@grpc-build/RequestType";
import {PassThrough} from "node:stream";

type CPN = "REST_API";

type SelectByName<M extends string, T extends string> =
    { [key in T]: key extends `${M}${infer R}` ? key : never }[T];
type SpecHandlerReturnType<P extends ProtocolType, R extends RequestName> =
    Pick<NarrowedDestinationOptionsType<P, R>, "destReader" | "destWriter">;
type SpecRequestFunction<P extends ProtocolType, R extends RequestName> =
    (info: R extends "GET" ? GetInfo__Output : DataInfo__Output) => SpecHandlerReturnType<P, R>

type SpecRequestFunctions<P extends ProtocolType, R extends RequestName, RT extends string> =
    { [request in SelectByName<RT, RequestType__Output>]?: SpecRequestFunction<P, R> }

export class CfStorageEndpoint extends RestApiEndpoint {
    getMapper: SpecRequestFunctions<CPN, "GET", "CF"> = {
        CF: this.cfGetHandler,
        CF_LIST: this.cfListGetHandler,
        CF_INFO: this.cfInfoHandler,
        CF_PLUGINS_LIST: this.cfPluginsListGetHandler,
        CF_PLUGIN_PROCEDURE: this.cfPluginProcedureGetHandler,
    } as const;

    setMapper: SpecRequestFunctions<CPN, "SET", "CF"> = {
        CF: this.cfSetHandler,
        CF_PLUGIN: this.cfPluginSetHandler,
    } as const;

    protected getGetHandler(info: GetInfo__Output): NarrowedDestinationOptionsType<"REST_API", "GET"> {
        if (!(info.requestType && info.requestType in this.getMapper)) throw "Request type is not supported";
        const handlers: SpecHandlerReturnType<"REST_API", "GET"> =
            (this.getMapper[info.requestType].bind(this))(info);
        return {
            requestName: "GET",
            protocol: "REST_API",
            ...handlers
        }
    }

    protected getSetHandler(info: DataInfo__Output): NarrowedDestinationOptionsType<CPN, "SET"> {
        if (!(info.requestType && info.requestType in this.setMapper)) throw "Request type is not supported";
        const handlers: SpecHandlerReturnType<"REST_API", "SET"> =
            (this.setMapper[info.requestType].bind(this))(info);
        return {
            requestName: "SET",
            protocol: "REST_API",
            ...handlers
        }
    }

    protected cfGetHandler(info: GetInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /{className}/target_code
        // const name: keyof DataInfo__Output = "cf";
        const getInfo = info["cfGet"];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw "getInfo is not provided";
            const stream = await this.getFile({
                url: `${this.config.host}/${getInfo.id}/target_code`
            });
            return {
                info: {
                    requestType: info.requestType,
                    dataType: ["FILE"]
                },
                data: stream
            }
        })()
        return {
            destReader: reader
        }
    }

    protected cfInfoHandler(info: GetInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /{cf_id}/info
        const name: keyof DataInfo__Output = "cfInfo";
        const getInfo = info["cfInfoGet"];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw "getInfo is not provided";
            const json = await this.getText({
                url: `${this.config.host}/${getInfo.id}/info`
            })
            return {
                info: {
                    requestType: info.requestType,
                    dataType: ["JSON"],
                    dataValueType: name,
                    [name]: {
                        value: json
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected cfListGetHandler(info: GetInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /CFs
        const name: keyof DataInfo__Output = "cfList";
        // const getInfo = info["cfListGet"];
        const reader = (async (): Promise<MultipartTransferObject> => {
            const json = await this.getText({
                url: `${this.config.host}/code_fragments`
            })
            return {
                info: {
                    requestType: info.requestType,
                    dataType: ["JSON"],
                    dataValueType: name,
                    [name]: {
                        value: json
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected cfPluginsListGetHandler(info: GetInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /plugins
        const name: keyof DataInfo__Output = "cfPluginsList";
        // const getInfo = info["cfPluginsListGet"];
        const reader = (async (): Promise<MultipartTransferObject> => {
            const json = await this.getText({
                url: `${this.config.host}/plugins`
            })
            return {
                info: {
                    requestType: info.requestType,
                    dataType: ["JSON"],
                    dataValueType: name,
                    [name]: {
                        value: json
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected cfPluginProcedureGetHandler(info: GetInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /{cf_id}/pluginProcedure
        const name: keyof DataInfo__Output = "cfPluginProcedure";
        const getInfo = info["cfPluginProcedureGet"];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw "getInfo is not provided";
            const value = await this.getText({
                url: `${this.config.host}/${getInfo.cfId}` +
                    `/pluginProcedure?type=${getInfo.type}`
            });
            return {
                info: {
                    requestType: info.requestType,
                    dataType: ["JSON"],
                    dataValueType: name,
                    [name]: {
                        value: value
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected cfSetHandler(info: DataInfo__Output): SpecHandlerReturnType<CPN, "SET"> {
        // /add_CF
        // const name: keyof DataInfo__Output = "cf";
        const setInfo = info["cf"];

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

        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/add_CF`,
            streamName: "file",
            fields: {
                id: setInfo.getInfo.id,
                json: setInfo.value
            }
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

    protected cfPluginSetHandler(info: DataInfo__Output): SpecHandlerReturnType<CPN, "SET"> {
        // /add_plugin
        // const name: keyof DataInfo__Output = "cfPlugin";
        const setInfo = info["cfPlugin"];

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
            fields: {
                id: setInfo.getInfo.pluginId,
            }
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

    //-  /CFs
    //?  /{cf_id}/plugins <=cf_id
    //-  /plugins
    //-  /{cf_id}/info <=cf_id
    //   /add_CF <=MP(id, json, file) (json?)=>
    //   /add_plugin <=MP(id, file) (json?)=>
    //-  /{cf_id}/pluginProcedure
    //-  /{className}/target_code
}
