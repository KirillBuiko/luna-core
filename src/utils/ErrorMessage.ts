import type {ServerErrorResponse} from "@grpc/grpc-js/src/server-call";
import type {Status} from "@grpc/grpc-js/src/constants";

export const ErrorMessage = {
    create(code: Status, message: string): ServerErrorResponse {
        return {
            name: "Error",
            code: code,
            message: message
        }
    }
}
