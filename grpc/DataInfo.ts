// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { DataType as _DataType, DataType__Output as _DataType__Output } from './DataType';
import type { CodeFData as _CodeFData, CodeFData__Output as _CodeFData__Output } from './CodeFData';
import type { CodeFInfoData as _CodeFInfoData, CodeFInfoData__Output as _CodeFInfoData__Output } from './CodeFInfoData';
import type { CodeFListData as _CodeFListData, CodeFListData__Output as _CodeFListData__Output } from './CodeFListData';
import type { CodeFPluginsListData as _CodeFPluginsListData, CodeFPluginsListData__Output as _CodeFPluginsListData__Output } from './CodeFPluginsListData';
import type { CodeFPluginProcedureData as _CodeFPluginProcedureData, CodeFPluginProcedureData__Output as _CodeFPluginProcedureData__Output } from './CodeFPluginProcedureData';
import type { CodeFPluginData as _CodeFPluginData, CodeFPluginData__Output as _CodeFPluginData__Output } from './CodeFPluginData';

export interface DataInfo {
  'requestType'?: (_RequestType);
  'dataType'?: (_DataType);
  'codeF'?: (_CodeFData | null);
  'codeFInfo'?: (_CodeFInfoData | null);
  'codeFList'?: (_CodeFListData | null);
  'codeFPluginsList'?: (_CodeFPluginsListData | null);
  'codeFPluginProcedure'?: (_CodeFPluginProcedureData | null);
  'codeFPlugin'?: (_CodeFPluginData | null);
  'dataValueType'?: "codeF"|"codeFInfo"|"codeFList"|"codeFPluginsList"|"codeFPluginProcedure"|"codeFPlugin";
}

export interface DataInfo__Output {
  'requestType'?: (_RequestType__Output);
  'dataType'?: (_DataType__Output);
  'codeF'?: (_CodeFData__Output);
  'codeFInfo'?: (_CodeFInfoData__Output);
  'codeFList'?: (_CodeFListData__Output);
  'codeFPluginsList'?: (_CodeFPluginsListData__Output);
  'codeFPluginProcedure'?: (_CodeFPluginProcedureData__Output);
  'codeFPlugin'?: (_CodeFPluginData__Output);
  'dataValueType': "codeF"|"codeFInfo"|"codeFList"|"codeFPluginsList"|"codeFPluginProcedure"|"codeFPlugin";
}
