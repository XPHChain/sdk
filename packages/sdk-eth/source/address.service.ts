import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";
import { Buffoon } from "@payvo/cryptography";
import Wallet from "ethereumjs-wallet";
import web3 from "web3";

import { createWallet, getAddress } from "./utils";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: getAddress(
				createWallet(
					mnemonic,
					this.configRepository.get(Coins.ConfigKey.Slip44),
					options?.bip44?.account || 0,
					options?.bip44?.change || 0,
					options?.bip44?.addressIndex || 0,
				),
			),
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			// @ts-ignore
			address: getAddress(new Wallet.default(undefined, Buffoon.fromHex(publicKey))),
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			// @ts-ignore
			address: getAddress(new Wallet.default(Buffoon.fromHex(privateKey))),
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return web3.utils.isAddress(address);
	}
}
