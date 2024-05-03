// Original file: node_modules/luna-proto-files/data_requests.proto

import type { DataInfo as _DataInfo, DataInfo__Output as _DataInfo__Output } from './DataInfo';

export interface DataStream {
  'info'?: (_DataInfo | null);
  'chunkData'?: (Buffer | Uint8Array | string);
  'infoOrData'?: "info"|"chunkData";
}

export interface DataStream__Output {
  'info'?: (_DataInfo__Output);
  'chunkData'?: (Buffer);
  'infoOrData': "info"|"chunkData";
}
