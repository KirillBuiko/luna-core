import type {GetInfo__Output} from "@grpc-build/GetInfo";
import type {Multipart} from "@fastify/multipart";
import type {BusboyFileStream} from "@fastify/busboy";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {sendUnaryData} from "@grpc/grpc-js";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {FastifyReply} from "fastify";
import {Status} from "@grpc/grpc-js/build/src/constants";
import {EndedStream} from "@/utils/EndedStream";
import {ErrorMessage} from "@/utils/ErrorMessage";
import FormData from "form-data";
import type {MultipartTransferObject} from "@/types/Types";

export class RestApiActions {
    constructor(private requestManager: IRequestManager) {
    };

    sendError(res: FastifyReply, code: Status, message: string) {
        res.code(500).headers({
            "Content-Type": "application/json"
        }).send(ErrorMessage.create(code, message));
    }

    getHandler = (req, res: FastifyReply) => {
        if (req.headers['content-type'] != "application/json") {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Content-Type is not json");
        }

        const callback = (error, value: MultipartTransferObject) => {
            if (error) {
                return this.sendError(res, Status.ABORTED, error);
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

        this.requestManager!.register({
            protocol: "REST_API",
            requestName: "GET",
            sourceWriter: callback,
        }, (req.body as GetInfo__Output))
    }

    setHandler = async (req, res) => {
        let parts: AsyncIterableIterator<Multipart>;
        try {
            parts = req.parts();
            if (!parts) {
                return this.sendError(res, Status.INVALID_ARGUMENT, "Body is not multipart");
            }
        } catch (e) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Body is not multipart");
        }

        let info: DataInfo | undefined = undefined;
        let file: BusboyFileStream | undefined = undefined;
        for (let i = 0; i < 2; i++) {
            const part = (await parts.next()).value as Multipart;
            if (!part) continue;
            if (part.type == "field" && part.fieldname == "info") info = part.value as DataInfo;
            if (part.type == "file") file = part.file;
        }

        if (!info) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Info not given");
        }
        if (typeof info != "object") {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Info is not JSON or wrong content-type");
        }


        if ((info.dataType == "BYTES" && !file)) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Data not given for BYTES data type");
        }

        if (!file) {
            file = new EndedStream() as BusboyFileStream;
        }

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

        await this.requestManager!.register({
            protocol: "REST_API",
            requestName: "SET",
            sourceReader: file,
            sourceWriter: unaryCallback
        }, info)

        return promise;
    }

    debugHandler = async (req, res) => {
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
}
