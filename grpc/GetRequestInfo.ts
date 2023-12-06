// Original file: node_modules/luna-proto-files/data_requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { VariableGetInfo as _VariableGetInfo, VariableGetInfo__Output as _VariableGetInfo__Output } from './VariableGetInfo';
import type { TaskGetInfo as _TaskGetInfo, TaskGetInfo__Output as _TaskGetInfo__Output } from './TaskGetInfo';

export interface GetRequestInfo {
  'requestType'?: (_RequestType);
  'variableGetInfo'?: (_VariableGetInfo | null);
  'taskGetInfo'?: (_TaskGetInfo | null);
  'infoType'?: "variableGetInfo"|"taskGetInfo";
}

export interface GetRequestInfo__Output {
  'requestType'?: (_RequestType__Output);
  'variableGetInfo'?: (_VariableGetInfo__Output);
  'taskGetInfo'?: (_TaskGetInfo__Output);
  'infoType': "variableGetInfo"|"taskGetInfo";
}
