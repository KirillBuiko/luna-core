import type {ServerConfigsType} from "@/app/types/ServerConfigType";

export const serverConfigs: ServerConfigsType = {
    grpcServer: {port: 5051},
    restApiServer: {port: 5052}
}