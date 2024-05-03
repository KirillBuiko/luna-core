import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { DataRequestsClient as _DataRequestsClient, DataRequestsDefinition as _DataRequestsDefinition } from './DataRequests';

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
  DataRequests: SubtypeConstructor<typeof grpc.Client, _DataRequestsClient> & { service: _DataRequestsDefinition }
  DataStream: MessageTypeDefinition
  DataType: EnumTypeDefinition
  FileInfo: MessageTypeDefinition
  GetInfo: MessageTypeDefinition
  RequestType: EnumTypeDefinition
  google: {
    protobuf: {
      Any: MessageTypeDefinition
    }
  }
}

