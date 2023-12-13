"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyServer = void 0;
class DummyServer {
    status = "off";
    requestManager;
    constructor() {
    }
    start(config, requestManager) {
        this.requestManager = requestManager;
        this.status = "on";
        return Promise.resolve(null);
    }
    stop() {
        this.status = "off";
        return Promise.resolve(undefined);
    }
}
exports.DummyServer = DummyServer;
