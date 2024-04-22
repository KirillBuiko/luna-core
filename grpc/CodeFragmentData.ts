// Original file: node_modules/luna-proto-files/set_messages.proto

import type { CodeFragmentGet as _CodeFragmentGet, CodeFragmentGet__Output as _CodeFragmentGet__Output } from './CodeFragmentGet';
import type { FileInfo as _FileInfo, FileInfo__Output as _FileInfo__Output } from './FileInfo';

export interface CodeFragmentData {
  'getInfo'?: (_CodeFragmentGet | null);
  'fileInfo'?: (_FileInfo | null);
  '_getInfo'?: "getInfo";
}

export interface CodeFragmentData__Output {
  'getInfo'?: (_CodeFragmentGet__Output);
  'fileInfo'?: (_FileInfo__Output);
  '_getInfo': "getInfo";
}
