import type {Multipart} from "@fastify/multipart";
import type {DataInfo} from "@grpc-build/DataInfo";
import type {BusboyFileStream} from "@fastify/busboy";
import {EndedStream} from "@/utils/EndedStream";
import type {FastifyRequest} from "fastify";

export async function handleMultipart(req: FastifyRequest) {
    let parts: AsyncIterableIterator<Multipart>;
    try {
        parts = req.parts();
        if (!parts) {
            throw "Body is not multipart";
        }
    } catch (e) {
        throw "Body is not multipart";
    }

    let info: DataInfo | undefined = undefined;
    let stream: BusboyFileStream | undefined = undefined;
    for (let i = 0; i < 2; i++) {
        const part = (await parts.next()).value as Multipart;
        if (!part) continue;
        if (part.type == "field" && part.fieldname == "info") info = part.value as DataInfo;
        if (part.type == "file") stream = part.file;
    }

    if (!info) {
        throw "Info not given";
    }
    if (typeof info != "object") {
        throw "Info is not JSON or wrong content-type";
    }

    if ((info.dataType == "BYTES" && !stream)) {
        throw "Data not given for BYTES data type";
    }

    if (!stream) {
        stream = new EndedStream() as BusboyFileStream;
    }

    return {
        info,
        stream
    }
}
