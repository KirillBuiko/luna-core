import type {V2RouteDescriptor} from "@/servers/rest-api/v2/types";

const EndpointPrefix = "/code-f-storage"

export const codeFragmentRouteDescriptors: V2RouteDescriptor[] = [
    {
        http: ["GET", `${EndpointPrefix}/list`],
        successCode: 201, failCode: 404,
        requestName: "GET", requestType: "CODE_F_LIST",
    }
]
