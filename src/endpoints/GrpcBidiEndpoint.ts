import {Endpoint} from "@/endpoints/Endpoint";
import type {DataRequestsHandlers} from "@grpc-build/DataRequests";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {ProtocolType} from "@/types/Types";

// export class GrpcBidiEndpoint extends Endpoint {
//     protocol: ProtocolType = "GRPC";
//     call: Parameters<DataRequestsHandlers["Connect"]>[0];
//
//     init(call: Parameters<DataRequestsHandlers["Connect"]>[0]): void {
//         this.call = call;
//         call.on("data", (data) => {
//             data
//         })
//     }
//
//     protected getGetHandler(info: GetInfo) {
//
//     }
//
//     protected getSetHandler(info: DataInfo) {
//
//     }
// }
