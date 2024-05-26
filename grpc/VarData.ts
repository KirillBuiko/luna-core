// Original file: node_modules/luna-proto-files/data_messages.proto

import type { VarGet as _VarGet, VarGet__Output as _VarGet__Output } from './VarGet';
import type { VarValueType as _VarValueType, VarValueType__Output as _VarValueType__Output } from './VarValueType';

export interface _VarData_Value {
  'name'?: (string);
  'type'?: (_VarValueType);
  'value'?: (string);
  'valueId'?: (string);
  '_valueId'?: "valueId";
}

export interface _VarData_Value__Output {
  'name'?: (string);
  'type'?: (_VarValueType__Output);
  'value'?: (string);
  'valueId'?: (string);
  '_valueId': "valueId";
}

export interface VarData {
  'getInfo'?: (_VarGet | null);
  'value'?: (_VarData_Value | null);
}

export interface VarData__Output {
  'getInfo'?: (_VarGet__Output);
  'value'?: (_VarData_Value__Output);
}
