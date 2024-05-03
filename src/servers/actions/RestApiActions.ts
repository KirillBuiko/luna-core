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
    constructor(private requestManager: IRequestManager){};

    sendError(res: FastifyReply, code: Status, message: string) {
        res.code(500).send(ErrorMessage.create(code, message));
    }

    getHandler = (req, res: FastifyReply) => {
        const callback = (error, value: MultipartTransferObject) => {
            if (error) {
                res.code(500).send(error);
            } else {
                const formData = new FormData();
                formData.append("info", JSON.stringify(value.info));
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
        }, (JSON.parse((req.query as { info: string }).info) as GetInfo__Output));
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

        let infoString: string;
        let file: BusboyFileStream;
        for (let i = 0; i < 2; i++) {
            const part = (await parts.next()).value as Multipart;
            if (!part) continue;
            if (part.type == "field" && part.fieldname == "info") infoString = part.value as string;
            if (part.type == "file") file = part.file;
        }

        if (!infoString) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Info not given");
        }
        const info = JSON.parse(infoString) as DataInfo;

        if (!Array.isArray(info.dataType)) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Data type is not array");
        }

        if ((info.dataType.includes("FILE") && !file)) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Data not given for FILE data type");
        }

        if (!file) {
            file = new EndedStream() as BusboyFileStream;
        }

        let unaryCallback: sendUnaryData<GetInfo__Output>
        const promise = new Promise((resolve, reject) => {
            unaryCallback = (error, value) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            }
        })

        this.requestManager!.register({
            protocol: "REST_API",
            requestName: "SET",
            sourceReader: file,
            sourceWriter: unaryCallback
        }, info);

        return promise;
    }
}
