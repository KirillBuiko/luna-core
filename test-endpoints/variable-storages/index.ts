import {initVariableStorage1} from "./variableStorage1";
import {endpointConfigs} from "../../configs/endpointConfigs";

export function initVariableStorages() {
	initVariableStorage1(endpointConfigs.find(config => config.name === "variableStorage1"));
	initVariableStorage1(endpointConfigs.find(config => config.name === "variableStorage2"));
	initVariableStorage1(endpointConfigs.find(config => config.name === "variableStorage3"));
}
