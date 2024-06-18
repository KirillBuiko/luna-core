import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { MainRequestsClient as _MainRequestsClient, MainRequestsDefinition as _MainRequestsDefinition } from './MainRequests';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  BasicGetInfoData: MessageTypeDefinition
  BasicIdGet: MessageTypeDefinition
  BasicJsonData: MessageTypeDefinition
  BasicSettableJsonData: MessageTypeDefinition
  CodeFPluginProcedureGet: MessageTypeDefinition
  DataInfo: MessageTypeDefinition
  DataStream: MessageTypeDefinition
  DataType: EnumTypeDefinition
  Empty: MessageTypeDefinition
  GetInfo: MessageTypeDefinition
  MainRequests: SubtypeConstructor<typeof grpc.Client, _MainRequestsClient> & { service: _MainRequestsDefinition }
  RequestType: EnumTypeDefinition
  google: {
    protobuf: {
      Any: MessageTypeDefinition
    }
  }
}

