import type {RequestName} from "@/types/general";
import type {RequestType} from "@grpc-build/RequestType";
import type {ErrorDto} from "@/endpoints/ErrorDto";
import type {EndpointGroup} from "@/app/types/RemoteStaticEndpointConfigType";

type PropertiesOfUnion<T> = T extends T ? T : never

export type CorrelationIdType = string;

export interface ComponentDescriptor {
	id: string;
	group: EndpointGroup;
	status: "active" | "unable";
}

export interface ComponentsInfoBody {
	components: ComponentDescriptor[]
}

export interface CorrelationIdBody {
	correlationId: CorrelationIdType
}

export interface EventNameBody<N extends EventName = EventName> {
	eventName: N
}

export interface NewRequestEventBody extends ComponentsInfoBody, EventNameBody<"new-request"> {
	type: RequestType,
	name: RequestName,
	params?: object
}

export interface MakeRequestEventBody extends EventNameBody<"make-request"> {
	type: RequestType,
	name: RequestName,
	params?: object,
	buffer?: Buffer
}

export interface NewRequestTargetEventBody extends EventNameBody<"new-request-target"> {
	componentId: string;
}

export interface NewRequestResponseEventBody extends EventNameBody<"new-request-response"> {
	buffer: Buffer
}

export interface MakeRequestResponseEventBody extends EventNameBody<"make-request-response"> {
	buffer?: Buffer | null
}

export interface ErrorResponse extends EventNameBody<"event-error"> {
	error: ErrorDto
}

export interface SubscribeEventBody extends EventNameBody<"subscribe"> {
	subscribes: BodyFilter[]
}

type ResponseEventBody = NewRequestResponseEventBody | NewRequestTargetEventBody | ErrorResponse | MakeRequestResponseEventBody;
type RequestEventBody = NewRequestEventBody | MakeRequestEventBody;
type NotificationEventBody = SubscribeEventBody;
export type EventBody = RequestEventBody | ResponseEventBody | NotificationEventBody;
export type EventName =
	| "new-request-target"
	| "new-request"
	| "new-request-response"
	| "subscribe"
	| "event-error"
	| "make-request"
	| "make-request-response";
export type EventMap = {[event in EventName]: [EventBody, CorrelationIdType]}

type A<E extends EventName, O> = Partial<O extends EventNameBody<E> ? O : never>;

export type BodyFilter<E extends EventName = EventName, B = EventBody & CorrelationIdBody> = Partial<B extends EventNameBody<E> ? B : never>;

export type EventCallback = (body: EventBody, corrId: CorrelationIdType) => void;

export type EmittedEventDescriptor = CorrelationIdBody;

export type EmitOptions = {
	correlationId?: CorrelationIdType;
	ignoreCallback?: EventCallback;
}

export interface IEventBus {
	on<E extends EventName>(callback: EventCallback, filter?: BodyFilter<E>): void;

	once<E extends EventName>(callback: EventCallback, filter?: BodyFilter<E>): void;

	wait<E extends EventName>(filter?: BodyFilter<E>, timeoutMs?: number): Promise<EventBody>;

	emit(body: EventBody, options?: EmitOptions): EmittedEventDescriptor;

	removeListener(callback: EventCallback): void;
}