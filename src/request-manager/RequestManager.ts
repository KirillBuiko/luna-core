import type {RequestType_Strict} from "@grpc-build/RequestType";
import type {
	SourceOptionsType
} from "@/types/general";
import type {RequestRouter, RouterResult} from "@/request-manager/routers/RequestRouter";
import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {IRequestManager} from "@/request-manager/types/IRequestManager";
import type {GetInfo} from "@grpc-build/GetInfo";
import type {DataInfo} from "@grpc-build/DataInfo";
import {PipeBuilder} from "@/pipe-builder/PipeBuilder";
import {PipeErrorHandler} from "@/pipe-builder/PipeErrorHandler";
import {ErrorMessage} from "@/utils/ErrorMessage";
import {DefaultRouter} from "@/request-manager/routers/DefaultRouter";
import type {IPipeBuilder} from "@/request-manager/types/IPipeBuilder";
import {ErrorDto} from "@/endpoints/ErrorDto";
import {coreLogger} from "@/app/main";
import {OperatorsRouter} from "@/request-manager/routers/OperatorsRouter";
import type {IEventBus} from "@/event-bus/IEventBus";
import {Readable} from "node:stream";

export class RequestManager implements IRequestManager {
	defaultRouter: RequestRouter;
	operatorsRouter: RequestRouter;
	pipeBuilder: IPipeBuilder = new PipeBuilder();

	constructor(private deps: { endpointsManager: IEndpointsManager, eventBus: IEventBus }) {
		this.defaultRouter = new DefaultRouter({...deps});
		this.operatorsRouter = new OperatorsRouter({...deps});
	}

	private async getRoutersResult(sourceOptions: SourceOptionsType, info: GetInfo | DataInfo): Promise<RouterResult | null> {
		if (info.endpointId) {
			await coreLogger.info("Endpoint fixed: ", info.endpointId);
			return {
				endpointId: info.endpointId
			};
		}
		try {
			const params = (() => {
				if (sourceOptions.requestName === "GET") {
					const castedInfo = (info as GetInfo);
					const getInfo = castedInfo.infoType && castedInfo[castedInfo.infoType];
					return (getInfo && typeof getInfo === "object") ? getInfo : undefined;
				} else {
					const castedInfo = (info as DataInfo);
					const dataValue = castedInfo.dataValueType && castedInfo[castedInfo.dataValueType];
					const getInfo = dataValue && "getInfo" in dataValue && dataValue.getInfo;
					return (getInfo && typeof getInfo === "object") ? getInfo : undefined;
				}
			})() as Record<string, string>;
			const result = await this.operatorsRouter.getRouterResult(info.requestType as RequestType_Strict, sourceOptions.requestName, params);
			await coreLogger.info("Endpoint resolved by operator");
			return result;
		} catch (e) {
			// TODO: add endpoint search error handling
		}
		try {
			const result = await this.defaultRouter.getRouterResult(info.requestType as RequestType_Strict, sourceOptions.requestName);
			await coreLogger.info("Endpoint resolved by default router");
			return result;
		} catch (e) {
			// TODO: add endpoint search error handling
		}

		return null;
	}

	async register(sourceOptions: SourceOptionsType, info: GetInfo | DataInfo) {
		const result = await this.getRoutersResult(sourceOptions, info);
		if (result?.buffer) {
			await coreLogger.info("Request resolving result: ", result.buffer.toString());
		} else {
			await coreLogger.info("Request resolving result: ", result);
		}

		const endpoint = result?.endpointId ? this.deps.endpointsManager.getEndpoint(result.endpointId) : null;

		if (!result || (result.endpointId && !endpoint)) {
			(new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
				ErrorMessage.create(
					new ErrorDto("not-supported", "Couldn't find endpoint for request")));
			return;
		}

		if (result.endpointId && endpoint) {
			try {
				const destOptions = endpoint.createSendHandler(sourceOptions.requestName, info);
				this.pipeBuilder.buildPipe(sourceOptions, destOptions);
			} catch (e) {
				await coreLogger.info(`Failed to ${sourceOptions.requestName} ` +
					`${info.requestType} from ${sourceOptions.protocol} to ${endpoint.config.name}:`,e);
				(new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
					ErrorMessage.create(e));

			}
		} else if (result.buffer && sourceOptions.requestName === "GET") {
			try {
				this.pipeBuilder.buildPipe(sourceOptions, {
					protocol: "REST_API",
					requestName: sourceOptions.requestName,
					destReader: Promise.resolve({
						info: {
							requestType: info.requestType,
							dataType: "BYTES"
						},
						data: Readable.from(result.buffer)
					})
				});
			} catch (e) {
				await coreLogger.info(`Failed to ${sourceOptions.requestName} ` +
					`${info.requestType} from ${sourceOptions.protocol} to Buffer:`,e);
				(new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
					ErrorMessage.create(e));
			}
		} else {
			(new PipeErrorHandler()).sourceErrorEmit(sourceOptions,
				new ErrorDto("unknown", "Request manager did nothing, no router result"));
		}
	}
}
