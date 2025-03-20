import {EventBus} from "../../src/event-bus/EventBus";
import {OperatorsClient} from "../operator-client/OperatorClient";
import {serverConfigs} from "../../configs/serverConfigs";
import {operatorsLogger} from "../main";
import {delay} from "../../utils/delay";
import {ErrorDto} from "../../src/endpoints/ErrorDto";

const eventBus = new EventBus();
const operatorClient = new OperatorsClient();

export async function initVariableStorageOperator() {
	await operatorClient.start(serverConfigs.operatorsServer, {
		eventBus
	})
	eventsHandler();
	eventBus.emit({
		eventName: "subscribe",
		subscribes: [
			{
				eventName: "new-request",
				type: "VAR_VALUE"
			}
		]
	});
	delay(1000);
	const setDesc = eventBus.emit({
		eventName: "make-request",
		name: "SET",
		buffer: Buffer.from("variable-value"),
		type: "VAR_VALUE",
	})
	const setResult = await eventBus.wait(setDesc);
	if (setResult.eventName === "make-request-response" && setResult.buffer) {
		operatorsLogger.info("Set result: ", setResult.buffer?.toString());
		const id = JSON.parse(setResult.buffer.toString()).id;
		const getDesc = eventBus.emit({
			eventName: "make-request",
			name: "GET",
			params: {
				id: id
			},
			type: "VAR_VALUE",
		});
		const getResult = await eventBus.wait(getDesc);
		if (getResult.eventName === "make-request-response" && getResult.buffer) {
			operatorsLogger.info("Get result: ", getResult.buffer?.toString());
		}
	}

	// operatorsLogger.info("Set result: ", setResult.buffer?.toString());
	// const result = await eventBus.wait(setDesc);
	// const requestDesc = eventBus.emit({
	// 	eventName: "make-request",
	// 	name: "GET",
	// 	type: "VAR_VALUE_LIST",
	// })
	// const result = await eventBus.wait(requestDesc);
	// if (result.eventName === "make-request-response") {
	// 	operatorsLogger.info("Result is: ", result.buffer, result.buffer?.toString());
	// }
}

function eventsHandler() {
	eventBus.on((event, corrId) => {
		if (event.eventName === "new-request") {
			if (event.type === "VAR_VALUE_LIST") {
				eventBus.emit({
					eventName: "new-request-response",
					buffer: Buffer.from(JSON.stringify({
						value: ["a", "b", "c"]
					}))
				}, {
					correlationId: corrId
				});
			}
			if (event.type === "VAR_VALUE") {
				const components = event.components.filter(c => c.group === "variablesStorage")
				if (components.length === 0) {
					eventBus.emit({
						eventName: "event-error",
						error: new ErrorDto("unavailable", "There no components in target group")
					}, {
						correlationId: corrId
					});
					return;
				}
				eventBus.emit({
					eventName: "new-request-target",
					componentId: components[1].id
				}, {
					correlationId: corrId
				});
			}
		}
	})
}
