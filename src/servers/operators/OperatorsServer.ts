import type {IServer, ServerStatus} from "@/app/types/ICoreServer";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import {type DisconnectReason, Server as IOServer, Socket} from 'socket.io';
import type {IServerDependencies} from "@/app/types/IServerDependencies";
import type {CorrelationIdType, EventBody, EventCallback, SubscribeEventBody} from "@/event-bus/IEventBus";
import type {SocketEventMap} from "@/servers/operators/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {Readable} from "node:stream";
import type {BusboyFileStream} from "@fastify/busboy";
import {isSubset} from "@/event-bus/utils";
import * as http from "node:http";

type MySocket = Socket<SocketEventMap, SocketEventMap>;

export class OperatorsServer implements IServer {
	requestManager: IRequestManager | undefined;
	status: ServerStatus;
	io: IOServer<SocketEventMap, SocketEventMap>;
	subscriptions: WeakMap<MySocket, SubscribeEventBody>;
	deps: IServerDependencies;
	private readonly thisEventBusCallback: EventCallback;

	constructor() {
		this.io = new IOServer();
		this.subscriptions = new Map();
		this.thisEventBusCallback = this.onEventBusEvent.bind(this);
	}

	async start(config: ServerConfigType, deps: IServerDependencies): Promise<Error | null> {
		this.deps = deps;

		const socket_http = http.createServer();

		this.io = new IOServer(socket_http, {
			cors: {
				origin: "*"
			}
		});

		const connectionPromise = new Promise<Error | null>((resolve) => {
			socket_http.listen(config.port, () => {
				resolve(null);
			});
		});

		this.io.on('connection', (socket) => {
			socket.on("subscribe", (...args) =>
				this.onSubscribe(socket, ...args));
			socket.on("new-request-target", (...args) =>
				this.eventByPass(socket, ...args));
			socket.on("new-request-response", (...args) =>
				this.eventByPass(socket, ...args));
			socket.on("make-request", (...args) =>
				this.onMakeRequest(socket, ...args));
			socket.on("event-error", (...args) =>
				this.eventByPass(socket, ...args));
			socket.on("error", this.onError.bind(this));
			socket.on("disconnect", this.onDisconnect.bind(this));
		});

		this.deps.eventBus.on(this.thisEventBusCallback);

		return connectionPromise;
	}

	stop(): Promise<Error | undefined> {
		return Promise.resolve(undefined);
	}

	onDisconnect(_reason: DisconnectReason, _description?: any) {

	}

	onError(_err: Error) {
		// TODO: need to send error on all events on this socket
	}

	onSubscribe(socket: MySocket, event: EventBody, _corrId: CorrelationIdType) {
		if (event.eventName === "subscribe") {
			this.subscriptions.set(socket, event);
		}
		this.onEventBusEvent(event, _corrId, true);
	}

	onMakeRequest(socket: MySocket, event: EventBody, corrId: CorrelationIdType) {
		// if (event.eventName === "make-request") {
		// 	let backEvent: EventBody = event.name === "GET"
		// 		? {
		// 			eventName: "make-request-response",
		// 			buffer: "ping"
		// 		}
		// 		: {
		// 			eventName: "make-request-response",
		// 			buffer: "pong"
		// 		};
		// 	socket.emit(backEvent.eventName, backEvent, corrId);
		// 	this.onEventBusEvent(event, corrId, true);
		// }
		if (event.eventName === "make-request") {
			if (event.name == "SET") {
				void this.deps.requestsManager.register({
					requestName: "SET",
					protocol: "REST_API",
					sourceReader: event.buffer && Readable.from(event.buffer) as BusboyFileStream,
					sourceWriter: (error, value) => {
						const info = value && value[value.infoType!];
						let event: EventBody = error ? {
							eventName: "event-error",
							error
						} : {
							eventName: "make-request-response",
							buffer: Buffer.from(JSON.stringify(info))
						}
						socket.emit(event.eventName, event, corrId);
						this.onEventBusEvent(event, corrId, true);
					}
				}, {
					requestType: event.type,
					dataType: "BYTES",
					dataValueType: "custom",
					custom: {
						getInfo: event.params
					},
					endpointId: event.componentId,
				})
			} else if (event.name == "GET") {
				// TODO: finish GET request
				this.deps.requestsManager.register({
					requestName: "GET",
					protocol: "REST_API",
					sourceWriter: (error, value) => {
						if (error || !value || !value.data) {
							let event: EventBody = {
								eventName: "event-error",
								error: error || new ErrorDto("unknown", "No stream object")
							};
							socket.emit(event.eventName, event, corrId);
							this.onEventBusEvent(event, corrId, true);
						} else {
							const buffer: Buffer[] = [];
							value.data.on("data", (chunk) => {
								chunk && buffer.push(chunk);
							})
							value.data.on("end", (chunk) => {
								chunk && buffer.push(chunk);
								let event: EventBody = {
									eventName: "make-request-response",
									buffer: Buffer.concat(buffer)
								}
								socket.emit(event.eventName, event, corrId);
								this.onEventBusEvent(event, corrId, true);
							})
							value.data.on("error", (err) => {
								let event: EventBody = {
									eventName: "event-error",
									error: err
								};
								socket.emit(event.eventName, event, corrId);
								this.onEventBusEvent(event, corrId, true);
							})
						}
					}
				}, {
					requestType: event.type,
					dataType: "BYTES",
					infoType: "custom",
					endpointId: event.componentId,
					custom: event.params,
				})
			}

		}
		this.onEventBusEvent(event, corrId, true);
	}

	eventByPass(_socket: MySocket, event: EventBody, correlationId: CorrelationIdType) {
		this.deps.eventBus.emit(event, {
			correlationId,
			ignoreCallback: this.thisEventBusCallback
		});
		this.onEventBusEvent(event, correlationId, true);
	}

	onEventBusEvent(event: EventBody, correlationId: CorrelationIdType, secondary = false) {
		if (secondary) {
			// TODO: emit events about events
			return;
		}
		let anyFired = false;
		this.io.sockets.sockets.forEach((socket) => {
			const subscription = this.subscriptions.get(socket);
			if (subscription) {
				const fired = subscription.subscribes.some(subEvent => {
					return isSubset(event, subEvent)
				})

				if (fired && socket.connected) {
					anyFired = true;
					socket.emit(event.eventName, event, correlationId);
				}
			}
		});
		if (!anyFired && event.eventName !== "event-error") {
			queueMicrotask(() => {
				this.deps.eventBus.emit({
					eventName: "event-error",
					error: new ErrorDto("unavailable", "There no operators subscribed to event")
				}, {
					correlationId: correlationId,
					ignoreCallback: this.thisEventBusCallback
				});
			})
		}
	}
}