import type {ServerStatus} from "@/app/types/IServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import type {IRequestManager} from "@/app/types/IRequestManager";

export class DummyServer {
    status: ServerStatus = "off";
    requestManager: IRequestManager | undefined;

    constructor() {

    }

    start(config: ServerConfigType, requestManager: IRequestManager): Promise<Error | null> {
        this.requestManager = requestManager;
        this.status = "on";
        return Promise.resolve(null);
    }

    stop(): Promise<Error | undefined> {
        this.status = "off";
        return Promise.resolve(undefined);
    }
}