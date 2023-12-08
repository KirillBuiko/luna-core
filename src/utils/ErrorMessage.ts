import type {ServerErrorResponse} from "@grpc/grpc-js/src/server-call";
import type {Status} from "@grpc/grpc-js/src/constants";
import type {StatusObject} from "@grpc/grpc-js";

export const ErrorMessage = {
    create(code: Status, message: string): Partial<StatusObject> | ServerErrorResponse {
        return {
            code: code,
            message: message
        }
    }
}
