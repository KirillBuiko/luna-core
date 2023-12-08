// Original file: node_modules/luna-proto-files/data_requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { DataType as _DataType, DataType__Output as _DataType__Output } from './DataType';
import type { VariableDataInfo as _VariableDataInfo, VariableDataInfo__Output as _VariableDataInfo__Output } from './VariableDataInfo';
import type { TaskDataInfo as _TaskDataInfo, TaskDataInfo__Output as _TaskDataInfo__Output } from './TaskDataInfo';

export interface DataRequestInfo {
  'requestType'?: (_RequestType);
  'dataType'?: (_DataType);
  'variableDataInfo'?: (_VariableDataInfo | null);
  'taskDataInfo'?: (_TaskDataInfo | null);
  'infoType'?: "variableDataInfo"|"taskDataInfo";
}

export interface DataRequestInfo__Output {
  'requestType'?: (_RequestType__Output);
  'dataType'?: (_DataType__Output);
  'variableDataInfo'?: (_VariableDataInfo__Output);
  'taskDataInfo'?: (_TaskDataInfo__Output);
  'infoType': "variableDataInfo"|"taskDataInfo";
}
