// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { CodeFGet as _CodeFGet, CodeFGet__Output as _CodeFGet__Output } from './CodeFGet';
import type { CodeFInfoGet as _CodeFInfoGet, CodeFInfoGet__Output as _CodeFInfoGet__Output } from './CodeFInfoGet';
import type { CodeFPluginGet as _CodeFPluginGet, CodeFPluginGet__Output as _CodeFPluginGet__Output } from './CodeFPluginGet';
import type { CodeFPluginProcedureGet as _CodeFPluginProcedureGet, CodeFPluginProcedureGet__Output as _CodeFPluginProcedureGet__Output } from './CodeFPluginProcedureGet';
import type { CodeFPluginsListGet as _CodeFPluginsListGet, CodeFPluginsListGet__Output as _CodeFPluginsListGet__Output } from './CodeFPluginsListGet';
import type { VarGet as _VarGet, VarGet__Output as _VarGet__Output } from './VarGet';
import type { VarValueGet as _VarValueGet, VarValueGet__Output as _VarValueGet__Output } from './VarValueGet';

export interface GetInfo {
  'requestType'?: (_RequestType);
  'codeFGet'?: (_CodeFGet | null);
  'codeFInfoGet'?: (_CodeFInfoGet | null);
  'codeFPluginGet'?: (_CodeFPluginGet | null);
  'codeFPluginProcedureGet'?: (_CodeFPluginProcedureGet | null);
  'codeFPluginsListGet'?: (_CodeFPluginsListGet | null);
  'varGet'?: (_VarGet | null);
  'varValueGet'?: (_VarValueGet | null);
  'response'?: (string);
  'infoType'?: "codeFGet"|"codeFInfoGet"|"codeFPluginGet"|"codeFPluginProcedureGet"|"codeFPluginsListGet"|"varGet"|"varValueGet"|"response";
}

export interface GetInfo__Output {
  'requestType'?: (_RequestType__Output);
  'codeFGet'?: (_CodeFGet__Output);
  'codeFInfoGet'?: (_CodeFInfoGet__Output);
  'codeFPluginGet'?: (_CodeFPluginGet__Output);
  'codeFPluginProcedureGet'?: (_CodeFPluginProcedureGet__Output);
  'codeFPluginsListGet'?: (_CodeFPluginsListGet__Output);
  'varGet'?: (_VarGet__Output);
  'varValueGet'?: (_VarValueGet__Output);
  'response'?: (string);
  'infoType': "codeFGet"|"codeFInfoGet"|"codeFPluginGet"|"codeFPluginProcedureGet"|"codeFPluginsListGet"|"varGet"|"varValueGet"|"response";
}
