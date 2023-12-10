import type {ServerErrorResponse} from "@grpc/grpc-js/build/src/server-call";
import type {Status} from "@grpc/grpc-js/build/src/constants";

export const ErrorMessage = {
    create(code: Status, message: string): ServerErrorResponse {
        const error = new Error(message) as ServerErrorResponse;
        error.code = code;
        return error;
    }
}
