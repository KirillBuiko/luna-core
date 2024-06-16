import type {ErrorReason} from "@/endpoints/ErrorDto";

export const reasonToHttpCode: {[ind in ErrorReason]: number} = {
    "endpoint-error": 502,
    "invalid-argument": 400,
    "not-supported": 405,
    "aborted": 0,
    "unavailable": 502,
    "unknown": 500
}

export enum HttpCode {
    OK=200,
    CREATED=201,
    EMPTY=204,
}
