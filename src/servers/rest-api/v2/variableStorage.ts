import type {V2RouteDescriptor} from "@/servers/rest-api/v2/types";
import {HttpCode} from "@/servers/rest-api/v2/constants";

const EndpointPrefix = "/var-storage"

export const varStorageRouteDescriptors: V2RouteDescriptor[] = [
    {
        http: ["GET", `${EndpointPrefix}/list`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "VAR_VALUE_LIST",
    },
    {
        http: ["GET", `${EndpointPrefix}/value`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "VAR_VALUE",
        params: ["id"],
    },
    {
        http: ["POST", `${EndpointPrefix}/value`],
        successCode: HttpCode.EMPTY,
        requestName: "SET", requestType: "VAR_VALUE",
    },
    {
        http: ["DELETE", `${EndpointPrefix}/value`],
        successCode: HttpCode.OK,
        requestName: "SET", requestType: "VAR_VALUE_DELETE",
        params: "id",
    }
]
