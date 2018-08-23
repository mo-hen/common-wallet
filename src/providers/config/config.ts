import { Injectable } from "@angular/core";
import { Logger } from "../logger/logger";
import { statusType, configType, settingType, walletType, assetType } from "../types/types";

const statusDefault: statusType = {
    agree: true,
    isLock: false
};

const configDefault: configType = {
    restAPI: "https://beta.itoken.top/api/v1",
    restAPI_dev: "https://beta.itoken.top/api/v1",
    assetAPI: "https://itoken.top/token/query-token-detal.htm",
    assetAPI_dev: "https://beta.itoken.top//v1/token/query-token-detal",
    rateUrl: "https://api.coinmarketcap.com/v2/ticker/2701/?convert=CNY",
    miniAppUrl: "https://getman.cn/mock",
    miniAppUrl_dev: "https://getman.cn/mock",
    downloadUrl: "https://",
    releaseUrl: "https://",
    network: "testnet",
    log: {
        weight: 3
    }
};

const settingDefault: settingType = {
    language: null,
    currency: "USD"
};

const walletDefault: walletType = {
    walletId: null,
    mnemonic: null,
    privkey: null,
    privkeyEncrypted: null,
    pubkey: null,
    addressPubkey: null,
    address: null
};

const assetDefault: assetType = {
    TTT: {
        assetId: null,
        issuer: "TrustNote",
        balance: 0
    }
};

@Injectable()
export class ConfigProvider {
    constructor(private logger: Logger) {
        this.logger.info("ConfigProvider initialized.");
    }

    get statusDefault() {
        return statusDefault;
    }

    get configDefault() {
        return configDefault;
    }

    get settingDefault() {
        return settingDefault;
    }

    get walletDefault() {
        return walletDefault;
    }

    get assetDefault() {
        return assetDefault;
    }
}
