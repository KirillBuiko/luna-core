export const codeFApi = {
    getFragment: ["GET", (host: string, id: string) => `${host}/${id}/target_code`],
    getInfo: ["GET", (host: string, id: string) => `${host}/${id}/info`],
    getList: ["GET", (host: string) => `${host}/code_fragments`],
    getPluginsList: ["GET", (host: string) => `${host}/plugins`],
    getPluginProcedure: ["GET", (host: string, codeFId: string, type: string) =>
        `${host}/${codeFId}/pluginProcedure?type=${type}`],
    addFragment: ["POST", (host: string) => `${host}/add_code_fragment`],
    addPlugin: ["POST", (host: string) => `${host}/add_plugin`],
} as const;

const valStoragePrefix = "/valst";

export const varStorageUrls = {
    getList: ["GET", (host: string) => `${host}${valStoragePrefix}/`],
    addValue: ["POST", (host: string) => `${host}${valStoragePrefix}/`],
    getValue: ["GET", (host: string, id: string) => `${host}${valStoragePrefix}/${id}`],
    deleteValue: ["DELETE", (host: string, id: string) => `${host}${valStoragePrefix}/${id}`],
    getMeta: ["GET", (host: string, id: string) => `${host}${valStoragePrefix}/${id}/meta`],
    setMeta: ["PUT", (host: string, id: string) => `${host}${valStoragePrefix}/${id}/meta`],
    deleteMeta: ["DELETE", (host: string, id: string) => `${host}${valStoragePrefix}/${id}/meta`],
} as const;
