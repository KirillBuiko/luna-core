import type {
	BodyFilter, CorrelationIdBody, CorrelationIdType, EmitOptions,
	EmittedEventDescriptor, ErrorResponse,
	EventBody,
	EventCallback, EventMap,
	EventName,
	IEventBus
} from "@/event-bus/IEventBus";
import {ErrorDto} from "@/endpoints/ErrorDto";

type anyListener = () => void

export class EventBus implements IEventBus {
	private counter = 1;
	private listeners = new Map<EventCallback, EventCallback>();

	constructor() {
	}

	emit(body: EventBody, options: EmitOptions): EmittedEventDescriptor {
		const corrId = options.correlationId ?? this.generateCorrId();
		this.listeners.forEach((listener: EventCallback) =>
			options.ignoreCallback !== listener && listener(body, corrId));
		return {
			correlationId: corrId
		};
	}

	on<E extends EventName>(callback: EventCallback, filter?: BodyFilter<E>): void {
		const callbackWrapper = (body: EventBody, correlationId: CorrelationIdType): void => {
			this.resolveCallback(body, correlationId, callback, filter)
		};
		this.listeners.set(callback, callbackWrapper);
	}

	once<E extends EventName>(callback: EventCallback, filter?: BodyFilter<E>): void {
		const callbackWrapper = (body: EventBody, correlationId: CorrelationIdType) => {
			if (this.resolveCallback(body, correlationId, callback, filter)) {
				this.removeListener(callback);
			}
		}
		this.listeners.set(callback, callbackWrapper);
	}

	removeListener(callback: EventCallback): void {
		this.listeners.delete(callback);
	}

	async wait<E extends EventName>(filter: BodyFilter<E>, timeoutMs?: number): Promise<EventBody> {
		let resolvePromise: (value: EventBody) => void;
		const promise = new Promise<EventBody>((resolve, reject) => {
			resolvePromise = resolve;
		});
		const timeoutHandler = timeoutMs && setTimeout(() => {
			resolvePromise({
				eventName: "error",
				error: new ErrorDto("unavailable", "Operator didn't answer")
			})
		}, timeoutMs);
		const eventListener = (body: EventBody) => {
			resolvePromise(body);
			timeoutHandler && clearTimeout(timeoutHandler);
		};
		if (filter.correlationId) {
			const cutFilter = Object.assign({}, filter);
			delete cutFilter["eventName"];
			this.once(eventListener, cutFilter);
		} else {
			this.once(eventListener, filter);
		}

		if (filter.eventName !== "error" && filter.correlationId !== undefined) {
			this.once(eventListener, {
				...filter,
				eventName: "error",
			});
		}
		return promise;
	}

	private resolveCallback(body: EventBody, correlationId: CorrelationIdType, callback: EventCallback, filter?: BodyFilter) {
		if (!filter || isSubset({...body, correlationId}, filter)) {
			callback(body, correlationId);
			return true;
		}
		return false;
	}

	private generateCorrId(): CorrelationIdType {
		return (this.counter++).toString();
	}
}