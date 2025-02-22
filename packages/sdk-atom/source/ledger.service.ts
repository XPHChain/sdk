import { IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/cryptography";
import Cosmos from "ledger-cosmos-js";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;
	#transport!: Cosmos;

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

		this.#transport = new Cosmos.default(this.#ledger);
	}

	@IoC.preDestroy()
	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public override async getVersion(): Promise<string> {
		const res = await this.#transport.getVersion();

		return `${res.major}.${res.minor}.${res.patch}`;
	}

	public override async getPublicKey(path: string): Promise<string> {
		const pathArray: number[] = Object.values(BIP44.parse(path));
		const { compressed_pk } = await this.#transport.publicKey(pathArray);

		return compressed_pk.toString("hex");
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		const pathArray: number[] = Object.values(BIP44.parse(path));
		const { signature } = await this.#transport.sign(pathArray, payload.toString());

		return signature.toString("hex");
	}
}
