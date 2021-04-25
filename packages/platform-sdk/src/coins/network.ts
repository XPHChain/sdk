import { get } from "dot-prop";

import { CoinNetwork, ExpirationType } from "./network.models";

export class Network {
	/**
	 * Specifications about the network.
	 *
	 * @memberof Network
	 */
	readonly #coin: string;

	/**
	 * List of feature flags that are supported.
	 *
	 * @memberof Network
	 */
	readonly #network: CoinNetwork;

	/**
	 * Create a new Network instance.
	 *
	 * @param coin
	 * @param network
	 */
	public constructor(coin: string, network: CoinNetwork) {
		this.#coin = coin;
		this.#network = network;
	}

	/**
	 * Get the coin of the network.
	 */
	public coin(): string {
		return this.#network.coin;
	}

	/**
	 * Get the ID of the network.
	 */
	public id(): string {
		return this.#network.id;
	}

	/**
	 * Get the name of the network.
	 */
	public name(): string {
		return this.#network.name;
	}

	/**
	 * Get the explorer URL of the coin that is used.
	 */
	public explorer(): string {
		return this.#network.explorer;
	}

	/**
	 * Get the ticker of the coin that is used.
	 */
	public ticker(): string {
		return this.#network.currency.ticker;
	}

	/**
	 * Get the symbol of the coin that is used.
	 */
	public symbol(): string {
		return this.#network.currency.symbol;
	}

	/**
	 * Determine if this is a production network.
	 */
	public isLive(): boolean {
		return this.#network.type === "live";
	}

	/**
	 * Determine if this is a development network.
	 */
	public isTest(): boolean {
		return this.#network.type === "test";
	}

	/**
	 * Get the expiration method type.
	 */
	public expirationType(): ExpirationType {
		return this.#network.crypto.expirationType;
	}

	/**
	 * Determine if voting is supported on this network.
	 */
	public allowsVoting(): boolean {
		return this.#network.governance?.voting?.enabled || false;
	}

	/**
	 * Get the number of delegates that forge blocks.
	 */
	public delegateCount(): number {
		return this.#network.governance?.voting?.delegateCount || 0;
	}

	/**
	 * Get the maximum number of votes per wallet.
	 */
	public maximumVotesPerWallet(): number {
		return this.#network.governance?.voting?.maximumPerWallet || 0;
	}

	/**
	 * Get the maximum number of votes per transaction.
	 */
	public maximumVotesPerTransaction(): number {
		return this.#network.governance?.voting?.maximumPerTransaction || 0;
	}

	/**
	 * Determine if the given feature is enabled.
	 *
	 * @param feature
	 */
	public can(feature: string): boolean {
		return get(this.#network.featureFlags, feature) === true;
	}

	/**
	 * Determine if the given feature is disabled.
	 *
	 * @param feature
	 */
	public cannot(feature: string): boolean {
		return !this.can(feature);
	}

	/**
	 * Determine if the given feature is enabled and throw an exception if it isn't.
	 *
	 * This method should be used to safe guard sections of code from executing if a feature flag isn't enabled.
	 *
	 * @param feature
	 */
	public accessible(feature: string): void {
		if (this.cannot(feature)) {
			throw new Error(`The [${feature}] feature flag is not accessible.`);
		}
	}

	/**
	 * Return the object representation of the network.
	 */
	public toObject(): CoinNetwork {
		return this.#network;
	}

	/**
	 * Return the JSON representation of the network.
	 */
	public toJson(): string {
		return JSON.stringify(this.toObject());
	}
}
