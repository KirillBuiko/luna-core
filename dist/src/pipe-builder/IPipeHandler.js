"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipeHandler = void 0;
require("@grpc-build/DataStream");
require("@grpc/grpc-js/build/src/constants");
class PipeHandler {
    handle(sourceOptions, destOptions) {
        if (sourceOptions.requestName === "GET" && destOptions.requestName == "GET") {
            this.getHandler(sourceOptions, destOptions);
        }
        else if (sourceOptions.requestName === "SET" && destOptions.requestName == "SET") {
            this.setHandler(sourceOptions, destOptions);
        }
    }
}
exports.PipeHandler = PipeHandler;
