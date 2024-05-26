// Original file: node_modules/luna-proto-files/data_messages.proto

import type { VarValueGet as _VarValueGet, VarValueGet__Output as _VarValueGet__Output } from './VarValueGet';
import type { VarValueType as _VarValueType, VarValueType__Output as _VarValueType__Output } from './VarValueType';

export interface _VarValueData_Value {
  'name'?: (string);
  'type'?: (_VarValueType);
  'value'?: (string);
}

export interface _VarValueData_Value__Output {
  'name'?: (string);
  'type'?: (_VarValueType__Output);
  'value'?: (string);
}

export interface VarValueData {
  'getInfo'?: (_VarValueGet | null);
  'value'?: (_VarValueData_Value | null);
}

export interface VarValueData__Output {
  'getInfo'?: (_VarValueGet__Output);
  'value'?: (_VarValueData_Value__Output);
}
