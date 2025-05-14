import type {IEndpointsManager} from "@/request-manager/types/IEndpointsManager";
import type {EndpointConfigsType, EndpointGroup} from "@/app/types/RemoteStaticEndpointConfigType";
import {endpointConstructors} from "./index";
import type {IEndpoint} from "@/request-manager/types/IEndpoint";
import {coreLogger} from "@/app/main";

export class EndpointsManager implements IEndpointsManager {
	endpoints: Map<string, IEndpoint> = new Map();

	getEndpoint(endpointId: string) {
		return this.endpoints.get(endpointId);
	}

	getEndpointsByGroup(endpointGroup: EndpointGroup): string[] {
		return Array.from(this.endpoints.entries()).reduce<string[]>((ids, [endpointId, endpoint]) => {
			endpoint.config.group === endpointGroup && ids.push(endpointId);
			return ids;
		}, []);
	}

	getAllEndpoints(): { [id: string]: IEndpoint } {
		return Array.from(this.endpoints.entries()).reduce((endpoints, [endpointId, endpoint]) => {
			endpoints[endpointId] = endpoint;
			return endpoints;
		}, {} as { [id: string]: IEndpoint });
	}

	async initAll(configs: EndpointConfigsType) {
		await coreLogger.info("Endpoints are initiating");
		const promises = configs.map(async config => {
			const endpoint = new endpointConstructors[config.name];
			this.endpoints.set(config.id, endpoint);
			const err = await endpoint.init(config);
			if (err) {
				await coreLogger.error(`The endpoint "${config.name}" init attempt failed with error: ${err.message}`);
			} else {
				await coreLogger.info(`The endpoint "${config.name}" connected to host ${config.host}`);
			}
		});
		await Promise.allSettled(promises);
		await coreLogger.info("Endpoints init finished");
	}
}
