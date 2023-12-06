// Original file: node_modules/luna-proto-files/data_requests.proto

import type { DataRequestInfo as _DataRequestInfo, DataRequestInfo__Output as _DataRequestInfo__Output } from './DataRequestInfo';

export interface DataStream {
  'info'?: (_DataRequestInfo | null);
  'chunkData'?: (Buffer | Uint8Array | string);
  'infoOrData'?: "info"|"chunkData";
}

export interface DataStream__Output {
  'info'?: (_DataRequestInfo__Output);
  'chunkData'?: (Buffer);
  'infoOrData': "info"|"chunkData";
}
