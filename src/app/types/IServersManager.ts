import type {ServerConfigsType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {IServerDependencies} from "@/app/types/IServerDependencies";

export interface IServersManager {
    startAll(configs: ServerConfigsType, deps: IServerDependencies): Promise<void>;
    stopAll(): void;
}
