"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRestApiServer = void 0;
const fastify_1 = __importDefault(require("fastify"));
class AbstractRestApiServer {
    status = "off";
    server = (0, fastify_1.default)();
    constructor() {
        this.server.register(require('@fastify/multipart')).then(() => {
            this.server.get('/get', this.getHandler.bind(this));
            this.server.post('/set', this.setHandler.bind(this));
        });
    }
    async defaultStart(config) {
        try {
            await this.server.listen({
                port: config.port
            });
        }
        catch (err) {
            return err;
        }
        this.status = "on";
        return null;
    }
    stop() {
        this.status = "off";
        return this.server.close();
    }
}
exports.AbstractRestApiServer = AbstractRestApiServer;
