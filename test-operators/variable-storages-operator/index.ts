import {EventBus} from "../../src/event-bus/EventBus";
import {OperatorsClient} from "../OperatorClient";
import {serverConfigs} from "../../configs/serverConfigs";
import {ErrorDto} from "../../src/endpoints/ErrorDto";
import type {ComponentDescriptor} from "../../src/event-bus/IEventBus";
import {operatorsLogger} from "../main";

const eventBus = new EventBus();
const operatorClient = new OperatorsClient();

const cache = new Map<string, string>();
const valueSetLoop = new Set<string>();

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
				type: "VAR_VALUE_LIST"
			},
			{
				eventName: "new-request",
				type: "VAR_VALUE"
			},
			{
				eventName: "new-request",
				type: "VAR_VALUE_DELETE"
			},
			{
				eventName: "new-request",
				type: "VAR_VALUE_META_DELETE"
			},
			{
				eventName: "new-request",
				type: "VAR_VALUE_META"
			},
		]
	});
}

function eventsHandler() {
	eventBus.on(async (event, corrId) => {
		if (event.eventName === "event-error") {
			await operatorsLogger.info("[varst operator]", "Error event:", event.error);
		} else {
			await operatorsLogger.info("[varst operator]", "Event:", event.eventName, ", corrId =", corrId.slice(-5));
		}
		if ("buffer" in event && event.buffer) {
			await operatorsLogger.info("[varst operator]", "with buffer: ", event.buffer.toString());
		}
		if (event.eventName !== "new-request") {
			return;
		}
		const storages = event.components.filter(c => c.group === "variablesStorage");
		if (event.type === "VAR_VALUE_LIST") {
			const lists = await Promise.all(storages.map(async (component) => {
				const listCorrId = eventBus.emit({
					eventName: "make-request",
					type: "VAR_VALUE_LIST",
					name: "GET",
					componentId: component.id
				});
				const listEvent = await eventBus.wait(listCorrId, 5000);
				if (listEvent.eventName === "make-request-response" && listEvent.buffer) {
					return JSON.parse(listEvent.buffer.toString()) as string[];
				} else return [];
			}));
			const flatList = Array.from(new Set(lists.flat()));
			return eventBus.emit({
				eventName: "new-request-response",
				buffer: Buffer.from(JSON.stringify(flatList))
			}, {
				correlationId: corrId
			});
		}
		if ((event.type === "VAR_VALUE" && event.name === "GET") || event.type === "VAR_VALUE_META") {
			if (!(event.params && "id" in event.params)) {
				return eventBus.emit({
					eventName: "event-error",
					error: new ErrorDto("invalid-argument", "No id parameter")
				}, {
					correlationId: corrId
				});
			}
			const componentId = await componentWithValue(storages, event.params.id);
			if (componentId) {
				return eventBus.emit({
					eventName: "new-request-target",
					componentId
				}, {
					correlationId: corrId
				});
			}
			return eventBus.emit({
				eventName: "event-error",
				error: new ErrorDto("unavailable", "Variable value not found")
			}, {
				correlationId: corrId
			});
		}
		if (event.type === "VAR_VALUE" && event.name === "SET") {
			if (storages.length === 0) {
				return eventBus.emit({
					eventName: "event-error",
					error: new ErrorDto("unavailable", "No storages available")
				}, {
					correlationId: corrId
				});
			}
			let available = storages.filter(s => !valueSetLoop.has(s.id));
			if (available.length === 0) {
				valueSetLoop.clear();
				available = storages;
			}
			const idx = Math.floor(Math.random() * available.length);
			const componentId = available[idx].id;
			valueSetLoop.add(componentId);
			return eventBus.emit({
				eventName: "new-request-target",
				componentId
			}, {
				correlationId: corrId
			});
		}
		if (event.type === "VAR_VALUE_DELETE") {
			// По каждому хранилищу значений переменных отправляем события запроса на удаление идентификатора.
			// Ожидаем завершения всех запросов
			await Promise.all(storages.map(async ({id: componentId}) => {
				await operatorsLogger.info("Deleting", event.params, "in", componentId);
				const deleteCorrId = eventBus.emit({
					eventName: "make-request",
					type: "VAR_VALUE_DELETE",
					name: "SET",
					params: event.params,
					componentId
				});
				// Ожидаем ответное событие по correlationId с таймаутом в 2 секунды
				await eventBus.wait(deleteCorrId, 2000);
			}));
			// Отправляем событие ответа на запрос с пустым телом
			// по correlationId исходного события
			return eventBus.emit({
				eventName: "new-request-response",
				buffer: null
			}, {
				correlationId: corrId
			});
		}
	})
}

async function componentWithValue(storages: ComponentDescriptor[], valueId: string) {
	const componentId = cache.get(valueId);
	await operatorsLogger.info(`Cached ${valueId}: ${componentId}`);
	if (componentId && storages.some(s => s.id === componentId)) {
		return componentId;
	}
	return await new Promise<undefined | string>(async (resolve) => {
		await Promise.all(storages.map(async ({id}) => {
			const listCorrId = eventBus.emit({
				eventName: "make-request",
				type: "VAR_VALUE_LIST",
				name: "GET",
				componentId: id
			});
			const listEvent = await eventBus.wait(listCorrId, 5000);
			if (listEvent.eventName === "make-request-response" && listEvent.buffer) {
				const list = JSON.parse(listEvent.buffer.toString()) as string[];
				if (list.some(listId => listId === valueId)) {
					resolve(id);
				}
			}
		}));
		resolve(undefined);
	})
}
