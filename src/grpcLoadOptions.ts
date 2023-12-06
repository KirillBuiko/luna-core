import type * as protoLoader from '@grpc/proto-loader';

export const grpcLoadOptions: protoLoader.Options = {
    longs: String,
    enums: String,
    oneofs: true,
    defaults: false
}
