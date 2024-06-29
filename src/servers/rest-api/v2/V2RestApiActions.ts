import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {V2RouteDescriptor} from "@/servers/rest-api/v2/types";
import type {GetInfo} from "@grpc-build/GetInfo";
import FormData from "form-data";
import type {FastifyReply, FastifyRequest} from "fastify";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {MultipartTransferObject} from "@/types/general";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {baseHandleMultipart, MultipartParts} from "@/servers/rest-api/utils";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {reasonToHttpCode} from "@/servers/rest-api/v2/constants";
import type {BasicSettableJsonData} from "@grpc-build/BasicSettableJsonData";
import type {BasicIdGet} from "@grpc-build/BasicIdGet";
import type {BusboyFileStream} from "@fastify/busboy";

export function V2RestApiActions(requestManager: IRequestManager) {
    function getURL(desc: V2RouteDescriptor) {
        return desc.http[1] + (desc.params ? "/:" + (desc.requestName == "GET" ? desc.params[0] : desc.params + "?") : "");
    }

    function multipartReply(opts: { res: FastifyReply, code: number, value: MultipartTransferObject }) {
        const formData = new FormData();
        const meta = {}
        formData.append("meta", JSON.stringify(meta), {
            contentType: "application/json"
        });
        const dataInfo = opts.value.info.dataValueType && opts.value.info.dataValueType in opts.value.info &&
            opts.value.info[opts.value.info.dataValueType];
        if (dataInfo && ("value" in dataInfo)) {
            const str = typeof dataInfo["value"] == "string" ? dataInfo["value"] : JSON.stringify(dataInfo["value"]);
            formData.append("data", Buffer.from(str), {
                contentType: "application/octet-stream"
            });
        } else if (opts.value.data) {
            formData.append("data", opts.value.data, {
                contentType: "application/octet-stream"
            });
        }
        opts.res.headers(formData.getHeaders()).code(opts.code).send(formData);
    }

    function basicReply(opts: {
        res: FastifyReply, code: number,
        contentType: string, value?: string | object | undefined
    }) {
        opts.res.code(opts.code).type(opts.contentType).send(opts.value);
    }

    function sendError(res: FastifyReply, error: ErrorDto | Error) {
        const code = "reason" in error ? reasonToHttpCode[error.reason] : 500;
        res.code(code).headers({
            "Content-Type": "application/json"
        }).send(ErrorMessage.create(error));
    }

    async function handleMultipart(req: FastifyRequest): Promise<{meta?: object, stream?: BusboyFileStream}> {
        if(!req.headers["content-type"]?.startsWith("multipart") && req.body == undefined) {
            return {};
        }
        let parts: MultipartParts | undefined = undefined;
        try {
            parts = await baseHandleMultipart(req);
        } catch (e) {
            throw e;
        }

        const meta = parts.fields["meta"]?.value as object | undefined;

        if (meta && typeof meta != "object") {
            throw new ErrorDto("invalid-argument", "Meta is not JSON or wrong content-type");
        }

        if (!parts.stream) {
            throw new ErrorDto("invalid-argument",
                "Data is not provided or content-type is not 'application/octet-stream'")
        }

        return {
            meta: meta,
            stream: parts.stream
        }
    }

    function defaultGetHandler(opts: {
        res: FastifyReply, error: any, value?: MultipartTransferObject | null,
        desc: V2RouteDescriptor
    }) {
        if (opts.error || !opts.value) {
            sendError(opts.res, opts.error)
        } else {
            multipartReply({
                res: opts.res,
                code: opts.desc.successCode,
                value: opts.value
            })
        }
    }

    function defaultSetHandler(opts: {
        res: FastifyReply, error: ErrorDto | null | undefined, value?: GetInfo | null,
        desc: V2RouteDescriptor
    }) {
        if (opts.error) {
            sendError(opts.res, opts.error)
        } else if (!opts.value) {
            sendError(opts.res, new ErrorDto("unknown", "There is no value or error :/"))
        } else {
            const info = opts.value.infoType &&
                opts.value[opts.value.infoType] || undefined;
            basicReply({
                res: opts.res,
                code: opts.desc.successCode,
                contentType: "application/json",
                value: info
            })
        }
    }

    function getRouteHandler(desc: V2RouteDescriptor) {
        return async (req: FastifyRequest, res: FastifyReply) => {
            const params: GetInfo[keyof GetInfo] = {...(req.query || {} as GetInfo), ...(req.params || {} as GetInfo)};
            if (desc.requestName == "GET") {
                const getInfo: GetInfo = {
                    requestType: desc.requestType,
                    infoType: "custom",
                    ...(Object.keys(params).length > 0 ? {
                        custom: params as BasicIdGet
                    } : {})
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
                }, getInfo)
            }
            if (desc.requestName == "SET") {
                try {
                    const multipart = await handleMultipart(req);
                    const dataInfo: DataInfo = {
                        requestType: desc.requestType,
                        dataType: multipart.stream ? "BYTES" : "NONE",
                        ...(Object.keys(params).length > 0 ? {
                            dataValueType: "custom",
                            custom: {
                                getInfo: params,
                            } as BasicSettableJsonData
                        } : {})
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
                    sendError(res, err);
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


