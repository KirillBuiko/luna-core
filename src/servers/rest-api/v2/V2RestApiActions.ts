import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {V2RouteDescriptor} from "@/servers/rest-api/v2/types";
import type {GetInfo} from "@grpc-build/GetInfo";
import FormData from "form-data";
import type {FastifyReply, FastifyRequest} from "fastify";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {MultipartTransferObject} from "@/types/Types";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {handleMultipart} from "@/servers/rest-api/utils";
import type {CodeFGet} from "@grpc-build/CodeFGet";

export function V2RestApiActions(requestManager: IRequestManager) {
    function getURL(desc: V2RouteDescriptor) {
        return desc.http[1] + (desc.params ? "/:" + (desc.requestName == "GET" ? desc.params[0] : desc.params) : "");
    }

    function multipartReply(opts: { res: FastifyReply, code: number, value: MultipartTransferObject }) {
        const formData = new FormData();
        const cutInfo: DataInfo = {
            dataType: opts.value.info.dataType
        }
        formData.append("info", JSON.stringify(cutInfo), {
            contentType: "application/json"
        });
        const dataInfo = opts.value.info.dataValueType && opts.value.info.dataValueType in opts.value.info &&
            opts.value.info[opts.value.info.dataValueType];
        if (dataInfo && "value" in dataInfo) {
            const str = typeof dataInfo["value"] == "string" ? dataInfo["value"] : JSON.stringify(dataInfo["value"]);
            formData.append("data", Buffer.from(str), {
                contentType: "application/octet-stream"
            });
        } else if (opts.value.data) {
            formData.append("data", opts.value, {
                contentType: "application/octet-stream"
            });
        }
        opts.res.headers(formData.getHeaders()).code(opts.code).send(formData);
    }

    function basicReply(opts: { res: FastifyReply, code: number, contentType: string, value?: string | object }) {
        opts.res.code(opts.code).type(opts.contentType).send(opts.value);
    }

    function sendError(res: FastifyReply, httpCode: number, message: string) {
        res.code(httpCode).headers({
            "Content-Type": "application/json"
        }).send(ErrorMessage.createMessage(message));
    }

    function defaultGetHandler(opts: {
        res: FastifyReply, error: any, value?: MultipartTransferObject | null,
        desc: V2RouteDescriptor
    }) {
        if (opts.error || !opts.value) {
            sendError(opts.res, opts.desc.failCode, opts.error)
        } else {
            multipartReply({
                res: opts.res,
                code: opts.desc.successCode,
                value: opts.value
            })
        }
    }

    function defaultSetHandler(opts: {
        res: FastifyReply, error: any, value?: GetInfo | null,
        desc: V2RouteDescriptor
    }) {
        if (opts.error || !opts.value) {
            sendError(opts.res, opts.desc.failCode, opts.error)
        } else {
            basicReply({
                res: opts.res,
                code: opts.desc.successCode,
                contentType: "application/json",
                value: opts.value
            })
        }
    }

    function getRouteHandler(desc: V2RouteDescriptor) {
        return async (req: FastifyRequest, res: FastifyReply) => {
            const params: GetInfo[keyof GetInfo] = {...(req.query || {} as GetInfo), ...(req.params || {} as GetInfo)};
            if (desc.requestName == "GET") {
                const getInfo: GetInfo = {
                    requestType: desc.requestType,
                    infoType: "codeFGet",
                    codeFGet: params as CodeFGet
                }
                await requestManager.register({
                    protocol: "REST_API",
                    requestName: "GET",
                    sourceWriter: (error, value) => {
                        if (desc.manualHandler) {
                            desc.manualHandler({res, error, value})
                        } else {
                            defaultGetHandler({res, error, value, desc})
                        }
                    }
                },  getInfo)
            }
            if (desc.requestName == "SET") {
                try {
                    const multipart = await handleMultipart(req);
                    const dataInfo: DataInfo = {
                        ...multipart.info,
                        requestType: desc.requestType,
                        dataValueType: "codeF",
                        codeF: {
                            getInfo: params as CodeFGet
                        }
                    }
                    await requestManager.register({
                        protocol: "REST_API",
                        requestName: "SET",
                        sourceReader: multipart.stream,
                        sourceWriter: (error, value) => {
                            if (desc.manualHandler) {
                                desc.manualHandler({res, error, info: value})
                            } else {
                                defaultSetHandler({res, error, value, desc})
                            }
                        }
                    }, dataInfo)
                } catch (err) {
                    sendError(res, desc.failCode, err);
                }
            }
            return res;
        }
    }

    return {
        getRouteHandler,
        getURL
    }
}
