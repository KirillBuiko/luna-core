// Original file: node_modules/luna-proto-files/requests.proto

import type { RequestType as _RequestType, RequestType_Strict as _RequestType_Strict } from './RequestType';
import type { DataType as _DataType, DataType_Strict as _DataType_Strict } from './DataType';
import type { BasicSettableJsonData as _BasicSettableJsonData, BasicSettableJsonData_Strict as _BasicSettableJsonData_Strict } from './BasicSettableJsonData';
import type { BasicJsonData as _BasicJsonData, BasicJsonData_Strict as _BasicJsonData_Strict } from './BasicJsonData';
import type { BasicGetInfoData as _BasicGetInfoData, BasicGetInfoData_Strict as _BasicGetInfoData_Strict } from './BasicGetInfoData';
import type { Empty as _Empty, Empty_Strict as _Empty_Strict } from './Empty';

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

export interface DataInfo_Strict {
  'requestType'?: (_RequestType_Strict);
  'dataType'?: (_DataType_Strict);
  'codeF'?: (_BasicSettableJsonData_Strict);
  'codeFInfo'?: (_BasicJsonData_Strict);
  'codeFList'?: (_BasicJsonData_Strict);
  'codeFPluginsList'?: (_BasicJsonData_Strict);
  'codeFPluginProcedure'?: (_BasicJsonData_Strict);
  'codeFPlugin'?: (_BasicGetInfoData_Strict);
  'varValue'?: (_Empty_Strict);
  'varValueList'?: (_BasicJsonData_Strict);
  'varValueDelete'?: (_BasicGetInfoData_Strict);
  'varValueMeta'?: (_BasicGetInfoData_Strict);
  'varValueMetaDelete'?: (_BasicGetInfoData_Strict);
  'custom'?: (_BasicSettableJsonData_Strict);
  'dataValueType': "codeF"|"codeFInfo"|"codeFList"|"codeFPluginsList"|"codeFPluginProcedure"|"codeFPlugin"|"varValue"|"varValueList"|"varValueDelete"|"varValueMeta"|"varValueMetaDelete"|"custom";
}
