import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/cryptography";
import { secp256k1 } from "bcrypto";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		if (!child.privateKey) {
			throw new Error("Failed to derive private key.");
		}

		return {
			publicKey: secp256k1.publicKeyCreate(child.privateKey, true).toString("hex"),
			privateKey: child.privateKey.toString("hex"),
			path,
		};
	}
}
