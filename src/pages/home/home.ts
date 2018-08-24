import { Component } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";

import { PopoverPage } from "../popover/popover";
import { ProfileProvider } from "../../providers";
import { ServiceProvider } from "../../providers/service/service";
import { SendPage } from "../send/send";
import { AssetsPage } from "../assets/assets";
import { HistoryPage } from "../history/history";

@Component({
    selector: "page-home",
    templateUrl: "home.html"
})
export class HomePage {
    amount: number; // 余额
    loginDate: {
        pubkey: string;
    };

    constructor(
        public navCtrl: NavController,
        private logger: Logger,
        public navParams: NavParams,
        private profile: ProfileProvider,
        public popoverCtrl: PopoverController,
        private service: ServiceProvider
    ) {
        this.logger.info(" profile--------", this.profile.profileTotal);
        this.loginDate = {
            pubkey: this.profile.profileTotal.wallet.addressPubkey
        };
        this.profile.loadAsset().then(ret => {
            this.logger.info(ret);
            if (ret) {
                this.amount = ret.TTT.balance / 1000000;
            } else {
                this.amount = 0;
            }
        });
    }

    // 右上角 弹出
    presentPopover(myEvent) {
        let popover = this.popoverCtrl.create(PopoverPage);
        popover.present({ ev: myEvent });
    }

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad HomePage");
        this.service.login(this.loginDate).subscribe(response => {
            this.logger.info(response);
        });
    }

    // 跳转到 转账
    navToSend() {
        this.navCtrl.push(SendPage);
    }

    // 跳转到 卡包
    navToAssets() {
        this.navCtrl.push(AssetsPage);
    }

    // 跳转到 历史
    navToHistory() {
        this.navCtrl.push(HistoryPage);
    }

    // 下拉刷新
    refresh(refresher) {
        this.logger.info("getBalance start...");
        this.service
            .getBalance(this.profile.profileTotal.wallet.address, "base")
            .subscribe(
                response => {
                    this.logger.info(response);
                    if (this.amount != (response.data.amount + response.data.pending) / 1000000) {
                        this.profile.profileTotal.asset.TTT.balance =
                            response.data.amount + response.data.pending;
                        this.profile.storeAsset(this.profile.profileTotal.asset).then(ret => {
                            this.logger.info(ret);
                        });
                        this.amount = (response.data.amount + response.data.pending) / 1000000;
                    }
                    refresher.complete();
                },
                rejects => {
                    this.logger.info('错误：',rejects);
                    refresher.cancel();
                }
            );

        // 超时 5S 取消刷新
        // setTimeout(() => {
        //     this.logger.info("NetWork Err");
        //     refresher.cancel();
        // }, 5000);
    }
}
