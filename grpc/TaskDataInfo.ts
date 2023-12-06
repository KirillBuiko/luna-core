// Original file: node_modules/luna-proto-files/set_messages.proto

import type { TaskGetInfo as _TaskGetInfo, TaskGetInfo__Output as _TaskGetInfo__Output } from './TaskGetInfo';

export interface TaskDataInfo {
  'getInfo'?: (_TaskGetInfo | null);
  'taskId'?: (string);
  '_getInfo'?: "getInfo";
}

export interface TaskDataInfo__Output {
  'getInfo'?: (_TaskGetInfo__Output);
  'taskId'?: (string);
  '_getInfo': "getInfo";
}
