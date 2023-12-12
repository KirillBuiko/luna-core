import type {RequestType__Output} from "@grpc-build/RequestType";
import type {
    DestinationOptionsType,
    SourceOptionsType
} from "@/types/Types";
import {RequestRouter} from "@/request-manager/RequestRouter";
import type {IEndpointsManager} from "@/app/types/IEndpointsManager";
import type {IRequestManager} from "@/app/types/IRequestManager";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type {DataRequestInfo} from "@grpc-build/DataRequestInfo";
import {PipeBuilder} from "@/pipe-builder/PipeBuilder";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {Status} from "@grpc/grpc-js/build/src/constants";

export class RequestManager implements IRequestManager{
    router = new RequestRouter();
    pipeBuilder = new PipeBuilder();

    constructor(private endpointsManager: IEndpointsManager) {}

    register(sourceOptions: SourceOptionsType, info: GetRequestInfo | DataRequestInfo) {
        let destOptions: DestinationOptionsType | undefined;

        const destName =
            this.router.getEndpointName(info.requestType as RequestType__Output, sourceOptions.requestName);
        console.log(`Request ${sourceOptions.requestName} of type ${info.requestType} `+
            `from ${sourceOptions.protocol} to ${destName}`);

        if (destName) {
            try {
                destOptions = this.endpointsManager.getEndpoint(destName).send(sourceOptions.requestName, info);
            } catch (e) {
                console.log(`Failed to ${sourceOptions.requestName} ` +
                `${info.requestType} from ${sourceOptions.protocol} to ${destName}`);
            }
        }

        if (!destName || !destOptions) {
            if (!destName) {
                (new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
                    ErrorMessage.create(Status.UNAVAILABLE, "Couldn't find endpoint for request"));
                return;
            }
        }

        this.pipeBuilder.buildPipe(sourceOptions, destOptions);
    }
}