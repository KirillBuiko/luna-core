import type {SourceOptionsType} from "@/types/general";
import type {GetInfo} from "@grpc-build/GetInfo";
import type{DataInfo} from "@grpc-build/DataInfo";

export interface IRequestManager {
    register(sourceOptions: SourceOptionsType, info: GetInfo | DataInfo): Promise<void>;
}
