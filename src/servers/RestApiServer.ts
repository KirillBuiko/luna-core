import type {IServer} from "@/app/types/IServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {FastifyReply, RouteHandlerMethod} from "fastify";
import type {IRequestManager} from "@/app/types/IRequestManager";
import {AbstractRestApiServer} from "@/servers/AbstractRestApiServer";
import type {sendUnaryData} from "@grpc/grpc-js";
import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {Multipart} from "@fastify/multipart";
import type {BusboyFileStream} from "@fastify/busboy";
import {EndedStream} from "@/utils/EndedStream";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {getReaderWriter} from "@/utils/getReaderWriter";

export class RestApiServer extends AbstractRestApiServer implements IServer {
    requestManager: IRequestManager | undefined;

    constructor() {
        super();
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        return super.defaultStart(config);
    }

    stop(): Promise<Error | undefined> {
        this.status = "off";
        return this.server.close();
    }

    sendError(res: FastifyReply, code: Status, message: string) {
        res.code(500).send(ErrorMessage.create(code, message));
    }

    protected getHandler: RouteHandlerMethod = (req, res) => {
        const [r, writer] = getReaderWriter();
        res.send(r);
        this.requestManager!.register({
            protocol: "REST_API",
            requestName: "GET",
            writer: writer,
        }, (JSON.parse((req.query as { info: string }).info) as GetRequestInfo__Output));
    }

    protected setHandler: RouteHandlerMethod = async (req, res) => {
        let parts: AsyncIterableIterator<Multipart>;
        try {
            parts = req.parts();
            if (!parts) {
                return this.sendError(res, Status.INVALID_ARGUMENT, "Body is not multipart");
            }
        } catch (e) {
            console.log(e);
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
        const info = JSON.parse(infoString) as DataRequestInfo;

        if (info.dataType != "JSON" && !file) {
            return this.sendError(res, Status.INVALID_ARGUMENT, "Data not given for not JSON");
        }

        if (!file) {
            file = new EndedStream() as BusboyFileStream;
        }

        let unaryCallback: sendUnaryData<GetRequestInfo__Output>
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
            writer: unaryCallback
        }, info);

        return promise;
    }
}