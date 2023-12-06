import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DataRequestsClient as _DataRequestsClient, DataRequestsDefinition as _DataRequestsDefinition } from './DataRequests';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  DataRequestInfo: MessageTypeDefinition
  DataRequests: SubtypeConstructor<typeof grpc.Client, _DataRequestsClient> & { service: _DataRequestsDefinition }
  DataStream: MessageTypeDefinition
  DataType: EnumTypeDefinition
  GetRequestInfo: MessageTypeDefinition
  RequestType: EnumTypeDefinition
  TaskDataInfo: MessageTypeDefinition
  TaskGetInfo: MessageTypeDefinition
  VariableDataInfo: MessageTypeDefinition
  VariableGetInfo: MessageTypeDefinition
}

