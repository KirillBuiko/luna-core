// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType__Output as _RequestType__Output } from './RequestType';
import type { DataType as _DataType, DataType__Output as _DataType__Output } from './DataType';
import type { BasicSettableJsonData as _BasicSettableJsonData, BasicSettableJsonData__Output as _BasicSettableJsonData__Output } from './BasicSettableJsonData';
import type { BasicJsonData as _BasicJsonData, BasicJsonData__Output as _BasicJsonData__Output } from './BasicJsonData';
import type { BasicGetInfoData as _BasicGetInfoData, BasicGetInfoData__Output as _BasicGetInfoData__Output } from './BasicGetInfoData';
import type { Empty as _Empty, Empty__Output as _Empty__Output } from './Empty';

export interface DataInfo {
  'requestType'?: (_RequestType);
  'dataType'?: (_DataType);
  'codeF'?: (_BasicSettableJsonData | null);
  'codeFInfo'?: (_BasicJsonData | null);
  'codeFList'?: (_BasicJsonData | null);
  'codeFPluginsList'?: (_BasicJsonData | null);
  'codeFPluginProcedure'?: (_BasicJsonData | null);
  'codeFPlugin'?: (_BasicGetInfoData | null);
  'varValue'?: (_Empty | null);
  'varValueList'?: (_BasicJsonData | null);
  'varValueDelete'?: (_BasicGetInfoData | null);
  'varValueMeta'?: (_BasicGetInfoData | null);
  'varValueMetaDelete'?: (_BasicGetInfoData | null);
  'custom'?: (_BasicSettableJsonData | null);
  'dataValueType'?: "codeF"|"codeFInfo"|"codeFList"|"codeFPluginsList"|"codeFPluginProcedure"|"codeFPlugin"|"varValue"|"varValueList"|"varValueDelete"|"varValueMeta"|"varValueMetaDelete"|"custom";
}

export interface DataInfo__Output {
  'requestType'?: (_RequestType__Output);
  'dataType'?: (_DataType__Output);
  'codeF'?: (_BasicSettableJsonData__Output);
  'codeFInfo'?: (_BasicJsonData__Output);
  'codeFList'?: (_BasicJsonData__Output);
  'codeFPluginsList'?: (_BasicJsonData__Output);
  'codeFPluginProcedure'?: (_BasicJsonData__Output);
  'codeFPlugin'?: (_BasicGetInfoData__Output);
  'varValue'?: (_Empty__Output);
  'varValueList'?: (_BasicJsonData__Output);
  'varValueDelete'?: (_BasicGetInfoData__Output);
  'varValueMeta'?: (_BasicGetInfoData__Output);
  'varValueMetaDelete'?: (_BasicGetInfoData__Output);
  'custom'?: (_BasicSettableJsonData__Output);
  'dataValueType': "codeF"|"codeFInfo"|"codeFList"|"codeFPluginsList"|"codeFPluginProcedure"|"codeFPlugin"|"varValue"|"varValueList"|"varValueDelete"|"varValueMeta"|"varValueMetaDelete"|"custom";
}
