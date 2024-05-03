// Original file: node_modules/luna-proto-files/data_requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { DataType as _DataType, DataType__Output as _DataType__Output } from './DataType';
import type { CFData as _CFData, CFData__Output as _CFData__Output } from './CFData';
import type { CFInfoData as _CFInfoData, CFInfoData__Output as _CFInfoData__Output } from './CFInfoData';
import type { CFListData as _CFListData, CFListData__Output as _CFListData__Output } from './CFListData';
import type { CFPluginsListData as _CFPluginsListData, CFPluginsListData__Output as _CFPluginsListData__Output } from './CFPluginsListData';
import type { CFPluginProcedureData as _CFPluginProcedureData, CFPluginProcedureData__Output as _CFPluginProcedureData__Output } from './CFPluginProcedureData';
import type { CFPluginData as _CFPluginData, CFPluginData__Output as _CFPluginData__Output } from './CFPluginData';

export interface DataInfo {
  'requestType'?: (_RequestType);
  'dataType'?: (_DataType)[];
  'cf'?: (_CFData | null);
  'cfInfo'?: (_CFInfoData | null);
  'cfList'?: (_CFListData | null);
  'cfPluginsList'?: (_CFPluginsListData | null);
  'cfPluginProcedure'?: (_CFPluginProcedureData | null);
  'cfPlugin'?: (_CFPluginData | null);
  'dataValueType'?: "cf"|"cfInfo"|"cfList"|"cfPluginsList"|"cfPluginProcedure"|"cfPlugin";
}

export interface DataInfo__Output {
  'requestType'?: (_RequestType__Output);
  'dataType'?: (_DataType__Output)[];
  'cf'?: (_CFData__Output);
  'cfInfo'?: (_CFInfoData__Output);
  'cfList'?: (_CFListData__Output);
  'cfPluginsList'?: (_CFPluginsListData__Output);
  'cfPluginProcedure'?: (_CFPluginProcedureData__Output);
  'cfPlugin'?: (_CFPluginData__Output);
  'dataValueType': "cf"|"cfInfo"|"cfList"|"cfPluginsList"|"cfPluginProcedure"|"cfPlugin";
}
