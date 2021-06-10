"use strict";
var __decorate =
	(this && this.__decorate) ||
	function (decorators, target, key, desc) {
		var c = arguments.length,
			r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
			d;
		if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
			r = Reflect.decorate(decorators, target, key, desc);
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
		return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicKeyService = void 0;
const platform_sdk_1 = require("@arkecosystem/platform-sdk");
const key_pair_service_1 = require("./key-pair.service");
let PublicKeyService = class PublicKeyService extends platform_sdk_1.Services.AbstractPublicKeyService {
	async fromMnemonic(mnemonic, options) {
		try {
			return {
				publicKey: (await new key_pair_service_1.KeyPairService().fromMnemonic(mnemonic, options)).publicKey,
			};
		} catch (error) {
			throw new platform_sdk_1.Exceptions.CryptoException(error);
		}
	}
};
PublicKeyService = __decorate([platform_sdk_1.IoC.injectable()], PublicKeyService);
exports.PublicKeyService = PublicKeyService;
//# sourceMappingURL=public-key.service.js.map
