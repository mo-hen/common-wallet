import { ProfileProvider } from "./../profile/profile";
import { Injectable } from "@angular/core";
import { ApiProvider } from "../api/api";
import { Logger } from "../logger/logger";
import { ResponseType, configType } from "../types/types";
import { HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ServiceProvider {
    httpOptions: any;
    restfulUrl: string;
    miniAppUrl: string;
    constructor(
        private api: ApiProvider,
        private profile: ProfileProvider,
        private logger: Logger
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({
                "content-type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT"
            }),
            responseType: "json"
        };
        if (this.profile.profileTotal.config.network == "testnet") {
            this.restfulUrl = this.profile.profileTotal.config.restAPI_dev;
            this.miniAppUrl = this.profile.profileTotal.config.miniAppUrl_dev;
        } else {
            this.restfulUrl = this.profile.profileTotal.config.restAPI;
            this.miniAppUrl = this.profile.profileTotal.config.miniAppUrl;
        }
    }

    // 登陆注册
    public login(data: any, option = this.httpOptions): Observable<ResponseType> {
        this.logger.info("login: ", data);
        return this.api.post(this.restfulUrl, "asset/register", data, option);
    }

    // 转账
    public transfer(data: any, option = this.httpOptions): Observable<ResponseType> {
        this.logger.info("transfer: ", data);
        return this.api.post(this.restfulUrl, "asset/transferttt", data, option);
    }

    // 提交签名
    public submitSig(data: any, option = this.httpOptions): Observable<ResponseType> {
        this.logger.info("submitSig: ", data);
        return this.api.post(this.restfulUrl, "asset/submittx", data, option);
    }

    // 获取余额
    public getBalance(
        address: any,
        asset: string = "",
        option = this.httpOptions
    ): Observable<ResponseType> {
        this.logger.info("getBalance: ", address, asset);
        return this.api.get(
            this.restfulUrl,
            "query/balance/" + address + "/" + asset,
            null,
            option
        );
    }

    // 获取交易历史
    public getUnit(
        address: string,
        asset: string,
        start: number,
        end: number,
        option = this.httpOptions
    ): Observable<ResponseType> {
        this.logger.info("getHistory: ", address, asset, start, end);
        return this.api.get(
            this.restfulUrl,
            `query/txs/${address}/${asset}/${start}/${end}`,
            option
        );
    }

    // 获取交易历史
    public getHistory(
        address: string,
        asset: string,
        start: number,
        end: number,
        option = this.httpOptions
    ): Observable<ResponseType> {
        this.logger.info("getHistory: ", address, asset, start, end);
        return this.api.get(
            this.restfulUrl,
            `query/readabletxs/${address}/${asset}/${start}/${end}`,
            option
        );
    }

    public getMiniApp(): Observable<any> {
        this.logger.info("getMiniApp: ");
        return this.api.get(this.miniAppUrl, `miniapp/all`);
    }
}
