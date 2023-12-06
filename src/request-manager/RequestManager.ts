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

export class RequestManager implements IRequestManager{
    router = new RequestRouter();

    constructor(private endpointsManager: IEndpointsManager) {}

    register(sourceOptions: SourceOptionsType, info: GetRequestInfo | DataRequestInfo) {
        const destName =
            this.router.getEndpointName(info.requestType as RequestType__Output, sourceOptions.requestName);
        console.log(`${sourceOptions.requestName} ${info.requestType} `+
            `request from ${sourceOptions.protocol} to ${destName}`);
        let destOptions: DestinationOptionsType | undefined;
        if (destName) {
            try {
                destOptions = this.endpointsManager.getEndpoint(destName).send(sourceOptions.requestName, info);
            } catch (e) {
                console.log(`Failed to ${sourceOptions.requestName} ` +
                `${info.requestType} from ${sourceOptions.protocol} to ${destName}`);
            }
        }
        // Build pipeline
    }
}