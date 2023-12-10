import {Readable, Writable} from "node:stream";

export function getReaderWriter(): [Readable, Writable] {
    const reader = new Readable({
        read() {}
    });
    const writer = new Writable({
        write(chunk, encoding, callback) {
            reader.push(chunk);
            callback();
        },
    });
    writer.on("close", () => {
        reader.push(null);
    });
    writer.on("error", err => {
        reader.destroy(err);
    })
    return [reader, writer];
}