// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { CFGet as _CFGet, CFGet__Output as _CFGet__Output } from './CFGet';
import type { CFInfoGet as _CFInfoGet, CFInfoGet__Output as _CFInfoGet__Output } from './CFInfoGet';
import type { CFPluginGet as _CFPluginGet, CFPluginGet__Output as _CFPluginGet__Output } from './CFPluginGet';
import type { CFPluginProcedureGet as _CFPluginProcedureGet, CFPluginProcedureGet__Output as _CFPluginProcedureGet__Output } from './CFPluginProcedureGet';
import type { CFPluginsListGet as _CFPluginsListGet, CFPluginsListGet__Output as _CFPluginsListGet__Output } from './CFPluginsListGet';

export interface GetInfo {
  'requestType'?: (_RequestType);
  'cfGet'?: (_CFGet | null);
  'cfInfoGet'?: (_CFInfoGet | null);
  'cfPluginGet'?: (_CFPluginGet | null);
  'cfPluginProcedureGet'?: (_CFPluginProcedureGet | null);
  'cfPluginsListGet'?: (_CFPluginsListGet | null);
  'response'?: (string);
  'infoType'?: "cfGet"|"cfInfoGet"|"cfPluginGet"|"cfPluginProcedureGet"|"cfPluginsListGet"|"response";
}

export interface GetInfo__Output {
  'requestType'?: (_RequestType__Output);
  'cfGet'?: (_CFGet__Output);
  'cfInfoGet'?: (_CFInfoGet__Output);
  'cfPluginGet'?: (_CFPluginGet__Output);
  'cfPluginProcedureGet'?: (_CFPluginProcedureGet__Output);
  'cfPluginsListGet'?: (_CFPluginsListGet__Output);
  'response'?: (string);
  'infoType'?: "cfGet"|"cfInfoGet"|"cfPluginGet"|"cfPluginProcedureGet"|"cfPluginsListGet"|"response";
}
