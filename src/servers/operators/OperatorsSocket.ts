import type {IServer, ServerStatus} from "@/app/types/ICoreServer";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {ServerConfigType} from "@/app/types/ServerConfigType";
import express from 'express';
import {createServer, Server} from 'node:http';
import {type DisconnectReason, Server as IOServer, Socket} from 'socket.io';
import type {IServerDependencies} from "@/app/types/IServerDependencies";
import type {CorrelationIdType, EventBody, EventCallback, EventMap, SubscribeEventBody} from "@/event-bus/IEventBus";
import type {SocketEventMap} from "@/servers/operators/types";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {Readable} from "node:stream";
import type {BusboyFileStream} from "@fastify/busboy";

type MySocket = Socket<SocketEventMap, SocketEventMap>;

export class OperatorsSocket implements IServer {
	requestManager: IRequestManager | undefined;
	status: ServerStatus;
	io: IOServer<SocketEventMap, SocketEventMap>;
	server: Server;
	subscriptions: WeakMap<MySocket, SubscribeEventBody>;
	deps: IServerDependencies;
	private readonly thisEventBusCallback: EventCallback;

	constructor() {
		const app = express();
		this.server = createServer(app);
		this.io = new IOServer(this.server);
		this.subscriptions = new Map();
		this.thisEventBusCallback = this.onEventBusEvent.bind(this);
	}

	async start(config: ServerConfigType, deps: IServerDependencies): Promise<Error | null> {
		this.deps = deps;
		const connectionPromise = new Promise<Error | null>((resolve, reject) => {
			this.server.listen(config.port, () => {
				resolve(null);
			});
			this.server.on("error", (err) => {
				resolve(err);
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

	onDisconnect(reason: DisconnectReason, description?: any) {

	}

	onError(err: Error) {
		// TODO: need to send error on all events on this socket
	}

	onSubscribe(socket: MySocket, event: EventBody, _corrId: CorrelationIdType) {
		if (event.eventName === "subscribe") {
			this.subscriptions.set(socket, event);
		}
	}

	onMakeRequest(socket: MySocket, event: EventBody, corrId: CorrelationIdType) {
		if (event.eventName === "make-request") {
			if (event.name == "SET") {
				if (!event.buffer) {
					socket.emit("event-error", {
						eventName: "event-error",
						error: new ErrorDto("invalid-argument", "Operator do not pass buffer to SET request")
					}, corrId);
					return;
				}
				void this.deps.requestsManager.register({
					requestName: "SET",
					protocol: "REST_API",
					sourceReader: Readable.from(event.buffer) as BusboyFileStream,
					sourceWriter: (error, value) => {
						const info = value && value[value.infoType!];
						let event: EventBody = error ? {
							eventName: "event-error",
							error
						} : {
							eventName: "make-request-response",
							buffer: info
						}
						socket.emit(event.eventName, event, corrId);
						this.eventByPass(socket, event, corrId);
					}
				}, {
					requestType: event.type,
					dataType: "BYTES",
					infoType: "custom",
					custom: event.params,
				})
			} else if (event.name == "GET") {
				// TODO: finish GET request
				this.deps.requestsManager.register({
					requestName: "GET",
					protocol: "REST_API",
					sourceWriter: (error, value) => {
						let event: EventBody = error ? {
							eventName: "event-error",
							error
						} : {
							eventName: "make-request-response",
							buffer: info
						}
						socket.emit(event.eventName, event, corrId);
						this.eventByPass(socket, event, corrId);
					}
				}, {
					requestType: event.type,
					dataType: "BYTES",
					infoType: "custom",
					custom: event.params,
				})
			}

		}
		this.eventByPass(socket, event, corrId);
	}

	eventByPass(_socket: MySocket, event: EventBody, correlationId: CorrelationIdType) {
		this.deps.eventBus.emit(event, {correlationId});
	}

	onEventBusEvent(body: EventBody, correlationId: CorrelationIdType) {
		let anyFired = false;
		this.io.sockets.sockets.forEach((socket) => {
			const subscription = this.subscriptions.get(socket);
			if (subscription) {
				const fired = subscription.subscribes.some(subEvent =>
					isSubset(body, subEvent)
				)
				if (fired && socket.connected) {
					anyFired = true;
					socket.emit(body.eventName, body, correlationId);
				}
			}
		});
		if (!anyFired) {
			this.deps.eventBus.emit({
				eventName: "event-error",
				error: new ErrorDto("unavailable", "There no operators subscribed to event")
			}, {
				correlationId: correlationId
			});
		}
	}
}