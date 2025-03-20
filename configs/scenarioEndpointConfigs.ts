import type {EndpointConfigsType, EndpointName} from "../src/app/types/RemoteStaticEndpointConfigType";
import {randomUUID} from "node:crypto";

const allScenarioEndpointConfigs: EndpointConfigsType = [
	{
		host: "http://0.0.0.0:6001",
		name: "variableStorage1",
		id: randomUUID(),
		group: "variablesStorage"
	},
	{
		host: "http://0.0.0.0:6002",
		name: "variableStorage2",
		id: randomUUID(),
		group: "variablesStorage"
	},
	{
		host: "http://0.0.0.0:6003",
		name: "variableStorage3",
		id: randomUUID(),
		group: "variablesStorage"
	},
	{
		host: "http://0.0.0.0:6011",
		name: "executor1",
		id: randomUUID(),
		group: "executor"
	},
	{
		host: "http://0.0.0.0:6012",
		name: "executor2",
		id: randomUUID(),
		group: "executor"
	},
	{
		host: "http://0.0.0.0:6013",
		name: "executor3",
		id: randomUUID(),
		group: "executor"
	},
]

export const scenarioEndpointConfigs: EndpointConfigsType = (() => {
	if (process.env.SCENARIO_NAME === "1") {
		const names: EndpointName[] = ["variableStorage1", "variableStorage2", "variableStorage3"];
		return allScenarioEndpointConfigs.filter((config) => names.includes(config.name))
	}
	return allScenarioEndpointConfigs;
})()
