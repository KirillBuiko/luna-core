// Original file: node_modules/luna-proto-files/data_requests.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DataStream as _DataStream, DataStream__Output as _DataStream__Output } from './DataStream';
import type { GetRequestInfo as _GetRequestInfo, GetRequestInfo__Output as _GetRequestInfo__Output } from './GetRequestInfo';

export interface DataRequestsClient extends grpc.Client {
  Get(argument: _GetRequestInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  Get(argument: _GetRequestInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  get(argument: _GetRequestInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  get(argument: _GetRequestInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  
  Set(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  Set(metadata: grpc.Metadata, callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  Set(options: grpc.CallOptions, callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  Set(callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(metadata: grpc.Metadata, callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(options: grpc.CallOptions, callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  set(callback: grpc.requestCallback<_GetRequestInfo__Output>): grpc.ClientWritableStream<_DataStream>;
  
}

export interface DataRequestsHandlers extends grpc.UntypedServiceImplementation {
  Get: grpc.handleServerStreamingCall<_GetRequestInfo__Output, _DataStream>;
  
  Set: grpc.handleClientStreamingCall<_DataStream__Output, _GetRequestInfo>;
  
}

export interface DataRequestsDefinition extends grpc.ServiceDefinition {
  Get: MethodDefinition<_GetRequestInfo, _DataStream, _GetRequestInfo__Output, _DataStream__Output>
  Set: MethodDefinition<_DataStream, _GetRequestInfo, _DataStream__Output, _GetRequestInfo__Output>
}
