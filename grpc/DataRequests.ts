// Original file: node_modules/luna-proto-files/data_requests.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DataStream as _DataStream, DataStream__Output as _DataStream__Output } from './DataStream';
import type { GetInfo as _GetInfo, GetInfo__Output as _GetInfo__Output } from './GetInfo';

export interface DataRequestsClient extends grpc.Client {
  Get(argument: _GetInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  Get(argument: _GetInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  get(argument: _GetInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  get(argument: _GetInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  
  Set(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  Set(metadata: grpc.Metadata, callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  Set(options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  Set(callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(metadata: grpc.Metadata, callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(callback: grpc.requestCallback<_GetInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  
}

export interface DataRequestsHandlers extends grpc.UntypedServiceImplementation {
  Get: grpc.handleServerStreamingCall<_GetInfo__Output, _DataStream>;
  
  Set: grpc.handleClientStreamingCall<_DataStream__Output, _GetInfo>;
  
}

export interface DataRequestsDefinition extends grpc.ServiceDefinition {
  Get: MethodDefinition<_GetInfo, _DataStream, _GetInfo__Output, _DataStream__Output>
  Set: MethodDefinition<_DataStream, _GetInfo, _DataStream__Output, _GetInfo__Output>
}
