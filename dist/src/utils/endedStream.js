"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndedStream = void 0;
class EndedStream {
    on(event, listener) {
        if (event === "end")
            listener();
    }
}
exports.EndedStream = EndedStream;
