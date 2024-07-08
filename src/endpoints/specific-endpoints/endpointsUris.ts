export const codeFUris = {
    getFragment: ["GET", (id: string) =>
        `/${id}/target_code`],
    getInfo: ["GET", (id: string) =>
        `/${id}/info`],
    getList: ["GET", () =>
        `/code_fragments`],
    getPluginsList: ["GET", () =>
        `/plugins`],
    getPluginProcedure: ["GET", (codeFId: string, type: string) =>
        `/${codeFId}/pluginProcedure?type=${type}`],
    addFragment: ["POST", () =>
        `/add_code_fragment`],
    addPlugin: ["POST", () =>
        `/add_plugin`]
} as const;

const valstPrefix = "/valst";

export const varStorageUris = {
    getList: ["GET", () =>
        `${valstPrefix}/`],
    addValue: ["POST", () =>
        `${valstPrefix}/`],
    getValue: ["GET", (id: string) =>
        `${valstPrefix}/${id}`],
    deleteValue: ["DELETE", (id: string) =>
        `${valstPrefix}/${id}`],
    getMeta: ["GET", (id: string) =>
        `${valstPrefix}/${id}/meta`],
    setMeta: ["PUT", (id: string) =>
        `${valstPrefix}/${id}/meta`],
    deleteMeta: ["DELETE", (id: string) =>
        `${valstPrefix}/${id}/meta`],
} as const;
