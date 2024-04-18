// Original file: node_modules/luna-proto-files/data_requests.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BidiMessage as _BidiMessage, BidiMessage__Output as _BidiMessage__Output } from './BidiMessage';
import type { DataStream as _DataStream, DataStream__Output as _DataStream__Output } from './DataStream';
import type { GetRequestInfo as _GetRequestInfo, GetRequestInfo__Output as _GetRequestInfo__Output } from './GetRequestInfo';
import type { HelloInfo as _HelloInfo, HelloInfo__Output as _HelloInfo__Output } from './HelloInfo';

export interface DataRequestsClient extends grpc.Client {
  Connect(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_BidiMessage, _BidiMessage__Output>;
  Connect(options?: grpc.CallOptions): grpc.ClientDuplexStream<_BidiMessage, _BidiMessage__Output>;
  connect(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_BidiMessage, _BidiMessage__Output>;
  connect(options?: grpc.CallOptions): grpc.ClientDuplexStream<_BidiMessage, _BidiMessage__Output>;
  
  Get(argument: _GetRequestInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  Get(argument: _GetRequestInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  get(argument: _GetRequestInfo, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  get(argument: _GetRequestInfo, options?: grpc.CallOptions): grpc.ClientReadableStream<_DataStream__Output>;
  
  Hello(argument: _HelloInfo, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  Hello(argument: _HelloInfo, metadata: grpc.Metadata, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  Hello(argument: _HelloInfo, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  Hello(argument: _HelloInfo, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  hello(argument: _HelloInfo, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  hello(argument: _HelloInfo, metadata: grpc.Metadata, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  hello(argument: _HelloInfo, options: grpc.CallOptions, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  hello(argument: _HelloInfo, callback: grpc.requestCallback<_HelloInfo__Output>): grpc.ClientUnaryCall;
  
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
  Connect: grpc.handleBidiStreamingCall<_BidiMessage__Output, _BidiMessage>;
  
  Get: grpc.handleServerStreamingCall<_GetRequestInfo__Output, _DataStream>;
  
  Hello: grpc.handleUnaryCall<_HelloInfo__Output, _HelloInfo>;
  
  Set: grpc.handleClientStreamingCall<_DataStream__Output, _GetRequestInfo>;
  
}

export interface DataRequestsDefinition extends grpc.ServiceDefinition {
  Connect: MethodDefinition<_BidiMessage, _BidiMessage, _BidiMessage__Output, _BidiMessage__Output>
  Get: MethodDefinition<_GetRequestInfo, _DataStream, _GetRequestInfo__Output, _DataStream__Output>
  Hello: MethodDefinition<_HelloInfo, _HelloInfo, _HelloInfo__Output, _HelloInfo__Output>
  Set: MethodDefinition<_DataStream, _GetRequestInfo, _DataStream__Output, _GetRequestInfo__Output>
}
