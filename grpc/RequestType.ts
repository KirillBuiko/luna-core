// Original file: node_modules/luna-proto-files/enums.proto

export const RequestType = {
  UNKNOWN_REQUEST_TYPE: 'UNKNOWN_REQUEST_TYPE',
  VARIABLE: 'VARIABLE',
  VARIABLE_LIST: 'VARIABLE_LIST',
  PROGRAM: 'PROGRAM',
  PROGRAM_GENERATE: 'PROGRAM_GENERATE',
  PROGRAM_EXECUTE: 'PROGRAM_EXECUTE',
  PROGRAM_INTERPRET: 'PROGRAM_INTERPRET',
  TASK: 'TASK',
  TASK_LIST: 'TASK_LIST',
  TASK_PLAN: 'TASK_PLAN',
  COMPUTATIONAL_MODEL: 'COMPUTATIONAL_MODEL',
  COMPUTATIONAL_MODEL_LIST: 'COMPUTATIONAL_MODEL_LIST',
  MODULE: 'MODULE',
  MODULE_LIST: 'MODULE_LIST',
  MODULE_INFO: 'MODULE_INFO',
} as const;

export type RequestType =
  | 'UNKNOWN_REQUEST_TYPE'
  | 0
  | 'VARIABLE'
  | 1
  | 'VARIABLE_LIST'
  | 2
  | 'PROGRAM'
  | 10
  | 'PROGRAM_GENERATE'
  | 11
  | 'PROGRAM_EXECUTE'
  | 12
  | 'PROGRAM_INTERPRET'
  | 13
  | 'TASK'
  | 20
  | 'TASK_LIST'
  | 21
  | 'TASK_PLAN'
  | 22
  | 'COMPUTATIONAL_MODEL'
  | 30
  | 'COMPUTATIONAL_MODEL_LIST'
  | 31
  | 'MODULE'
  | 40
  | 'MODULE_LIST'
  | 41
  | 'MODULE_INFO'
  | 42

export type RequestType__Output = typeof RequestType[keyof typeof RequestType]
