import { Arr } from "@payvo/helpers";
import { BigNumber, NumberLike } from "@payvo/helpers";
import { ConfigRepository } from "./coins";
import { NetworkHost, NetworkHostType } from "./networks";

export const filterHosts = (hosts: NetworkHost[], type: NetworkHostType): NetworkHost[] =>
	hosts.filter((host: NetworkHost) => host.type === type);

export const randomHost = (hosts: NetworkHost[], type: NetworkHostType): NetworkHost =>
	Arr.randomElement(filterHosts(hosts, type));

// DRY helpers for coin implementations
export const filterHostsFromConfig = (config: ConfigRepository, type: NetworkHostType): NetworkHost[] =>
	filterHosts(config.get<NetworkHost[]>("network.hosts"), type);

export const randomNetworkHostFromConfig = (config: ConfigRepository, type: NetworkHostType = "full"): NetworkHost =>
	randomHost(config.get<NetworkHost[]>("network.hosts"), type);

export const randomHostFromConfig = (config: ConfigRepository, type: NetworkHostType = "full"): string =>
	randomNetworkHostFromConfig(config, type).host;

export const pluckAddress = (query): string => {
	if (query.senderId) {
		return query.senderId;
	}

	if (query.recipientId) {
		return query.recipientId;
	}

	if (Array.isArray(query.identifiers) && query.identifiers[0]) {
		return query.identifiers[0].value;
	}

	throw new Error("Failed to pluck any address.");
};
