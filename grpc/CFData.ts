// Original file: node_modules/luna-proto-files/set_messages.proto

import type { CFGet as _CFGet, CFGet__Output as _CFGet__Output } from './CFGet';

export interface CFData {
  'getInfo'?: (_CFGet | null);
  'value'?: (string);
  '_getInfo'?: "getInfo";
}

export interface CFData__Output {
  'getInfo'?: (_CFGet__Output);
  'value'?: (string);
  '_getInfo': "getInfo";
}
