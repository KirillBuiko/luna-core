// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { BasicIdGet as _BasicIdGet, BasicIdGet__Output as _BasicIdGet__Output } from './BasicIdGet';
import type { CodeFPluginProcedureGet as _CodeFPluginProcedureGet, CodeFPluginProcedureGet__Output as _CodeFPluginProcedureGet__Output } from './CodeFPluginProcedureGet';

export interface GetInfo {
  'requestType'?: (_RequestType);
  'codeFGet'?: (_BasicIdGet | null);
  'codeFInfoGet'?: (_BasicIdGet | null);
  'codeFPluginGet'?: (_BasicIdGet | null);
  'codeFPluginProcedureGet'?: (_CodeFPluginProcedureGet | null);
  'codeFPluginsListGet'?: (_BasicIdGet | null);
  'varValueGet'?: (_BasicIdGet | null);
  'varValueMetaGet'?: (_BasicIdGet | null);
  'response'?: (string);
  'custom'?: (_BasicIdGet | null);
  'infoType'?: "codeFGet"|"codeFInfoGet"|"codeFPluginGet"|"codeFPluginProcedureGet"|"codeFPluginsListGet"|"varValueGet"|"varValueMetaGet"|"response"|"custom";
}

export interface GetInfo__Output {
  'requestType'?: (_RequestType__Output);
  'codeFGet'?: (_BasicIdGet__Output);
  'codeFInfoGet'?: (_BasicIdGet__Output);
  'codeFPluginGet'?: (_BasicIdGet__Output);
  'codeFPluginProcedureGet'?: (_CodeFPluginProcedureGet__Output);
  'codeFPluginsListGet'?: (_BasicIdGet__Output);
  'varValueGet'?: (_BasicIdGet__Output);
  'varValueMetaGet'?: (_BasicIdGet__Output);
  'response'?: (string);
  'custom'?: (_BasicIdGet__Output);
  'infoType': "codeFGet"|"codeFInfoGet"|"codeFPluginGet"|"codeFPluginProcedureGet"|"codeFPluginsListGet"|"varValueGet"|"varValueMetaGet"|"response"|"custom";
}
