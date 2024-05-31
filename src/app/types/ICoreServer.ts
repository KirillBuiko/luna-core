import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";

export type ServerStatus = "on" | "off";

export interface IServer {
    requestManager: IRequestManager | undefined;
    status: ServerStatus;

    stop(): Promise<Error | undefined>;
    start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null>;
}
