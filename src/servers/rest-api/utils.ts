import type {Multipart} from "@fastify/multipart";
import type {BusboyFileStream} from "@fastify/busboy";
import type {FastifyRequest} from "fastify";

export type MultipartParts =
    {
        stream?: BusboyFileStream,
        fields: { [key: string]: { value: string | object, contentType: string } }
    }

export async function baseHandleMultipart(req: FastifyRequest): Promise<MultipartParts> {
    let multipart: AsyncIterableIterator<Multipart>;
    try {
        multipart = req.parts();
        if (!multipart) {
            throw "Body is not multipart";
        }
    } catch (e) {
        throw "Body is not multipart";
    }

    let parts: MultipartParts = {fields: {}};
    for (let i = 0; i < 2; i++) {
        const part = (await multipart.next());
        if (part.done) break;
        if (part.value.type == "field") parts.fields[part.value.fieldname] = {
            value: part.value.value as string,
            contentType: part.value.mimetype
        };
        if (part.value.type == "file") parts.stream = part.value.file;
    }

    return parts;
}
