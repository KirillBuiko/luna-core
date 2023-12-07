import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/app/types/IRequestManager";

export type ServerStatus = "on" | "off";

export interface IAbstractServer {
    status: ServerStatus;

    startDefault(config: ServerConfigType): Promise<Error | null>;
    stop(): Promise<Error | undefined>;
}

export interface IServer extends IAbstractServer {
    requestManager: IRequestManager | undefined;

    start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null>;
}
