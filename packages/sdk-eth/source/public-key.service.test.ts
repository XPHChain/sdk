import "jest-extended";

import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";
import { PublicKeyService } from "./public-key.service";

let subject: PublicKeyService;

beforeEach(async () => {
	subject = await createService(PublicKeyService, undefined, (container: IoC.Container) => {
		container.singleton(IoC.BindingType.PrivateKeyService, PrivateKeyService);
	});
});

describe("PublicKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ publicKey: identity.publicKey });
	});
});
