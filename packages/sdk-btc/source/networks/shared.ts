import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	types: ["transfer"],
	fees: {
		type: "dynamic",
		ticker: "BTC",
	},
	utxo: true,
};

export const importMethods: Networks.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip38: {
		default: false,
		permissions: ["read", "write"],
	},
	discovery: {
		default: true,
		permissions: ["read", "write"],
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
	privateKey: {
		default: false,
		permissions: ["read", "write"],
	},
	wif: {
		default: false,
		permissions: ["read", "write"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	Address: [
		"mnemonic.bip39",
		"mnemonic.bip44",
		"mnemonic.bip49",
		"mnemonic.bip84",
		"privateKey",
		"publicKey",
		"validate",
		"wif",
	],
	KeyPair: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84", "privateKey", "wif"],
	PrivateKey: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84", "wif"],
	PublicKey: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84", "wif"],
	WIF: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84"],
	Message: ["sign", "verify"],
	Transaction: ["transfer"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "block/{0}",
	transaction: "tx/{0}",
	wallet: "address/{0}",
};
