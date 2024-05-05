// Original file: node_modules/luna-proto-files/data_messages.proto

import type { CFPluginGet as _CFPluginGet, CFPluginGet__Output as _CFPluginGet__Output } from './CFPluginGet';

export interface CFPluginData {
  'getInfo'?: (_CFPluginGet | null);
  '_getInfo'?: "getInfo";
}

export interface CFPluginData__Output {
  'getInfo'?: (_CFPluginGet__Output);
  '_getInfo': "getInfo";
}
