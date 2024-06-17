// Original file: node_modules/luna-proto-files/enums.proto

export const DataType = {
  UNKNOWN_DATA_TYPE: 'UNKNOWN_DATA_TYPE',
  TEXT: 'TEXT',
  JSON: 'JSON',
  LINK: 'LINK',
  BYTES: 'BYTES',
} as const;

export type DataType =
  | 'UNKNOWN_DATA_TYPE'
  | 0
  | 'TEXT'
  | 20
  | 'JSON'
  | 30
  | 'LINK'
  | 40
  | 'BYTES'
  | 50

export type DataType__Output = typeof DataType[keyof typeof DataType]
