// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType_Strict as _RequestType_Strict } from './RequestType';
import type { BasicIdGet as _BasicIdGet, BasicIdGet_Strict as _BasicIdGet_Strict } from './BasicIdGet';
import type { CodeFPluginProcedureGet as _CodeFPluginProcedureGet, CodeFPluginProcedureGet_Strict as _CodeFPluginProcedureGet_Strict } from './CodeFPluginProcedureGet';

export interface GetInfo {
  'requestType'?: (_RequestType);
  'endpointId'?: (string);
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

export interface GetInfo_Strict {
  'requestType'?: (_RequestType_Strict);
  'endpointId'?: (string);
  'codeFGet'?: (_BasicIdGet_Strict);
  'codeFInfoGet'?: (_BasicIdGet_Strict);
  'codeFPluginGet'?: (_BasicIdGet_Strict);
  'codeFPluginProcedureGet'?: (_CodeFPluginProcedureGet_Strict);
  'codeFPluginsListGet'?: (_BasicIdGet_Strict);
  'varValueGet'?: (_BasicIdGet_Strict);
  'varValueMetaGet'?: (_BasicIdGet_Strict);
  'response'?: (string);
  'custom'?: (_BasicIdGet_Strict);
  'infoType': "codeFGet"|"codeFInfoGet"|"codeFPluginGet"|"codeFPluginProcedureGet"|"codeFPluginsListGet"|"varValueGet"|"varValueMetaGet"|"response"|"custom";
}
