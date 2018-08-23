import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { resultType } from "../types/types";
import { ResultProvider } from "../result/result";
import { Logger } from "../logger/logger";

import _ from "lodash";

export enum StorageKeys {
    WALLET = "wallet",
    SETTINGS = "settings",
    CONFIG = "config",
    STATUS = "status",
    ASSET = "asset",
    HISTORY = "history"
}

@Injectable()
export class StorageProvider {
    constructor(public storage: Storage, private result: ResultProvider, private logger: Logger) {}

    processingData(v) {
        if (!v) return null;
        if (!_.isString(v)) return v;
        let parsed;
        try {
            parsed = JSON.parse(v);
        } catch (e) {
            this.logger.error("");
        }
        return parsed || v;
    }

    set(key: string, value: any): Promise<resultType> {
        return this.storage.set(key, value).then(
            success => {
                this.logger.info("set() " + key + ": " + JSON.stringify(success));
                return this.result.success(success);
            },
            error => {
                return this.result.error(error);
            }
        );
    }

    get(key: string): Promise<any> {
        return new Promise((resolve, rejects) => {
            this.storage.get(key).then(
                value => {
                    return resolve(this.processingData(value));
                },
                error => {
                    rejects(this.result.error(error));
                }
            );
        });
    }

    remove(key: string) {
        this.storage.remove(key).then(ret => {
            this.logger.info("remove() " + key + ": " + ret);
        });
    }
}
