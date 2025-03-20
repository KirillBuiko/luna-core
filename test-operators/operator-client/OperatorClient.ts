import type {IServer, ServerStatus} from "@/app/types/ICoreServer";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import { io, Socket } from 'socket.io-client';
import type {IServerDependencies} from "@/app/types/IServerDependencies";
import type {CorrelationIdType, EventBody, SubscribeEventBody} from "@/event-bus/IEventBus";
import type {SocketEventMap} from "@/servers/operators/types";
import {operatorsLogger} from "../main";

type MySocket = Socket<SocketEventMap, SocketEventMap>;

type IOperatorClient = Omit<IServer, "requestManager">;
type IOperatorClientDependencies = Omit<IServerDependencies, "requestsManager">;

export class OperatorsClient implements IOperatorClient {
	status: ServerStatus;
	io: Socket<SocketEventMap, SocketEventMap>;
	subscriptions: WeakMap<MySocket, SubscribeEventBody>;
	deps: IOperatorClientDependencies;

	constructor() {
		this.subscriptions = new Map();
	}

	async start(config: ServerConfigType, deps: IOperatorClientDependencies): Promise<Error | null> {
		this.deps = deps;
		let resolvePromise: (value: null) => void;
		let rejectPromise: (err: Error) => void;
		const connectionPromise =  new Promise<null>((resolve, reject) => {
			resolvePromise = resolve;
			rejectPromise = reject;
		});
		this.io = io(`http://${config.host}:${config.port}`, {
			reconnection: true,
			withCredentials: true,
		});

		this.io.on('connect', () => {
			resolvePromise(null);
			operatorsLogger.info("Connected");
			this.io.on("new-request", (...args) =>
				this.eventByPass(...args));
			this.io.on("make-request-response", (...args) =>
				this.eventByPass(...args));
			this.io.on("event-error", (...args) =>
				this.eventByPass(...args));
			// this.io.on("disconnect", this.onDisconnect.bind(this));
		});

		this.io.on('connect_error', rejectPromise!);

		this.deps.eventBus.on(this.onEventBusEvent.bind(this));

		return connectionPromise;
	}

	async stop(): Promise<Error | undefined> {
		this.io.disconnect();
		return;
	}

	eventByPass(event: EventBody, correlationId: CorrelationIdType) {
		this.deps.eventBus.emit(event, {correlationId});
	}

	onEventBusEvent(event: EventBody, correlationId: CorrelationIdType) {
		switch (event.eventName) {
			case "new-request-response":
			case "new-request-target":
			case "make-request":
			case "event-error":
			case "subscribe":
				this.io.emit(event.eventName, event, correlationId);
				break;
		}
	}
}