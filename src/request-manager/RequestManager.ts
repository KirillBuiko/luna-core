import type {RequestType__Output} from "@grpc-build/RequestType";
import type {
    SourceOptionsType
} from "@/types/Types";
import type {RequestRouter} from "@/request-manager/routers/RequestRouter";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import {PipeBuilder} from "@/pipe-builder/PipeBuilder";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {RootRouter} from "@/request-manager/routers/RootRouter";
import type {IPipeBuilder} from "@/request-manager/types/IPipeBuilder";
import type {EndpointName} from "@/app/types/RemoteStaticEndpointConfigType";
import {ErrorDto} from "@/endpoints/ErrorDto";

export class RequestManager implements IRequestManager {
    router: RequestRouter;
    pipeBuilder: IPipeBuilder = new PipeBuilder();

    constructor(private deps: { endpointsManager: IEndpointsManager }) {
        this.router = new RootRouter({requestManager: this, ...deps});
    }

    async register(sourceOptions: SourceOptionsType, info: GetInfo | DataInfo) {
        let destName: EndpointName | null = null;
        try {
            destName =
                await this.router.getEndpointName(info.requestType as RequestType__Output, sourceOptions.requestName);
        } catch (e) {
        }
        console.log(`Request ${sourceOptions.requestName} of type ${info.requestType} ` +
            `from ${sourceOptions.protocol} to ${destName}`);

        if (!destName) {
            (new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
                ErrorMessage.create(
                    new ErrorDto("not-supported", "Couldn't find endpoint for request")));
            return;
        }

        try {
            const destOptions = this.deps.endpointsManager.getEndpoint(destName)
                .createSendHandler(sourceOptions.requestName, info);
            this.pipeBuilder.buildPipe(sourceOptions, destOptions);
        } catch (e) {
            console.log(`Failed to ${sourceOptions.requestName} ` +
                `${info.requestType} from ${sourceOptions.protocol} to ${destName}: ${e}`);
            (new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
                ErrorMessage.create(
                    new ErrorDto("unavailable", `Couldn't connect to endpoint ${destName}: ${e}`)));

        }
    }
}
