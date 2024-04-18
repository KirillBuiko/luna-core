// Original file: node_modules/luna-proto-files/data_requests.proto

import type { DataStream as _DataStream, DataStream__Output as _DataStream__Output } from './DataStream';
import type { GetRequestInfo as _GetRequestInfo, GetRequestInfo__Output as _GetRequestInfo__Output } from './GetRequestInfo';
import type { HelloInfo as _HelloInfo, HelloInfo__Output as _HelloInfo__Output } from './HelloInfo';

export interface BidiMessage {
  'set'?: (_DataStream | null);
  'get'?: (_GetRequestInfo | null);
  'hello'?: (_HelloInfo | null);
  'end'?: (boolean);
  'type'?: "set"|"get"|"hello"|"end";
}

export interface BidiMessage__Output {
  'set'?: (_DataStream__Output);
  'get'?: (_GetRequestInfo__Output);
  'hello'?: (_HelloInfo__Output);
  'end'?: (boolean);
  'type': "set"|"get"|"hello"|"end";
}
