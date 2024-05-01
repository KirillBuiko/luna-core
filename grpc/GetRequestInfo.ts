// Original file: node_modules/luna-proto-files/data_requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any';
import type { CodeFragmentGet as _CodeFragmentGet, CodeFragmentGet__Output as _CodeFragmentGet__Output } from './CodeFragmentGet';
import type { CodeFragmentInfoGet as _CodeFragmentInfoGet, CodeFragmentInfoGet__Output as _CodeFragmentInfoGet__Output } from './CodeFragmentInfoGet';
import type { CodeFragmentPluginGet as _CodeFragmentPluginGet, CodeFragmentPluginGet__Output as _CodeFragmentPluginGet__Output } from './CodeFragmentPluginGet';
import type { CodeFragmentPluginProcedureGet as _CodeFragmentPluginProcedureGet, CodeFragmentPluginProcedureGet__Output as _CodeFragmentPluginProcedureGet__Output } from './CodeFragmentPluginProcedureGet';
import type { CodeFragmentPluginsListGet as _CodeFragmentPluginsListGet, CodeFragmentPluginsListGet__Output as _CodeFragmentPluginsListGet__Output } from './CodeFragmentPluginsListGet';

export interface GetRequestInfo {
  'requestType'?: (_RequestType);
  'getInfo'?: (_google_protobuf_Any | null);
  'codeFragmentGet'?: (_CodeFragmentGet | null);
  'codeFragmentInfoGet'?: (_CodeFragmentInfoGet | null);
  'codeFragmentPluginGet'?: (_CodeFragmentPluginGet | null);
  'codeFragmentPluginProcedureGet'?: (_CodeFragmentPluginProcedureGet | null);
  'codeFragmentPluginListGet'?: (_CodeFragmentPluginsListGet | null);
  'getInfoType'?: "codeFragmentGet"|"codeFragmentInfoGet"|"codeFragmentPluginGet"|"codeFragmentPluginProcedureGet"|"codeFragmentPluginListGet";
}

export interface GetRequestInfo__Output {
  'requestType'?: (_RequestType__Output);
  'getInfo'?: (_google_protobuf_Any__Output);
  'codeFragmentGet'?: (_CodeFragmentGet__Output);
  'codeFragmentInfoGet'?: (_CodeFragmentInfoGet__Output);
  'codeFragmentPluginGet'?: (_CodeFragmentPluginGet__Output);
  'codeFragmentPluginProcedureGet'?: (_CodeFragmentPluginProcedureGet__Output);
  'codeFragmentPluginListGet'?: (_CodeFragmentPluginsListGet__Output);
  'getInfoType': "codeFragmentGet"|"codeFragmentInfoGet"|"codeFragmentPluginGet"|"codeFragmentPluginProcedureGet"|"codeFragmentPluginListGet";
}
