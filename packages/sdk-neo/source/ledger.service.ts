import { IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/cryptography";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;
	#bip44SessionPath = "";

	public override async connect(transport: Services.LedgerTransport): Promise<void> {
		try {
			this.#ledger = await transport.create();
		} catch (error) {
			if (transport.constructor.name === "TransportReplayer") {
				this.#ledger = transport;
			} else {
				throw error;
			}
		}
	}

	@IoC.preDestroy()
	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public override async getVersion(): Promise<string> {
		const result = await this.#ledger.send(0xb0, 0x01, 0x00, 0x00);

		return result.toString("utf-8").match(new RegExp("([0-9].[0-9].[0-9])", "g")).toString();
	}

	public override async getPublicKey(path: string): Promise<string> {
		this.#bip44SessionPath = path;
		const result = await this.#ledger.send(0x80, 0x04, 0x00, 0x00, this.#neoBIP44(path));

		return result.toString("hex").substring(0, 130);
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		if (this.#bip44SessionPath != path || this.#bip44SessionPath.length == 0) {
			throw new Error(
				`Bip44 Path [${path}] must match the session path [${
					this.#bip44SessionPath
				}] stored during 'getPublicKey' .`,
			);
		}

		const signature = await this.#neoSignTransaction(this.#ledger, path, payload);

		return signature;
	}

	/**
	 * Neo-like Bip44 Parsing
	 * modified from:
	 * - https://github.com/CityOfZion/neon-js/blob/master/packages/neon-ledger/source/BIP44.ts
	 */
	#neoBIP44(path: string): Buffer {
		const parsedPath = BIP44.parse(path);
		const accountHex = this.#to8BitHex(parsedPath.account + 0x80000000);
		const changeHex = this.#to8BitHex(parsedPath.change);
		const addressHex = this.#to8BitHex(parsedPath.addressIndex);

		return Buffer.from("8000002C" + "80000378" + accountHex + changeHex + addressHex, "hex");
	}

	/**
	 * Neo-like Bip44 Element to8BitHex
	 * modified from:
	 * - https://github.com/CityOfZion/neon-js/blob/master/packages/neon-ledger/source/BIP44.ts
	 */
	#to8BitHex(num: number): string {
		const hex = num.toString(16);
		return "0".repeat(8 - hex.length) + hex;
	}

	/**
	 * Neo-like Transaction Signing
	 * modified from:
	 * - https://github.com/CityOfZion/neon-js/blob/master/packages/neon-ledger/source/main.ts.ts
	 */
	async #neoSignTransaction(transport: Services.LedgerTransport, path: string, payload: Buffer): Promise<string> {
		const chunks: string[] = payload.toString().match(/.{1,510}/g) || [];

		for (let i = 0; i < chunks.length - 1; i++) {
			await this.#ledger.send(0x80, 0x02, 0x00, 0x00, Buffer.from(chunks[i], "hex"));
		}

		const result = await this.#ledger.send(0x80, 0x02, 0x80, 0x00, Buffer.from(chunks[chunks.length - 1], "hex"));

		return result.toString("hex").match(new RegExp(".*[^9000]", "g")).toString();
	}
}
