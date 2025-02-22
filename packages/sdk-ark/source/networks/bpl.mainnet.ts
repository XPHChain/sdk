import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "bpl.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Blockpool",
	currency: {
		ticker: "BPL",
		symbol: "β",
		decimals: 8,
	},
	constants: {
		slip44: 111,
	},
	hosts: [
		{
			type: "full",
			host: "http://explorer.blockpool.io:9031/api",
		},
		{
			type: "explorer",
			host: "https://explorer.blockpool.io/",
		},
	],
	governance: {
		method: "split",
		delegateCount: 201,
		votesPerWallet: 1,
		votesPerTransaction: 1,
	},
	transactions: {
		...transactions,
		fees: {
			type: "dynamic",
			ticker: "BPL",
		},
		multiPaymentRecipients: 128,
	},
	importMethods,
	featureFlags: {
		...featureFlags,
		Transaction: [
			"delegateRegistration",
			"delegateResignation",
			"estimateExpiration",
			"multiPayment",
			"secondSignature",
			"transfer",
			"vote",
		],
	},
	explorer: {
		block: "#/block/{0}",
		transaction: "#/transaction/{0}",
		wallet: "#/wallets/{0}",
	},
	meta: {
		fastDelegateSync: true,
	},
};

export default network;
