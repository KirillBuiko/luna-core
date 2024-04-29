// Original file: node_modules/luna-proto-files/data_requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { DataType as _DataType, DataType__Output as _DataType__Output } from './DataType';
import type { CodeFragmentData as _CodeFragmentData, CodeFragmentData__Output as _CodeFragmentData__Output } from './CodeFragmentData';
import type { CodeFragmentInfoData as _CodeFragmentInfoData, CodeFragmentInfoData__Output as _CodeFragmentInfoData__Output } from './CodeFragmentInfoData';
import type { CodeFragmentListData as _CodeFragmentListData, CodeFragmentListData__Output as _CodeFragmentListData__Output } from './CodeFragmentListData';
import type { CodeFragmentPluginsListData as _CodeFragmentPluginsListData, CodeFragmentPluginsListData__Output as _CodeFragmentPluginsListData__Output } from './CodeFragmentPluginsListData';
import type { CodeFragmentPluginProcedureData as _CodeFragmentPluginProcedureData, CodeFragmentPluginProcedureData__Output as _CodeFragmentPluginProcedureData__Output } from './CodeFragmentPluginProcedureData';

export interface DataRequestInfo {
  'requestType'?: (_RequestType);
  'dataType'?: (_DataType);
  'codeFragment'?: (_CodeFragmentData | null);
  'codeFragmentInfo'?: (_CodeFragmentInfoData | null);
  'codeFragmentList'?: (_CodeFragmentListData | null);
  'codeFragmentPluginsList'?: (_CodeFragmentPluginsListData | null);
  'codeFragmentPluginProcedure'?: (_CodeFragmentPluginProcedureData | null);
  'dataValueType'?: "codeFragment"|"codeFragmentInfo"|"codeFragmentList"|"codeFragmentPluginsList"|"codeFragmentPluginProcedure";
}

export interface DataRequestInfo__Output {
  'requestType'?: (_RequestType__Output);
  'dataType'?: (_DataType__Output);
  'codeFragment'?: (_CodeFragmentData__Output);
  'codeFragmentInfo'?: (_CodeFragmentInfoData__Output);
  'codeFragmentList'?: (_CodeFragmentListData__Output);
  'codeFragmentPluginsList'?: (_CodeFragmentPluginsListData__Output);
  'codeFragmentPluginProcedure'?: (_CodeFragmentPluginProcedureData__Output);
  'dataValueType': "codeFragment"|"codeFragmentInfo"|"codeFragmentList"|"codeFragmentPluginsList"|"codeFragmentPluginProcedure";
}
