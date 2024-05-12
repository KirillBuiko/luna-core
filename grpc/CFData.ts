// Original file: node_modules/luna-proto-files/data_messages.proto

import type { codeFGet as _codeFGet, codeFGet__Output as _codeFGet__Output } from './codeFGet';

export interface codeFData {
  'getInfo'?: (_codeFGet | null);
  'value'?: (string);
  '_getInfo'?: "getInfo";
}

export interface codeFData__Output {
  'getInfo'?: (_codeFGet__Output);
  'value'?: (string);
  '_getInfo': "getInfo";
}
