import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { MainRequestsClient as _MainRequestsClient, MainRequestsDefinition as _MainRequestsDefinition } from './MainRequests';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  CFData: MessageTypeDefinition
  CFGet: MessageTypeDefinition
  CFInfoData: MessageTypeDefinition
  CFInfoGet: MessageTypeDefinition
  CFListData: MessageTypeDefinition
  CFPluginData: MessageTypeDefinition
  CFPluginGet: MessageTypeDefinition
  CFPluginProcedureData: MessageTypeDefinition
  CFPluginProcedureGet: MessageTypeDefinition
  CFPluginsListData: MessageTypeDefinition
  CFPluginsListGet: MessageTypeDefinition
  DataInfo: MessageTypeDefinition
  DataStream: MessageTypeDefinition
  DataType: EnumTypeDefinition
  FileInfo: MessageTypeDefinition
  GetInfo: MessageTypeDefinition
  MainRequests: SubtypeConstructor<typeof grpc.Client, _MainRequestsClient> & { service: _MainRequestsDefinition }
  RequestType: EnumTypeDefinition
  google: {
    protobuf: {
      Any: MessageTypeDefinition
    }
  }
}

