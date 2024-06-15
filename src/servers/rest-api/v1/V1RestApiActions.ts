import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {Multipart} from "@fastify/multipart";
import type {sendUnaryData} from "@grpc/grpc-js";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {FastifyReply, FastifyRequest} from "fastify";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {ErrorMessage} from "@/utils/ErrorMessage";
import FormData from "form-data";
import type {MultipartTransferObject} from "@/types/Types";
import {baseHandleMultipart, MultipartParts} from "@/servers/rest-api/utils";
import type {DataInfo} from "@grpc-build/DataInfo";
import {EndedStream} from "@/utils/EndedStream";
import type {BusboyFileStream} from "@fastify/busboy";

export function V1RestApiActions(requestManager: IRequestManager) {
    function sendError(res: FastifyReply, code: Status, message: string) {
        res.code(500).headers({
            "Content-Type": "application/json"
        }).send(ErrorMessage.create(code, message));
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
            throw "Info not given";
        }
        if (typeof info != "object") {
            throw "Info is not JSON or wrong content-type";
        }

        if (info.dataType == "BYTES" && !parts.stream) {
            throw "Data not given for BYTES data type";
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
            return sendError(res, Status.INVALID_ARGUMENT, "Content-Type is not json");
        }

        const callback = (error, value: MultipartTransferObject) => {
            if (error) {
                return sendError(res, Status.ABORTED, error);
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
            sendError(res, Status.INVALID_ARGUMENT, err);
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
