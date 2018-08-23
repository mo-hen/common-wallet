import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";

import { ProfileProvider } from "../../providers";

@Component({
    selector: "page-modal",
    templateUrl: "modal.html"
})
export class ModalPage {
    walletAddress: string;

    constructor(
        public navCtrl: NavController,
        private logger: Logger,
        public navParams: NavParams,
        private profile: ProfileProvider
    ) {}

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad ModalPage");
        this.walletAddress = this.profile.profileTotal.wallet.address; // 读取 钱包地址
    }

    // 关闭 我的二维码 页面
    closePage(myEvent) {
        this.navCtrl.pop();
    }
}
