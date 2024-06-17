import type {Multipart} from "@fastify/multipart";
import type {BusboyFileStream} from "@fastify/busboy";
import type {FastifyRequest} from "fastify";
import {ErrorDto} from "@/endpoints/ErrorDto";

export type MultipartParts =
    {
        stream?: BusboyFileStream,
        fields: { [key: string]: { value: string | object, contentType: string } }
    }

export async function baseHandleMultipart(req: FastifyRequest): Promise<MultipartParts> {
    let multipart: AsyncIterableIterator<Multipart>;
    try {
        multipart = req.parts();
    } catch (e) {
        throw new ErrorDto("invalid-argument", `Multipart handle error: ${e}`);
    }
    if (!multipart) {
        throw new ErrorDto("invalid-argument", "Body is not multipart");
    }

    let parts: MultipartParts = {fields: {}};
    for (let i = 0; i < 10; i++) {
        const part = (await multipart.next());
        if (part.done) break;
        if (part.value.type == "field") parts.fields[part.value.fieldname] = {
            value: part.value.value as string,
            contentType: part.value.mimetype
        };
        if (part.value.type == "file") {
            parts.stream = part.value.file;
            break;
        }
    }

    return parts;
}
