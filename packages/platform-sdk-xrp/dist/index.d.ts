import { ServiceProvider } from "./coin.provider";
export declare const XRP: {
	dataTransferObjects: {
		SignedTransactionData: typeof import("./signed-transaction.dto").SignedTransactionData;
		TransactionData: typeof import("./transaction.dto").TransactionData;
		TransferData: typeof import("./transfer.dto").TransferData;
		WalletData: typeof import("./wallet.dto").WalletData;
	};
	manifest: {
		name: string;
		networks: {
			"xrp.mainnet": import("@arkecosystem/platform-sdk/dist/networks").NetworkManifest;
			"xrp.testnet": import("@arkecosystem/platform-sdk/dist/networks").NetworkManifest;
		};
	};
	schema: import("joi").ObjectSchema<any>;
	ServiceProvider: typeof ServiceProvider;
};
