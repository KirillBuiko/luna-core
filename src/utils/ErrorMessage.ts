import {ErrorDto} from "@/endpoints/ErrorDto";

export const ErrorMessage = {
    create(err: ErrorDto | string | object): ErrorDto {
        return err instanceof ErrorDto
            ? err
            : err instanceof Error
                ? new ErrorDto("unknown", err.toString())
                : new ErrorDto("unknown", err);
    },
    createMessage(message: string | number | object | Error): string | object {
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
    }
}
