import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IEventBus} from "@/event-bus/IEventBus";

export interface IServerDependencies {
	requestsManager: IRequestManager;
	eventBus: IEventBus;
}