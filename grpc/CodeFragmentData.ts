// Original file: node_modules/luna-proto-files/set_messages.proto

import type { CodeFragmentGet as _CodeFragmentGet, CodeFragmentGet__Output as _CodeFragmentGet__Output } from './CodeFragmentGet';

export interface CodeFragmentData {
  'getInfo'?: (_CodeFragmentGet | null);
  'codeFragmentJson'?: (string);
  '_getInfo'?: "getInfo";
  '_codeFragmentJson'?: "codeFragmentJson";
}

export interface CodeFragmentData__Output {
  'getInfo'?: (_CodeFragmentGet__Output);
  'codeFragmentJson'?: (string);
  '_getInfo': "getInfo";
  '_codeFragmentJson': "codeFragmentJson";
}
