import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { AddressService } from "./address.service";

let subject: AddressService;

beforeEach(async () => {
	subject = await createService(AddressService);
});

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		await expect(subject.fromMnemonic(identity.mnemonic)).resolves.toEqual({
			type: "bip44",
			address: identity.address,
		});
	});

	it("should fail to generate an output from a privateKey", async () => {
		await expect(subject.fromPrivateKey(identity.privateKey)).resolves.toEqual({
			type: "bip44",
			address: identity.address,
		});
	});

	it("should generate an output from a publicKey", async () => {
		await expect(subject.fromPublicKey(identity.publicKey)).resolves.toEqual({
			type: "bip44",
			address: identity.address,
		});
	});

	it("should validate an address", async () => {
		await expect(subject.validate(identity.address)).resolves.toBeTrue();
	});
});
