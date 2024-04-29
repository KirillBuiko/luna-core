import type {DataRequestInfo__Output} from "@grpc-build/DataRequestInfo";
import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {MultipartTransferObject, NarrowedDestinationOptionsType, ProtocolType, RequestName} from "@/types/Types";
import type {RequestType__Output} from "@grpc-build/RequestType";

type CPN = "REST_API";

type SelectByName<M extends string, T extends string> =
    { [key in T]: key extends `${M}${infer R}` ? key : never }[T];
type SpecHandlerReturnType<P extends ProtocolType, R extends RequestName> = Pick<NarrowedDestinationOptionsType<P, R>, "destReader" | "destWriter">;
type SpecRequestFunction<P extends ProtocolType, R extends RequestName> =
    (info: R extends "GET" ? GetRequestInfo__Output : DataRequestInfo__Output) => SpecHandlerReturnType<P, R>

type SpecRequestFunctions<P extends ProtocolType, R extends RequestName, RT extends string> =
    { [request in SelectByName<RT, RequestType__Output>]?: SpecRequestFunction<P, R> }

export class CodeFragmentsStorageEndpoint extends RestApiEndpoint {
    getMapper: SpecRequestFunctions<CPN, "GET", "CODE_FRAGMENT"> = {
        CODE_FRAGMENT: this.codeFragmentGetHandler,
        CODE_FRAGMENT_LIST: this.codeFragmentListGetHandler,
        CODE_FRAGMENT_INFO: this.codeFragmentInfoHandler,
        CODE_FRAGMENT_PLUGINS_LIST: this.codeFragmentPluginsListGetHandler,
        CODE_FRAGMENT_PLUGIN_PROCEDURE: this.codeFragmentPluginProcedureGetHandler,
        // CODE_FRAGMENT_PLUGIN,
    } as const;

    setMapper: SpecRequestFunctions<CPN, "SET", "CODE_FRAGMENT"> = {
        CODE_FRAGMENT: this.codeFragmentSetHandler,
        CODE_FRAGMENT_PLUGIN: this.codeFragmentPluginSetHandler,
    } as const;

    protected getGetHandler(info: GetRequestInfo__Output): NarrowedDestinationOptionsType<"REST_API", "GET"> {
        if (!(info.requestType in this.getMapper)) throw "Request type is not supported";
        const handlers =
            (this.getMapper[info.requestType].bind(this) as (typeof this.getMapper)[keyof typeof this.getMapper])(info);
        return {
            requestName: "GET",
            protocol: "REST_API",
            ...handlers
        }
    }

    protected getSetHandler(info: DataRequestInfo__Output): NarrowedDestinationOptionsType<CPN, "SET"> {
        if (!(info.requestType in this.setMapper)) throw "Request type is not supported";
        const handlers =
            (this.setMapper[info.requestType].bind(this) as (typeof this.setMapper)[keyof typeof this.setMapper])(info);
        return {
            requestName: "SET",
            protocol: "REST_API",
            ...handlers
        }
    }

    protected codeFragmentGetHandler(info: GetRequestInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /{className}/target_code
        const reader = (async (): Promise<MultipartTransferObject> => {
            const stream = await this.getFile({
                url: `${this.config.host}/${info.codeFragmentGet.id}/target_code`
            });
            return {
                info: {
                    requestType: info.requestType,
                    dataType: "FILE"
                },
                data: stream
            }
        })()
        return {
            destReader: reader
        }
    }

    protected codeFragmentInfoHandler(info: GetRequestInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /{cf_id}/info
        const reader = (async (): Promise<MultipartTransferObject> => {
            const json = await this.getText({
                url: `${this.config.host}/${info.codeFragmentGet.id}/info`
            })
            return {
                info: {
                    requestType: info.requestType,
                    dataType: "JSON",
                    dataValueType: "codeFragmentInfo",
                    codeFragmentInfo: {
                        value: json
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected codeFragmentListGetHandler(info: GetRequestInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /code_fragments
        const reader = (async (): Promise<MultipartTransferObject> => {
            const json = await this.getText({
                url: `${this.config.host}/code_fragments`
            })
            return {
                info: {
                    requestType: info.requestType,
                    dataType: "JSON",
                    dataValueType: "codeFragmentList",
                    codeFragmentList: {
                        value: json
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected codeFragmentPluginsListGetHandler(info: GetRequestInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /plugins
        const reader = (async (): Promise<MultipartTransferObject> => {
            const json = await this.getText({
                url: `${this.config.host}/plugins`
            })
            return {
                info: {
                    requestType: info.requestType,
                    dataType: "JSON",
                    dataValueType: "codeFragmentPluginsList",
                    codeFragmentPluginsList: {
                        value: json
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected codeFragmentPluginProcedureGetHandler(info: GetRequestInfo__Output): SpecHandlerReturnType<CPN, "GET"> {
        // /{cf_id}/pluginProcedure
        const reader = (async (): Promise<MultipartTransferObject> => {

            const value = await this.getText({
                url: `${this.config.host}/${info.codeFragmentPluginProcedureGet.codeFragmentId}` +
                    `/pluginProcedure?type=${info.codeFragmentPluginProcedureGet.type}`
            });
            return {
                info: {
                    requestType: info.requestType,
                    dataType: "JSON",
                    dataValueType: "codeFragmentPluginProcedure",
                    codeFragmentPluginProcedure: {
                        value: value
                    }
                }
            }
        })()
        return {
            destReader: reader
        }
    }

    protected codeFragmentSetHandler(info: DataRequestInfo__Output): SpecHandlerReturnType<CPN, "SET"> {
        // /add_code_fragment
        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/add_code_fragment`,
            streamName: "file",
            fields: {
                id: info.codeFragment.getInfo.id,
                json: info.codeFragment.codeFragmentJson
            }
        })

        const transformedReader = (async (): Promise<GetRequestInfo__Output> => {
            await reader;
            return {
                requestType: info.requestType,
                getInfoType: "codeFragmentGet"
            }
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    protected codeFragmentPluginSetHandler(info: DataRequestInfo__Output): SpecHandlerReturnType<CPN, "SET"> {
        // /add_plugin
        const {reader, dataWriter} = this.sendMultipart({
            url: `${this.config.host}/add_plugin`,
            streamName: "file",
            fields: {
                id: info.codeFragment.getInfo.id,
                json: info.codeFragment.codeFragmentJson
            }
        })

        const transformedReader = (async (): Promise<GetRequestInfo__Output> => {
            await reader;
            return {
                requestType: info.requestType,
                getInfoType: "codeFragmentGet",
                codeFragmentGet: info.codeFragment.getInfo
            }
        })()

        return {
            destReader: transformedReader,
            destWriter: dataWriter
        }
    }

    //-  /code_fragments
    //?  /{cf_id}/plugins <=cf_id
    //-  /plugins
    //-  /{cf_id}/info <=cf_id
    //   /add_code_fragment <=MP(id, json, file) (json?)=>
    //   /add_plugin <=MP(id, file) (json?)=>
    //-  /{cf_id}/pluginProcedure
    //-  /{className}/target_code
}
