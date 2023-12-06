import type {SourceOptionsType} from "@/types/Types";
import type {GetRequestInfo} from "@grpc-build/GetRequestInfo";
import type{DataRequestInfo} from "@grpc-build/DataRequestInfo";

export interface IRequestManager {
    register(sourceOptions: SourceOptionsType, info: GetRequestInfo | DataRequestInfo): void;
}
