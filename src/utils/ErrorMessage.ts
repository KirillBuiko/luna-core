import type {ServerErrorResponse} from "@grpc/grpc-js/build/src/server-call";
import type {Status} from "@grpc/grpc-js/build/src/constants";

export const ErrorMessage = {
    create(code: Status, message: string | number | object | Error): ServerErrorResponse {
        const text: string | undefined = ((): string => {
            switch (typeof message) {
                case "object":
                    return message instanceof Error
                        ? message.toString()
                        : JSON.stringify(message);
                case "number":
                    return message.toString();
                default:
                    return message ? message.toString() : "";
            }
        })()
        const error = new Error(text) as ServerErrorResponse;
        error.code = code;
        return error;
    }
}
