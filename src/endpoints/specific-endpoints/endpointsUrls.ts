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

export const varValueUrls = {
    getList: ["GET", (host: string) => `${host}/`],
    addValue: ["POST", (host: string) => `${host}/`],
    getValue: ["GET", (host: string, id: string) => `${host}/${id}`],
    deleteValue: ["DELETE", (host: string, id: string) => `${host}/${id}`],
    getMeta: ["GET", (host: string, id: string) => `${host}/${id}/meta`],
    setMeta: ["PUT", (host: string, id: string) => `${host}/${id}/meta`],
    deleteMeta: ["DELETE", (host: string, id: string) => `${host}/${id}/meta`],
} as const;
