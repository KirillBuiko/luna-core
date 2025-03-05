import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IEventBus} from "@/event-bus/IEventBus";
import type {IServerDependencies} from "@/app/types/IServerDependencies";

export type ServerStatus = "on" | "off";

export interface IServer {
    requestManager: IRequestManager | undefined;
    status: ServerStatus;

    stop(): Promise<Error | undefined>;
    start(config: ServerConfigType, deps: IServerDependencies): Promise<Error | null>;
}
