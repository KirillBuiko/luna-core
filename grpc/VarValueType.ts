// Original file: node_modules/luna-proto-files/data_messages.proto

export const VarValueType = {
  unknown: 'unknown',
  string: 'string',
  file: 'file',
} as const;

export type VarValueType =
  | 'unknown'
  | 0
  | 'string'
  | 1
  | 'file'
  | 2

export type VarValueType__Output = typeof VarValueType[keyof typeof VarValueType]
