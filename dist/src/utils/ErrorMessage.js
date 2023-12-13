"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessage = void 0;
exports.ErrorMessage = {
    create(code, message) {
        const error = new Error(message);
        error.code = code;
        return error;
    }
};
