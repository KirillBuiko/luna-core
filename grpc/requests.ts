import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { MainRequestsClient as _MainRequestsClient, MainRequestsDefinition as _MainRequestsDefinition } from './MainRequests';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  CodeFData: MessageTypeDefinition
  CodeFGet: MessageTypeDefinition
  CodeFInfoData: MessageTypeDefinition
  CodeFInfoGet: MessageTypeDefinition
  CodeFListData: MessageTypeDefinition
  CodeFPluginData: MessageTypeDefinition
  CodeFPluginGet: MessageTypeDefinition
  CodeFPluginProcedureData: MessageTypeDefinition
  CodeFPluginProcedureGet: MessageTypeDefinition
  CodeFPluginsListData: MessageTypeDefinition
  CodeFPluginsListGet: MessageTypeDefinition
  Custom: MessageTypeDefinition
  DataInfo: MessageTypeDefinition
  DataStream: MessageTypeDefinition
  DataType: EnumTypeDefinition
  FileInfo: MessageTypeDefinition
  GetInfo: MessageTypeDefinition
  MainRequests: SubtypeConstructor<typeof grpc.Client, _MainRequestsClient> & { service: _MainRequestsDefinition }
  RequestType: EnumTypeDefinition
  VarData: MessageTypeDefinition
  VarGet: MessageTypeDefinition
  VarValueData: MessageTypeDefinition
  VarValueGet: MessageTypeDefinition
  VarValueType: EnumTypeDefinition
  google: {
    protobuf: {
      Any: MessageTypeDefinition
    }
  }
}

