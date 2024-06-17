import type {DataInfo__Output} from "@grpc-build/DataInfo";
import type {GetInfo__Output} from "@grpc-build/GetInfo";
import {RestApiEndpoint} from "@/endpoints/RestApiEndpoint";
import type {MultipartTransferObject, NarrowedDestination} from "@/types/Types";
import type {SpecHandlerReturnType, SpecRequestHandlers} from "@/endpoints/specific-endpoints/types";

const p = "REST_API";
type P = typeof p;

export class VariableStorageEndpoint extends RestApiEndpoint {
    getMapper: SpecRequestHandlers<P, "GET", "VAR"> = {
        VAR: this.varGetHandler,
        VAR_VALUE: this.varValueGetHandler,
        VAR_DELETE: this.varDeleteHandler,
        VAR_VALUE_DELETE: this.varValueDeleteHandler,
    } as const;

    setMapper: SpecRequestHandlers<P, "SET", "VAR"> = {
        VAR: this.varSetHandler,
        VAR_VALUE: this.varValueSetHandler,
        // VAR_ADD_FILE: this.codeFPluginSetHandler,
        // VAR_SET_FILE: this.codeFPluginSetHandler,
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

    protected varGetHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /storage/vars/get?id
        const name: keyof DataInfo__Output = "var";
        const getInfoName = "varGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
            try {
                const json = await this.getJson({
                    url: `${this.config.host}/storage/vars/get?id=${getInfo.id}`
                }) as VariableReceive;
                return {
                    info: {
                        requestType: info.requestType,
                        dataType: "JSON",
                        dataValueType: name,
                        [name]: {
                            getInfo: {id: json.id},
                            value: {
                                name: json.name,
                                value: json.value,
                                type: json.type,
                                valueId: json.value_id
                            }
                        }
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

    protected varValueGetHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /storage/values/get?id
        const name: keyof DataInfo__Output = "varValue";
        const getInfoName = "varValueGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
            try {
                const json = await this.getJson({
                    url: `${this.config.host}/storage/values/get?id=${getInfo.id}`
                }) as VariableValueReceive;
                return {
                    info: {
                        requestType: info.requestType,
                        dataType: "JSON",
                        dataValueType: name,
                        [name]: {
                            getInfo: {id: json.id},
                            value: {
                                name: json.name,
                                value: json.value,
                                type: json.type,
                            }
                        }
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

    protected varSetHandler(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        // /storage/vars/set
        // const name: keyof DataInfo__Output = "codeF";
        const setInfo = info["var"];

        if (!setInfo) {
            return {
                destReader: Promise.reject("dataInfo is not provided")
            }
        }

        if (!setInfo.value) {
            return {
                destReader: Promise.reject("dataInfo is not valid")
            }
        }

        const reader = this.getJson({
            url: `${this.config.host}/storage/vars/set`,
            contentType: "application/json",
            body: JSON.stringify({
                id: setInfo.getInfo?.id,
                type: setInfo.value.type,
                name: setInfo.value.name,
                value: setInfo.value.value,
                value_id: setInfo.value.valueId
            } as VariableSend)
        });

        const transformedReader = reader.then(async (response: VariableReceive): Promise<GetInfo__Output> => {
            console.log(response)
            return {
                requestType: info.requestType,
                infoType: "varGet",
                varGet: {
                    id: response.id
                }
            }
        })

        return {
            destReader: transformedReader
        }
    }

    protected varValueSetHandler(info: DataInfo__Output): SpecHandlerReturnType<P, "SET"> {
        // /storage/vars/set
        // const name: keyof DataInfo__Output = "var";
        const setInfo = info["varValue"];

        if (!setInfo) {
            return {
                destReader: Promise.reject("dataInfo is not provided")
            }
        }

        if (!setInfo.value) {
            return {
                destReader: Promise.reject("dataInfo is not valid")
            }
        }

        const reader = this.getJson({
            url: `${this.config.host}/storage/values/set`,
            contentType: "application/json",
            body: JSON.stringify({
                id: setInfo.getInfo?.id,
                type: setInfo.value.type,
                name: setInfo.value.name,
                value: setInfo.value.value,
            } as VariableValueSend)
        })

        const transformedReader = reader.then(async (response: VariableValueReceive): Promise<GetInfo__Output> => ({
            requestType: info.requestType,
            infoType: "varValueGet",
            varValueGet: {
                id: response.id
            }
        }))

        return {
            destReader: transformedReader
        }
    }

    protected varDeleteHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /storage/vars/get?id
        const name: keyof DataInfo__Output = "var";
        const getInfoName = "varGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
            try {
                const text = await this.getText({
                    url: `${this.config.host}/storage/vars/delete?id=${getInfo.id}`,
                    method: "POST"
                });
                return {
                    info: {
                        requestType: info.requestType,
                        dataValueType: name,
                        [name]: {
                            getInfo: {id: text},
                        }
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

    protected varValueDeleteHandler(info: GetInfo__Output): SpecHandlerReturnType<P, "GET"> {
        // /storage/vars/get?id
        const name: keyof DataInfo__Output = "varValue";
        const getInfoName = "varValueGet";
        const getInfo = info[getInfoName];
        const reader = (async (): Promise<MultipartTransferObject> => {
            if (!getInfo) throw `${getInfoName} is not provided`;
            try {
                const text = await this.getText({
                    url: `${this.config.host}/storage/values/delete?id=${getInfo.id}`,
                    method: "POST"
                });
                return {
                    info: {
                        requestType: info.requestType,
                        dataValueType: name,
                        [name]: {
                            getInfo: {id: text},
                        }
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
}

interface VariableSend {
    id: string;
    name: string;
    value: string;
    type: "string" | "file";
    value_id: string;
}

type VariableReceive = VariableSend;

type VariableValueSend = Omit<VariableReceive, "value_id">;

type VariableValueReceive = VariableValueSend;
