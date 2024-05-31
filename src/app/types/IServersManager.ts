import type {ServerConfigsType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";

export interface IServersManager {
    startAll(configs: ServerConfigsType, requestManager: IRequestManager): Promise<void>;
    stopAll(): void;
}
