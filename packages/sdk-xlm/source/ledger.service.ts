import { IoC, Services } from "@payvo/sdk";
import Stellar from "@ledgerhq/hw-app-str";

@IoC.injectable()
export class LedgerService extends Services.AbstractLedgerService {
	#ledger: Services.LedgerTransport;
	#transport!: Stellar;

	public override async connect(transport: Services.LedgerTransport): Promise<void> {
		try {
			this.#ledger = await transport.open();
		} catch (error) {
			if (transport.constructor.name === "TransportReplayer") {
				this.#ledger = transport;
			} else {
				throw error;
			}
		}

		// @ts-ignore
		this.#transport = new Stellar.default(this.#ledger);
	}

	@IoC.preDestroy()
	public override async disconnect(): Promise<void> {
		await this.#ledger.close();
	}

	public override async getVersion(): Promise<string> {
		const { version } = await this.#transport.getAppConfiguration();

		return version;
	}

	public override async getPublicKey(path: string): Promise<string> {
		const { publicKey } = await this.#transport.getPublicKey(path, true, true);

		return publicKey;
	}

	public override async signTransaction(path: string, payload: Buffer): Promise<string> {
		const { signature } = await this.#transport.signTransaction(path, payload);

		return signature.toString("hex");
	}
}
