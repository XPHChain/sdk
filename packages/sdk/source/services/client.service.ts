/* istanbul ignore file */

import { ConfigRepository } from "../coins";
import { ConfirmedTransactionDataCollection, WalletDataCollection } from "../collections";
import { KeyValuePair, SignedTransactionData, WalletData } from "../contracts";
import { ConfirmedTransactionData } from "../dto/confirmed-transaction.contract";
import { NotImplemented } from "../exceptions";
import { HttpClient } from "../http";
import { inject } from "../ioc";
import { BindingType } from "../ioc/service-provider.contract";
import {
	BroadcastResponse,
	ClientService,
	ClientTransactionsInput,
	ClientWalletsInput,
	TransactionDetailInput,
	UnlockTokenResponse,
	VoteReport,
	WalletIdentifier,
} from "./client.contract";
import { DataTransferObjectService } from "./data-transfer-object.contract";

export class AbstractClientService implements ClientService {
	@inject(BindingType.ConfigRepository)
	protected readonly configRepository!: ConfigRepository;

	@inject(BindingType.DataTransferObjectService)
	protected readonly dataTransferObjectService!: DataTransferObjectService;

	@inject(BindingType.HttpClient)
	protected readonly httpClient!: HttpClient;

	public async transaction(id: string, input?: TransactionDetailInput): Promise<ConfirmedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.transaction.name);
	}

	public async transactions(query: ClientTransactionsInput): Promise<ConfirmedTransactionDataCollection> {
		throw new NotImplemented(this.constructor.name, this.transactions.name);
	}

	public async wallet(id: WalletIdentifier): Promise<WalletData> {
		throw new NotImplemented(this.constructor.name, this.wallet.name);
	}

	public async wallets(query: ClientWalletsInput): Promise<WalletDataCollection> {
		throw new NotImplemented(this.constructor.name, this.wallets.name);
	}

	public async delegate(id: string): Promise<WalletData> {
		throw new NotImplemented(this.constructor.name, this.delegate.name);
	}

	public async delegates(query?: KeyValuePair): Promise<WalletDataCollection> {
		throw new NotImplemented(this.constructor.name, this.delegates.name);
	}

	public async votes(id: string): Promise<VoteReport> {
		throw new NotImplemented(this.constructor.name, this.votes.name);
	}

	public async voters(id: string, query?: KeyValuePair): Promise<WalletDataCollection> {
		throw new NotImplemented(this.constructor.name, this.voters.name);
	}

	public async unlockableBalances(id: string): Promise<UnlockTokenResponse> {
		throw new NotImplemented(this.constructor.name, this.unlockableBalances.name);
	}

	public async broadcast(transactions: SignedTransactionData[]): Promise<BroadcastResponse> {
		throw new NotImplemented(this.constructor.name, this.broadcast.name);
	}
}
