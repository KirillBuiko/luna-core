import type {IServer} from "@/app/types/IServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {RouteHandlerMethod} from "fastify";
import type {IRequestManager} from "@/app/types/IRequestManager";
import {AbstractRestApiServer} from "@/servers/AbstractRestApiServer";
import type {RestApiQueryType} from "@/types/Types";
import type {sendUnaryData} from "@grpc/grpc-js";
import type {GetRequestInfo__Output} from "@grpc-build/GetRequestInfo";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";
import type {Multipart} from "@fastify/multipart";
import type {BusboyFileStream} from "@fastify/busboy";

export class RestApiServer extends AbstractRestApiServer implements IServer {
    requestManager: IRequestManager | undefined;

    constructor() {
        super();
    }

    async start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        return super.startDefault(config);
    }

    stop(): Promise<Error | undefined> {
        this.status = "off";
        return this.server.close();
    }

    protected getHandler: RouteHandlerMethod = (req, res) => {
        this.requestManager!.register({
            protocol: "REST_API",
            requestName: "GET",
            sourceWriter: res,
        }, (JSON.parse((req.query as { info: string }).info) as RestApiQueryType).info);
    }

    protected setHandler: RouteHandlerMethod = async (req, res) => {
        let parts: AsyncIterableIterator<Multipart>;
        try {
            parts = req.parts();
            if (!parts) {
                res.code(500);
                res.send(ErrorMessage.create(Status.INVALID_ARGUMENT, "Body is not multipart"));
                return;
            }
        } catch (e) {
            console.log(e);
            res.code(500);
            res.send(ErrorMessage.create(Status.INVALID_ARGUMENT, "Body is not multipart"));
            return;
        }

        let infoString: string;
        let file: BusboyFileStream;

        for await (const part of parts) {
            if (part.type == "field" && part.fieldname == "info") infoString = part.value as string;
            if (part.type == "file") file = part.file;
        }

        if (!infoString) {
            res.code(500);
            res.send(ErrorMessage.create(Status.INVALID_ARGUMENT, "Info not given"));
            return;
        }

        const info = JSON.parse(infoString);

        const unaryCallback: sendUnaryData<GetRequestInfo__Output> = (error, value) => {
            if (error) {
                res.code(500);
                res.send(error);
            } else {
                res.send(value);
            }
        }

        this.requestManager!.register({
            protocol: "REST_API",
            requestName: "SET",
            sourceReader: file,
            sourceWriter: unaryCallback
        }, info);
    }
}