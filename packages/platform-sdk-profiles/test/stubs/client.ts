import { Contracts } from "@arkecosystem/platform-sdk";
import got from "got";

export class HttpClient implements Contracts.HttpClient {
	public async get(path: string, searchParams = {}): Promise<Contracts.HttpClientResponse> {
		return got.get(path, { searchParams, timeout: 1000 }).json();
	}

	public async post(path: string, body, headers = {}): Promise<Contracts.HttpClientResponse> {
		return got.post(path, { body: JSON.stringify(body), headers, timeout: 1000 }).json();
	}
}
