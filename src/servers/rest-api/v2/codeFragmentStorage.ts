import type {V2RouteDescriptor} from "@/servers/rest-api/v2/types";
import {HttpCode} from "@/servers/rest-api/v2/constants";

const EndpointPrefix = "/code-f-storage"

export const codeFragmentRouteDescriptors: V2RouteDescriptor[] = [
    {
        http: ["GET", `${EndpointPrefix}/list`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "CODE_F_LIST",
    },
    {
        http: ["GET", `${EndpointPrefix}/fragment`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "CODE_F",
        params: ["id"],
    },
    {
        http: ["POST", `${EndpointPrefix}/fragment`],
        successCode: HttpCode.EMPTY,
        requestName: "SET", requestType: "CODE_F",
        params: "id",
    },
    {
        http: ["GET", `${EndpointPrefix}/info`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "CODE_F_INFO",
        params: ["id"],
    },
    {
        http: ["GET", `${EndpointPrefix}/procedure`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "CODE_F_PLUGIN_PROCEDURE",
        params: ["codeFId", "type"],
    },
    {
        http: ["GET", `${EndpointPrefix}/plugins-list`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "CODE_F_PLUGINS_LIST",
        // params: ["codeFId", "pluginId"],
    },
    {
        http: ["GET", `${EndpointPrefix}/plugin`],
        successCode: HttpCode.OK,
        requestName: "GET", requestType: "CODE_F_PLUGIN",
        params: ["id"],
    },
    {
        http: ["POST", `${EndpointPrefix}/plugin`],
        successCode: HttpCode.EMPTY,
        requestName: "SET", requestType: "CODE_F_PLUGIN",
        params: "id",
    },
]
