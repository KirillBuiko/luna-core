import {test, expect} from "@jest/globals";
import {SpecificRestApiEndpoint} from "../SpecificRestApiEndpoint";
import type {GetInfo_Strict} from "@grpc-build/GetInfo";
import type {DataInfo_Strict} from "@grpc-build/DataInfo";

const utils = SpecificRestApiEndpoint.prototype;

const testGetInfo: GetInfo_Strict = {
    infoType: "codeFGet",
    codeFGet: {
        id: "123"
    }
}
const testDataInfo: DataInfo_Strict = {
    dataValueType: "codeF",
    codeF: {
        getInfo: {
            id: "123"
        }
    }
}

const testEmptyGetInfo: GetInfo_Strict = {
    infoType: "codeFGet"
}
const testEmptyDataInfo: DataInfo_Strict = {
    dataValueType: "codeF",
    codeFPlugin: {
    }
}

describe('test info extract and check', function () {
    test('extract info from GetInfo', () => {
        expect(utils.extractGetInfo(testGetInfo)).toEqual(testGetInfo.codeFGet)
        expect(utils.extractGetInfo(testEmptyGetInfo)).toBeUndefined()
    });

    test('extract info from DataInfo', () => {
        expect(utils.extractGetInfo(testDataInfo)).toEqual(testGetInfo.codeFGet)
        expect(utils.extractGetInfo(testEmptyDataInfo)).toBeUndefined()
    });

    test('check requirements for GetInfo', () => {
        expect(utils.checkRequirements(utils.extractGetInfo(testGetInfo), ["id"]))
            .toBeUndefined()
        expect(utils.checkRequirements(utils.extractGetInfo(testGetInfo), ["type"]))
            .toEqual("type")
        expect(utils.checkRequirements(utils.extractGetInfo(testEmptyGetInfo), ["id"]))
            .toEqual("info")
    });

    test('check requirements for DataInfo', () => {
        expect(utils.checkRequirements(utils.extractGetInfo(testDataInfo), ["id"]))
            .toBeUndefined()
        expect(utils.checkRequirements(utils.extractGetInfo(testDataInfo), ["type"]))
            .toEqual("type")
        expect(utils.checkRequirements(utils.extractGetInfo(testEmptyDataInfo), ["id"]))
            .toEqual("info")
    });
});
