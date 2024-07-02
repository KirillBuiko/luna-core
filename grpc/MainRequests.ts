// Original file: node_modules/luna-proto-files/requests.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DataStream as _DataStream, DataStream_Strict as _DataStream_Strict } from './DataStream';
import type { GetInfo as _GetInfo, GetInfo_Strict as _GetInfo_Strict } from './GetInfo';

export interface MainRequestsClient extends grpc.Client {
  Get(argument: _GetInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream_Strict>;
  Get(argument: _GetInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream_Strict>;
  get(argument: _GetInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream_Strict>;
  get(argument: _GetInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream_Strict>;
  
  Set(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  Set(metadata: grpc.Metadata, callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  Set(options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  Set(callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  set(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  set(metadata: grpc.Metadata, callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  set(options: grpc.CallOptions, callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  set(callback: grpc.requestCallback<_GetInfo_Strict>): grpc.ClientWritableStream<_DataStream>;
  
}

export interface MainRequestsHandlers extends grpc.UntypedServiceImplementation {
  Get: grpc.handleServerStreamingCall<_GetInfo_Strict, _DataStream>;
  
  Set: grpc.handleClientStreamingCall<_DataStream_Strict, _GetInfo>;
  
}

export interface MainRequestsDefinition extends grpc.ServiceDefinition {
  Get: MethodDefinition<_GetInfo, _DataStream, _GetInfo_Strict, _DataStream_Strict>
  Set: MethodDefinition<_DataStream, _GetInfo, _DataStream_Strict, _GetInfo_Strict>
}
