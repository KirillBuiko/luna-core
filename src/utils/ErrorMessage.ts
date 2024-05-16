import type { ServerErrorResponse } from "@grpc/grpc-js/build/src/server-call";
import type { Status } from "@grpc/grpc-js/build/src/constants";

export const ErrorMessage = {
    create(code: Status, message: string | number | object | Error): ServerErrorResponse {
        const text: string | object | undefined = ((): string | object => {
            switch (typeof message) {
                case "object":
                    return message instanceof Error
                        ? message.toString()
                        : message;
                case "number":
                    return message.toString();
                default:
                    return message ? message.toString() : "";
            }
        })()
        const error = new MyError(code, text);
        return error as ServerErrorResponse;
    }
}

class MyError {
    constructor(public code: number, public message: string | number | object | Error) { }
}
