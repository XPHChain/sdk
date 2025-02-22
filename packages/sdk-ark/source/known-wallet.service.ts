import { Coins, Http, IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class KnownWalletService extends Services.AbstractKnownWalletService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(IoC.BindingType.HttpClient)
	private readonly httpClient!: Http.HttpClient;

	#source: string | undefined;

	public override async all(): Promise<Services.KnownWallet[]> {
		if (!this.#source) {
			return [];
		}

		try {
			const results = (await this.httpClient.get(this.#source)).json();

			if (Array.isArray(results)) {
				return results;
			}

			return [];
		} catch {
			return [];
		}
	}

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#source = this.configRepository.getLoose<string>(Coins.ConfigKey.KnownWallets);
	}
}
