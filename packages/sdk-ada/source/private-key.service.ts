import { Exceptions, IoC, Services } from "@payvo/sdk";

import { KeyPairService } from "./key-pair.service";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		const { privateKey } = await new KeyPairService().fromMnemonic(mnemonic);

		if (!privateKey) {
			throw new Error("Failed to derive the private key.");
		}

		return { privateKey };
	}
}
