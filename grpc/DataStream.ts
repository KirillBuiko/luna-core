// Original file: node_modules/luna-proto-files/requests.proto

import type { DataInfo as _DataInfo, DataInfo_Strict as _DataInfo_Strict } from './DataInfo';

export interface DataStream {
  'info'?: (_DataInfo | null);
  'chunkData'?: (Buffer | Uint8Array | string);
  'infoOrData'?: "info"|"chunkData";
}

export interface DataStream_Strict {
  'info'?: (_DataInfo_Strict);
  'chunkData'?: (Buffer);
  'infoOrData': "info"|"chunkData";
}
