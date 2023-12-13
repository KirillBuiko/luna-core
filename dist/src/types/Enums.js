"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultCode = void 0;
// 1000 - 2000: Data type errors
var ResultCode;
(function (ResultCode) {
    ResultCode[ResultCode["OK"] = 1] = "OK";
    ResultCode[ResultCode["FAIL"] = 2] = "FAIL";
    ResultCode[ResultCode["INFO_NOT_GIVEN"] = 1000] = "INFO_NOT_GIVEN";
})(ResultCode || (exports.ResultCode = ResultCode = {}));
