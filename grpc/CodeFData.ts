// Original file: node_modules/luna-proto-files/data_messages.proto

import type { CodeFGet as _CodeFGet, CodeFGet__Output as _CodeFGet__Output } from './CodeFGet';

export interface CodeFData {
  'getInfo'?: (_CodeFGet | null);
  'value'?: (string);
  '_getInfo'?: "getInfo";
}

export interface CodeFData__Output {
  'getInfo'?: (_CodeFGet__Output);
  'value'?: (string);
  '_getInfo': "getInfo";
}
