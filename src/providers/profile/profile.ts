import { Injectable } from "@angular/core";
import { StorageProvider, StorageKeys } from "../storage/storage";
import {
    statusType,
    configType,
    settingType,
    walletType,
    assetType,
    resultType,
    historyType
} from "../types/types";
import { ResultProvider } from "../result/result";
import { ConfigProvider } from "../../providers/config/config";
import { Logger } from "../logger/logger";
import * as sjcl from "sjcl";

export interface Profile {
    status: statusType;
    config: configType;
    setting: settingType;
    wallet: walletType;
    asset: assetType;
    history: historyType;
}

@Injectable()
export class ProfileProvider {
    public profileTotal: Profile;

    constructor(
        private storage: StorageProvider,
        private config: ConfigProvider,
        private result: ResultProvider,
        private logger: Logger
    ) {
        this.profileTotal = {
            status: this.config.statusDefault,
            config: this.config.configDefault,
            setting: this.config.settingDefault,
            wallet: this.config.walletDefault,
            asset: this.config.assetDefault,
            history: {}
        };
    }

    public loadProfile(): Promise<Profile> {
        return new Promise((resolve, rejects) => {
            this.loadStatus()
                .then(status => {
                    if (status) {
                        this.profileTotal.status = status;
                    }
                    return this.loadWallet();
                })
                .then(wallet => {
                    if (wallet) {
                        this.profileTotal.wallet = wallet;
                    }
                    return this.loadConfig();
                })
                .then(config => {
                    if (config) {
                        this.profileTotal.config = config;
                    }
                    return this.loadSetting();
                })
                .then(setting => {
                    if (setting) {
                        this.profileTotal.setting = setting;
                    }
                    resolve(this.profileTotal);
                });
        });
    }

    public storeProfile(profile: Profile): Promise<any> {
        this.profileTotal = profile;
        return this.storeStatus(profile.status)
            .then(ret => {
                return this.storeConfig(profile.config);
            })
            .then(ret => {
                return this.storeSetting(profile.setting);
            })
            .then(ret => {
                return this.result.success(profile);
            });
    }

    loadWallet(): Promise<walletType> {
        return this.storage.get(StorageKeys.WALLET);
    }

    storeWallet(wallet: walletType): Promise<resultType> {
        this.profileTotal.wallet = wallet;
        return this.storage.set(StorageKeys.WALLET, wallet);
    }

    loadSetting(): Promise<settingType> {
        return this.storage.get(StorageKeys.SETTINGS);
    }

    storeSetting(setting: settingType): Promise<resultType> {
        this.profileTotal.setting = setting;
        return this.storage.set(StorageKeys.SETTINGS, setting);
    }

    loadConfig(): Promise<configType> {
        return this.storage.get(StorageKeys.CONFIG);
    }

    storeConfig(config: configType): Promise<resultType> {
        this.profileTotal.config = config;
        return this.storage.set(StorageKeys.CONFIG, config);
    }

    loadStatus(): Promise<statusType> {
        return this.storage.get(StorageKeys.STATUS);
    }

    storeStatus(status: statusType): Promise<resultType> {
        this.profileTotal.status = status;
        return this.storage.set(StorageKeys.STATUS, status);
    }

    loadAsset(): Promise<assetType> {
        return this.storage.get(StorageKeys.ASSET);
    }

    storeAsset(asset: assetType): Promise<resultType> {
        this.profileTotal.asset = asset;
        return this.storage.set(StorageKeys.ASSET, asset);
    }

    loadHistory(): Promise<historyType> {
        return this.storage.get(StorageKeys.HISTORY);
    }

    storeHistory(history: historyType): Promise<resultType> {
        this.profileTotal.history = history;
        return this.storage.set(StorageKeys.HISTORY, history);
    }

    lock(password: string): Promise<resultType> {
        return new Promise((resolve, rejects) => {
            if (this.profileTotal.status.isLock) {
                rejects(this.result.warn("Already is locked"));
            } else {
                try {
                    this.profileTotal.wallet.privkeyEncrypted = sjcl.encrypt(
                        password,
                        this.profileTotal.wallet.privkey
                    );
                    this.profileTotal.wallet.privkey = null;
                    this.profileTotal.status.isLock = true;
                    this.storeWallet(this.profileTotal.wallet).then(ret => {
                        this.logger.info(ret);
                        if (ret.status == "success") {
                            this.storeStatus(this.profileTotal.status).then(ret => {
                                resolve(this.result.success("locked"));
                            });
                        } else {
                            rejects(this.result.error("Store wallet error"));
                        }
                    });
                } catch (error) {
                    this.logger.error(error);
                    rejects(this.result.error("Set password error"));
                }
            }
        });
    }

    unlock(password: string): Promise<resultType> {
        return new Promise((resolve, rejects) => {
            if (!this.profileTotal.status.isLock) {
                rejects(this.result.warn("Already is unlocked"));
            } else {
                try {
                    this.profileTotal.wallet.privkey = sjcl.decrypt(
                        password,
                        this.profileTotal.wallet.privkeyEncrypted
                    );
                    this.profileTotal.wallet.privkeyEncrypted = null;
                    this.profileTotal.status.isLock = false;
                    this.storeWallet(this.profileTotal.wallet).then(ret => {
                        this.logger.info(ret);
                        if (ret.status == "success") {
                            this.storeStatus(this.profileTotal.status).then(ret => {
                                resolve(this.result.success("Unlocked"));
                            });
                        } else {
                            rejects(this.result.error("Store wallet error"));
                        }
                    });
                } catch (error) {
                    this.logger.error(error);
                    rejects(this.result.error("Wrong password"));
                }
            }
        });
    }
}
