export const codeFUris = {
    getFragment: ["GET", (id: string) => `/${id}/target_code`],
    getInfo: ["GET", (id: string) => `/${id}/info`],
    getList: ["GET", () => `/code_fragments`],
    getPluginsList: ["GET", () => `/plugins`],
    getPluginProcedure: ["GET", (codeFId: string, type: string) =>
        `/${codeFId}/pluginProcedure?type=${type}`],
    addFragment: ["POST", () => `/add_code_fragment`],
    addPlugin: ["POST", () => `/add_plugin`]
} as const;

const valStoragePrefix = "/valst";

export const varStorageUris = {
    getList: ["GET", () => `${valStoragePrefix}/`],
    addValue: ["POST", () => `${valStoragePrefix}/`],
    getValue: ["GET", (id: string) => `${valStoragePrefix}/${id}`],
    deleteValue: ["DELETE", (id: string) => `${valStoragePrefix}/${id}`],
    getMeta: ["GET", (id: string) => `${valStoragePrefix}/${id}/meta`],
    setMeta: ["PUT", (id: string) => `${valStoragePrefix}/${id}/meta`],
    deleteMeta: ["DELETE", (id: string) => `${valStoragePrefix}/${id}/meta`],
} as const;
