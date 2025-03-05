import type {KeysOfObjects, RequestName} from "@/types/general";
import type {RequestType} from "@grpc-build/RequestType";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {ErrorDto} from "@/endpoints/ErrorDto";

type KeysOfUnion<T> = T extends T ? keyof T : never
type PropertiesOfUnion<T> = T extends T ? T : never
type ValueTypeOfKey<K extends string, T> = T extends { [key in K]: infer VT } ? VT : never

export type CorrelationIdType = string;

export interface ComponentDescriptor {
	id: string;
	group: string;
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
	params: object
}

export interface MakeRequestEventBody extends EventNameBody<"make-request"> {
	type: RequestType,
	name: RequestName,
	params: object,
	buffer?: Buffer
}

export interface NewRequestTargetEventBody extends EventNameBody<"new-request-target"> {
	componentId: string;
}

export interface NewRequestResponseEventBody extends EventNameBody<"new-request-response"> {
	buffer: Buffer
}

export interface MakeRequestResponseEventBody extends EventNameBody<"make-request-response"> {
	buffer?: Buffer | object | string | null
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

type AnyBody = PropertiesOfUnion<EventBody>;

type UnionToIntersection<U> =
	(U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never

type A<E extends EventName, O> = Partial<O extends EventNameBody<E> ? O : never>;
const a: A<EventName, EventBody> = {};

export type BodyFilter<E extends EventName = EventName, B = EventBody & CorrelationIdBody> = Partial<B extends EventNameBody<E> ? B : never>;

export type BodyFilterWithEvent = Partial<EventBody> & EventBody;

export type EventCallback = (body: EventBody, corrId: CorrelationIdType) => void;

export type EmittedEventDescriptor = CorrelationIdBody;

export type EmitOptions = {
	correlationId?: CorrelationIdType;
	ignoreCallback?: EventCallback;
}

export interface IEventBus {
	on<E extends EventName>(callback: EventCallback, filter?: BodyFilter<E>): void;

	once<E extends EventName>(callback: EventCallback, filter?: BodyFilter<E>): void;

	wait<E extends EventName>(filter?: BodyFilter<E>): Promise<EventBody>;

	emit(body: EventBody, options: EmitOptions): EmittedEventDescriptor;

	removeListener(callback: EventCallback): void;
}