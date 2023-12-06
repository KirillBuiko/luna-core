// Original file: node_modules/luna-proto-files/set_messages.proto

import type { VariableGetInfo as _VariableGetInfo, VariableGetInfo__Output as _VariableGetInfo__Output } from './VariableGetInfo';
import type { DataType as _DataType, DataType__Output as _DataType__Output } from './DataType';

export interface VariableDataInfo {
  'getInfo'?: (_VariableGetInfo | null);
  'variableName'?: (string);
  'dataType'?: (_DataType);
  '_getInfo'?: "getInfo";
}

export interface VariableDataInfo__Output {
  'getInfo'?: (_VariableGetInfo__Output);
  'variableName'?: (string);
  'dataType'?: (_DataType__Output);
  '_getInfo': "getInfo";
}
