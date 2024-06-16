import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {Multipart} from "@fastify/multipart";
import type {sendUnaryData} from "@grpc/grpc-js";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {FastifyReply, FastifyRequest} from "fastify";
import {ErrorMessage} from "@/utils/ErrorMessage";
import FormData from "form-data";
import type {MultipartTransferObject} from "@/types/Types";
import {baseHandleMultipart, MultipartParts} from "@/servers/rest-api/utils";
import type {DataInfo} from "@grpc-build/DataInfo";
import {EndedStream} from "@/utils/EndedStream";
import type {BusboyFileStream} from "@fastify/busboy";
import {ErrorDto} from "@/endpoints/ErrorDto";

export function V1RestApiActions(requestManager: IRequestManager) {
    function sendError(res: FastifyReply, error: ErrorDto) {
        res.code(500).headers({
            "Content-Type": "application/json"
        }).send(ErrorMessage.create(error));
    }

    async function handleMultipart(req: FastifyRequest) {
        let parts: MultipartParts | undefined = undefined;
        try {
            parts = await baseHandleMultipart(req);
        } catch (e) {
            throw e;
        }

        const info = parts.fields["info"].value as DataInfo | undefined;

        if (!info) {
            throw new ErrorDto("invalid-argument", "Info not given in multipart");
        }
        if (typeof info != "object") {
            throw new ErrorDto("invalid-argument", "Info is not JSON or wrong content-type");
        }

        if (info.dataType == "BYTES" && !parts.stream) {
            throw new ErrorDto("invalid-argument", "Data not given for BYTES data type");
        }

        if (!parts.stream) {
            parts.stream = new EndedStream() as BusboyFileStream;
        }

        return {
            info: info,
            stream: parts.stream
        }
    }

    function getHandler (req, res: FastifyReply) {
        if (req.headers['content-type'] != "application/json") {
            return sendError(res, new ErrorDto("invalid-argument", "Content-Type is not json"));
        }

        const callback = (error: ErrorDto, value: MultipartTransferObject) => {
            if (error) {
                return sendError(res, error);
            } else {
                const formData = new FormData();
                formData.append("info", JSON.stringify(value.info), {
                    contentType: "application/json"
                });
                if (value && value.data) {
                    formData.append("data", value.data);
                }
                res.headers(formData.getHeaders()).send(formData);
            }
        }

        requestManager!.register({
            protocol: "REST_API",
            requestName: "GET",
            sourceWriter: callback,
        }, (req.body as GetInfo__Output))
    }

    async function setHandler (req: FastifyRequest, res) {
        try {
            const multipart = await handleMultipart(req);
            let unaryCallback: sendUnaryData<GetInfo__Output> | undefined = undefined;
            const promise = new Promise((resolve, reject) => {
                unaryCallback = (error, value) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(value);
                    }
                }
            })

            await requestManager!.register({
                protocol: "REST_API",
                requestName: "SET",
                sourceReader: multipart.stream,
                sourceWriter: unaryCallback
            }, multipart.info)

            return promise;
        } catch (err) {
            sendError(res, err);
        }
    }

    async function debugHandler (req, res) {
        console.log(req.headers);
        if ((req.headers["content-type"] as string)?.includes("multipart")) {
            let parts: AsyncIterableIterator<Multipart>;
            parts = req.parts();
            for (let i = 0; i < 10; i++) {
                const next = (await parts.next());
                if (next.done) {
                    res.send(200);
                    return;
                }
                const part = next.value as Multipart;
                console.log(part.type, part.fieldname, part.mimetype);
                if (part.type == "field") {
                    console.log(part.value);
                } else if (part.type == "file") {
                    let counter = 0;
                    part.file.on("data", (data) => {
                        console.log("[PACK]", data);
                        counter += data.length;
                    }).on("end", () => {
                        console.log("Length ",counter);
                    })
                }
            }
        } else {
            console.log(req.body)
            res.send(200);
        }
        await res;
    }

    return {
        getHandler,
        setHandler
    }
}
