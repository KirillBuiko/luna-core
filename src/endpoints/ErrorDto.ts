export type ErrorReason = "not-supported" | "invalid-argument" | "aborted" | "unavailable" | "endpoint-error" | "unknown"

export class ErrorDto {
    constructor(public reason: ErrorReason, public message: string | object = "") {}
}

export class PlainErrorDto {
    public reason: ErrorReason;
    public message: string;
    public name: string = "Error";

    constructor(error: ErrorDto) {
        this.reason = error.reason;
        this.message = typeof error.message == "object" ? JSON.stringify(error.message) : error.message
    }
}
