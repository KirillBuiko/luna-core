import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DataRequestsClient as _DataRequestsClient, DataRequestsDefinition as _DataRequestsDefinition } from './DataRequests';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  BidiMessage: MessageTypeDefinition
  CodeFragmentData: MessageTypeDefinition
  CodeFragmentGet: MessageTypeDefinition
  CodeFragmentInfoData: MessageTypeDefinition
  CodeFragmentInfoGet: MessageTypeDefinition
  CodeFragmentListData: MessageTypeDefinition
  CodeFragmentPluginData: MessageTypeDefinition
  CodeFragmentPluginGet: MessageTypeDefinition
  CodeFragmentPluginProcedureData: MessageTypeDefinition
  CodeFragmentPluginProcedureGet: MessageTypeDefinition
  CodeFragmentPluginsListData: MessageTypeDefinition
  CodeFragmentPluginsListGet: MessageTypeDefinition
  DataRequestInfo: MessageTypeDefinition
  DataRequests: SubtypeConstructor<typeof grpc.Client, _DataRequestsClient> & { service: _DataRequestsDefinition }
  DataStream: MessageTypeDefinition
  DataType: EnumTypeDefinition
  FileInfo: MessageTypeDefinition
  GetRequestInfo: MessageTypeDefinition
  HelloInfo: MessageTypeDefinition
  RequestType: EnumTypeDefinition
  TaskGet: MessageTypeDefinition
  VariableGet: MessageTypeDefinition
}

