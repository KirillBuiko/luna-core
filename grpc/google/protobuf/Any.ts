// Original file: null

import type { AnyExtension } from '@grpc/proto-loader';

export type Any = AnyExtension | {
  type_url: string;
  value: Buffer | Uint8Array | string;
}

export interface Any_Strict {
  'type_url'?: (string);
  'value'?: (Buffer);
}
