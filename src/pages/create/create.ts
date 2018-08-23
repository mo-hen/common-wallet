import { PopupProvider } from "./../../providers/popup/popup";
import { WalletProvider } from "./../../providers/wallet/wallet";
import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";
import { TranslateService } from "@ngx-translate/core";

import { TabsPage } from "../tabs/tabs";
import { BackupPage } from "../backup/backup";
import { ProfileProvider } from "../../providers";

@Component({
    selector: "page-create",
    templateUrl: "create.html"
})
export class CreatePage {
    mnemonic: string;
    passwordStr: string;
    errMsg: string;
    constructor(
        private translate: TranslateService,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private profile: ProfileProvider,
        private walletClient: WalletProvider,
        private logger: Logger,
        private popup: PopupProvider
    ) {
        this.logger.info("profile: ", this.profile.profileTotal);
    }

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad CreatePage");
        let title = this.translate.instant("Create wallet");
        let msg = '';
        let okText = this.translate.instant('Create');

        this.showPasswordConfirm(title, msg, okText);
    }

    // 点击下一步 （ 备份 or 跳过 ）
    onClickNext() {
        const confirm = this.alertCtrl.create({
            title: this.translate.instant("Backup Phrase"),
            message: this.translate.instant(
                "Recommend backup phrase to prevent account loss or backup in settings."
            ),
            buttons: [
                {
                    text: this.translate.instant("Skip"),
                    handler: () => {
                        this.logger.info("Skip clicked");
                        this.navCtrl.setRoot(TabsPage);
                    }
                },
                {
                    text: this.translate.instant("Backup"),
                    handler: () => {
                        this.logger.info("Backup clicked");
                        this.navCtrl.push(BackupPage);
                    }
                }
            ]
        });
        confirm.present();
    }

    // 创建新的钱包 首先输入密码
    showPasswordConfirm(title, msg, okText){
        this.popup
            .passwordConfirm(title, msg, okText)
            .then(res => {
                if(this.passwordStr){
                    if(this.passwordStr == res){
                        this.errMsg = '';
                        this.passwordStr = '';
                        this.walletClient
                            .createWallet(res)
                            .then(wallet => {
                                this.mnemonic = wallet.mnemonic;
                                this.profile.storeWallet(wallet);
                            })
                            .catch(ret => {
                                this.popup.globalToast(this.translate.instant("Create Wallet Error"));
                            });
                    }else{
                        let msg = this.translate.instant("The two password entries are inconsistent");
                        this.showPasswordConfirm(title, msg, okText);
                    }
                }else{
                    this.passwordStr = res;
                    let msg = this.translate.instant("Please enter password again");
                    this.showPasswordConfirm(title, msg, okText);
                }
            }, err => {
                this.logger.info('点击取消');
                this.navCtrl.pop();
            });
    }
}
