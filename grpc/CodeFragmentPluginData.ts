// Original file: node_modules/luna-proto-files/set_messages.proto

import type { CodeFragmentPluginGet as _CodeFragmentPluginGet, CodeFragmentPluginGet__Output as _CodeFragmentPluginGet__Output } from './CodeFragmentPluginGet';
import type { FileInfo as _FileInfo, FileInfo__Output as _FileInfo__Output } from './FileInfo';

export interface CodeFragmentPluginData {
  'getInfo'?: (_CodeFragmentPluginGet | null);
  'fileInfo'?: (_FileInfo | null);
  '_getInfo'?: "getInfo";
}

export interface CodeFragmentPluginData__Output {
  'getInfo'?: (_CodeFragmentPluginGet__Output);
  'fileInfo'?: (_FileInfo__Output);
  '_getInfo': "getInfo";
}
