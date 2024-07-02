// Original file: node_modules/luna-proto-files/enums.proto

export const RequestType = {
  UNKNOWN_REQUEST_TYPE: 'UNKNOWN_REQUEST_TYPE',
  CODE_F: 'CODE_F',
  CODE_F_LIST: 'CODE_F_LIST',
  CODE_F_INFO: 'CODE_F_INFO',
  CODE_F_PLUGIN: 'CODE_F_PLUGIN',
  CODE_F_PLUGINS_LIST: 'CODE_F_PLUGINS_LIST',
  CODE_F_PLUGIN_PROCEDURE: 'CODE_F_PLUGIN_PROCEDURE',
  VAR_VALUE: 'VAR_VALUE',
  VAR_VALUE_DELETE: 'VAR_VALUE_DELETE',
  VAR_VALUE_LIST: 'VAR_VALUE_LIST',
  VAR_VALUE_META: 'VAR_VALUE_META',
  VAR_VALUE_META_DELETE: 'VAR_VALUE_META_DELETE',
} as const;

export type RequestType =
  | 'UNKNOWN_REQUEST_TYPE'
  | 0
  | 'CODE_F'
  | 202
  | 'CODE_F_LIST'
  | 204
  | 'CODE_F_INFO'
  | 206
  | 'CODE_F_PLUGIN'
  | 208
  | 'CODE_F_PLUGINS_LIST'
  | 210
  | 'CODE_F_PLUGIN_PROCEDURE'
  | 212
  | 'VAR_VALUE'
  | 302
  | 'VAR_VALUE_DELETE'
  | 304
  | 'VAR_VALUE_LIST'
  | 306
  | 'VAR_VALUE_META'
  | 308
  | 'VAR_VALUE_META_DELETE'
  | 310

export type RequestType_Strict = typeof RequestType[keyof typeof RequestType]
