import "jest-extended";

import { jest } from "@jest/globals";
import { Address } from "@arkecosystem/crypto-identities";
import { IoC, Services } from "@payvo/sdk";
import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import nock from "nock";

import { ledger } from "../test/fixtures/ledger";
import { createService, require } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

const createMockService = async (record: string): Promise<LedgerService> => {
	const transport = await createService(LedgerService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});

	const fromString = RecordStore.fromString(record);
	await transport.connect(await openTransportReplayer(fromString));

	return transport;
};

describe("disconnect", () => {
	it("should pass with a resolved transport closure", async () => {
		const ark = await createMockService("");

		await expect(ark.disconnect()).resolves.toBeUndefined();
	});
});

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const ark = await createMockService(ledger.appVersion.record);

		await expect(ark.getVersion()).resolves.toEqual(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const ark = await createMockService(ledger.publicKey.record);

		await expect(ark.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
	});
});

describe("getExtendedPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const ark = await createMockService(ledger.publicKey.record);

		await expect(ark.getExtendedPublicKey(ledger.bip44.path)).rejects.toThrow();
	});
});

describe("signTransaction", () => {
	it("should pass with a schnorr signature", async () => {
		const ark = await createMockService(ledger.transaction.schnorr.record);

		await expect(
			ark.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.schnorr.payload, "hex")),
		).resolves.toEqual(ledger.transaction.schnorr.result);
	});
});

describe("signMessage", () => {
	it("should pass with a schnorr signature", async () => {
		const ark = await createMockService(ledger.message.schnorr.record);

		await expect(
			ark.signMessage(ledger.bip44.path, Buffer.from(ledger.message.schnorr.payload, "hex")),
		).resolves.toEqual(ledger.message.schnorr.result);
	});
});

describe("scan", () => {
	afterEach(() => nock.cleanAll());

	beforeAll(() => nock.disableNetConnect());

	it("should scan for legacy wallets", async () => {
		nock(/.+/)
			.get(
				"/api/wallets?address=D9xJncW4ECUSJQWeLP7wncxhDTvNeg2HNK%2CDFgggtreMXQNQKnxHddvkaPHcQbRdK3jyJ%2CDFr1CR81idSmfgQ19KXe4M6keqUEAuU8kF%2CDTYiNbvTKveMtJC8KPPdBrgRWxfPxGp1WV%2CDJyGFrZv4MYKrTMcjzEyhZzdTAJju2Rcjr",
			)
			.reply(200, await require(`../test/fixtures/client/wallets-page-0.json`))
			.get(
				"/api/wallets?address=DHnV81YdhYDkwCLD8pkxiXh53pGFw435GS%2CDGhLzafzQpBYjDAWP41U4cx5CKZ5BdSnS3%2CDLVXZyKFxLLdyuEtJRUvFoKcorSrnBnq48%2CDFZAfJ1i1LsvhkUk76Piw4v7oTgq12pX9Z%2CDGfNF9bGPss6YKLEqK5gwr4C1M7vgfenzn",
			)
			.reply(200, await require(`../test/fixtures/client/wallets-page-1.json`));

		const ark = await createMockService(ledger.wallets.record);

		const walletData = await ark.scan({ useLegacy: true });
		expect(Object.keys(walletData)).toHaveLength(2);
		expect(walletData).toMatchSnapshot();

		for (const wallet of Object.values(walletData) as any) {
			const publicKey: string | undefined = wallet.publicKey();

			if (publicKey) {
				expect(Address.fromPublicKey(publicKey, { pubKeyHash: 30 })).toBe(wallet.address());
			}

			expect(wallet.toObject()).toMatchSnapshot();
		}
	});

	it("should scan for new wallets", async () => {
		nock(/.+/)
			.get("/api/wallets")
			.query(true)
			.reply(200, await require(`../test/fixtures/client/wallets-page-0.json`))
			.get("/api/wallets")
			.query(true)
			.reply(200, await require(`../test/fixtures/client/wallets-page-1.json`));

		const ark = await createMockService(ledger.wallets.record);

		jest.spyOn(ark, "getExtendedPublicKey").mockResolvedValue(
			"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
		);

		const walletData = await ark.scan({ useLegacy: false, startPath: "m/44'/0'/0'/0/0" });
		expect(Object.keys(walletData)).toHaveLength(1);
		expect(walletData).toMatchSnapshot();

		for (const wallet of Object.values(walletData) as any) {
			const publicKey: string | undefined = wallet.publicKey();

			if (publicKey) {
				expect(Address.fromPublicKey(publicKey, { pubKeyHash: 30 })).toBe(wallet.address());
			}

			expect(wallet.toObject()).toMatchSnapshot();
		}
	});
});

test("#isNanoS", async () => {
	const subject = await createMockService(ledger.message.schnorr.record);

	await expect(subject.isNanoS()).resolves.toBeBoolean();
});

test("#isNanoX", async () => {
	const subject = await createMockService(ledger.message.schnorr.record);

	await expect(subject.isNanoX()).resolves.toBeBoolean();
});
