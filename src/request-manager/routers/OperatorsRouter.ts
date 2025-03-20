"use strict"
import type {RequestType_Strict} from "@grpc-build/RequestType";

import type {RequestName} from "@/types/general";
import {RequestRouter, type RouterResult} from "@/request-manager/routers/RequestRouter";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {ComponentDescriptor, IEventBus} from "@/event-bus/IEventBus";
import {ErrorDto} from "@/endpoints/ErrorDto";

export class OperatorsRouter extends RequestRouter {
    routes: {[requestType in RequestType_Strict]?: {[requestName in RequestName]: string | RequestRouter | null}};

    constructor(deps: {requestManager: IRequestManager, endpointsManager: IEndpointsManager, eventBus: IEventBus}) {
        super(deps);
    }

    private getComponents(): ComponentDescriptor[] {
        const endpoints = this.deps.endpointsManager.getAllEndpoints();
        return Object.keys(endpoints).map<ComponentDescriptor>(id => ({
            id,
            group: endpoints[id].config.group,
            status: "active"
        }))
    }

    async getRouterResult(requestType: RequestType_Strict, requestName: RequestName): Promise<RouterResult | null> {
        const requestDesc = this.deps.eventBus.emit({
            eventName: "new-request",
            type: requestType,
            name: requestName,
            components: this.getComponents()
        })
        const event = await this.deps.eventBus.wait(requestDesc, 15000);
        switch (event.eventName) {
            case "event-error":
                throw event.error;
            case "new-request-response":
                return {
                    buffer: event.buffer
                }
            case "new-request-target":
                return {
                    endpointId: event.componentId
                }
        }
        throw new ErrorDto("unknown", "Operator return unexpected event: " + event.eventName);
    }
}
