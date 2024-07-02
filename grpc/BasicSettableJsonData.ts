// Original file: node_modules/luna-proto-files/data_messages.proto

import type { BasicIdGet as _BasicIdGet, BasicIdGet_Strict as _BasicIdGet_Strict } from './BasicIdGet';

export interface BasicSettableJsonData {
  'getInfo'?: (_BasicIdGet | null);
  'value'?: (string);
}

export interface BasicSettableJsonData_Strict {
  'getInfo'?: (_BasicIdGet_Strict);
  'value'?: (string);
}
