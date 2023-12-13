"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = void 0;
class Endpoint {
    status = "not-connected";
    send(requestName, info) {
        if (this.status !== "connected")
            return { protocol: this.protocol, requestName };
        switch (requestName) {
            case "GET":
                return this.getHandler(info);
            case "SET":
                return this.setHandler(info);
        }
        return { protocol: this.protocol };
    }
}
exports.Endpoint = Endpoint;
