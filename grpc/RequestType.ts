// Original file: node_modules/luna-proto-files/enums.proto

export const RequestType = {
  UNKNOWN_REQUEST_TYPE: 'UNKNOWN_REQUEST_TYPE',
  CF: 'CF',
  CF_LIST: 'CF_LIST',
  CF_INFO: 'CF_INFO',
  CF_PLUGIN: 'CF_PLUGIN',
  CF_PLUGINS_LIST: 'CF_PLUGINS_LIST',
  CF_PLUGIN_PROCEDURE: 'CF_PLUGIN_PROCEDURE',
} as const;

export type RequestType =
  | 'UNKNOWN_REQUEST_TYPE'
  | 0
  | 'CF'
  | 202
  | 'CF_LIST'
  | 204
  | 'CF_INFO'
  | 206
  | 'CF_PLUGIN'
  | 208
  | 'CF_PLUGINS_LIST'
  | 210
  | 'CF_PLUGIN_PROCEDURE'
  | 212

export type RequestType__Output = typeof RequestType[keyof typeof RequestType]
