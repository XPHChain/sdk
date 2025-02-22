import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "atom.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Cosmos",
	currency: {
		ticker: "ATOM",
		symbol: "ATOM",
		decimals: 6,
	},
	constants: {
		slip44: 118,
		bech32: "cosmos",
	},
	hosts: [
		{
			type: "full",
			host: "https://node.atomscan.com",
		},
		{
			type: "explorer",
			host: "https://stake.id",
		},
	],
	transactions,
	importMethods,
	featureFlags,
	explorer,
	meta: {
		// @TODO
		networkId: "cosmoshub-3",
	},
};

export default network;
