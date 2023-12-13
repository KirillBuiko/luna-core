"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReaderWriter = void 0;
const node_stream_1 = require("node:stream");
function getReaderWriter() {
    const reader = new node_stream_1.Readable({
        read() { }
    });
    const writer = new node_stream_1.Writable({
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
    });
    return [reader, writer];
}
exports.getReaderWriter = getReaderWriter;
