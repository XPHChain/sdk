import "jest-extended";

import { Services } from "@payvo/sdk";

import { createService, require } from "../test/mocking";

let subject: Services.AbstractLinkService;

beforeAll(async () => {
	subject = await createService(Services.AbstractLinkService);
});

it("should generate a link for a block", async () => {
	expect(subject.block("id")).toMatchInlineSnapshot(`"https://eos-test.bloks.io/block/id"`);
});

it("should generate a link for a transaction", async () => {
	expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://eos-test.bloks.io/transaction/id"`);
});

it("should generate a link for a wallet", async () => {
	expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://eos-test.bloks.io/account/id"`);
});
