import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "avax.testnet",
	type: "test",
	name: "Testnet",
	coin: "Avalanche",
	currency: {
		ticker: "AVAX",
		symbol: "AVAX",
		decimals: 9,
	},
	constants: {
		slip44: 9000,
	},
	governance: {
		method: "transfer",
		delegateCount: 0, // @TODO
		votesPerWallet: 1,
		votesPerTransaction: 1,
	},
	hosts: [
		{
			type: "full",
			host: "https://api.avax-test.network",
		},
		{
			type: "archival",
			host: "https://avax-test.payvo.com",
		},
		{
			type: "explorer",
			host: "https://explorer.avax-test.network",
		},
	],
	transactions: {
		...transactions,
		fees: {
			type: "static",
			ticker: "AVAX",
		},
	},
	importMethods,
	featureFlags,
	explorer,
	meta: {
		// @TODO
		networkId: "5",
		blockchainId: "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm",
		assetId: "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
	},
};

export default network;
