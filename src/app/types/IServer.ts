import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/app/types/IRequestManager";

export type ServerStatus = "on" | "off";

export interface IServer {
    status: ServerStatus;
    requestManager: IRequestManager | undefined;

    start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null>;
    stop(): Promise<Error | undefined>;
}