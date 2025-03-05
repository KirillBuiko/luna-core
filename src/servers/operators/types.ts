import type {CorrelationIdType, EventBody, EventMap, EventName} from "@/event-bus/IEventBus";

export type SocketEventMap = {[event in keyof EventMap]: (body: EventBody, corrId: CorrelationIdType) => void}