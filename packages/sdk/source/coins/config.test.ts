import "jest-extended";

import { ConfigKey, ConfigRepository } from "./config";

let subject: ConfigRepository;

beforeEach(async () => {
	subject = new ConfigRepository({
		network: "ark.mainnet",
	});
});

test("#constructor", () => {
	expect(
		() =>
			new ConfigRepository({
				network: 123,
			}),
	).toThrow('Failed to validate the configuration: "network" must be a string');
});

test("#all", () => {
	expect(subject.all()).toMatchInlineSnapshot(`
		Object {
		  "network": "ark.mainnet",
		}
	`);
});

test("#get | #set", () => {
	expect(subject.get("network")).toBe("ark.mainnet");

	subject.set("network", "ark.devnet");

	expect(subject.get("network")).toBe("ark.devnet");

	expect(() => subject.get("key")).toThrow("The [key] is an unknown configuration value.");
});

test("#getLoose", () => {
	expect(() => subject.getLoose("hello.world")).not.toThrow("The [key] is an unknown configuration value.");
});

test("#has", () => {
	expect(subject.has("key")).toBeFalse();

	subject.set("key", "value");

	expect(subject.has("key")).toBeTrue();
});

test("#missing", () => {
	expect(subject.missing("key")).toBeTrue();

	subject.set("key", "value");

	expect(subject.missing("key")).toBeFalse();
});

test("#forget", () => {
	expect(subject.missing("key")).toBeTrue();

	subject.set("key", "value");

	expect(subject.missing("key")).toBeFalse();

	subject.forget("key");

	expect(subject.missing("key")).toBeTrue();
});

test("ConfigKey", () => {
	expect(ConfigKey).toMatchInlineSnapshot(`
		Object {
		  "Bech32": "network.constants.bech32",
		  "CurrencyDecimals": "network.currency.decimals",
		  "CurrencyTicker": "network.currency.ticker",
		  "HttpClient": "httpClient",
		  "KnownWallets": "network.knownWallets",
		  "Network": "network",
		  "NetworkId": "network.id",
		  "NetworkType": "network.type",
		  "Slip44": "network.constants.slip44",
		}
	`);
});
