import { PopupProvider } from "./../../providers/popup/popup";
import { WalletProvider } from "./../../providers/wallet/wallet";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";
import { TranslateService } from "../../../node_modules/@ngx-translate/core";
import { ProfileProvider } from "../../providers";
import { TabsPage } from "../tabs/tabs";
import { AlertController } from "ionic-angular";

@Component({
    selector: "page-restore",
    templateUrl: "restore.html"
})
export class RestorePage {
    passwordStr: string;
    finalSeed: string;
    errMsg: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger,
        private popup: PopupProvider,
        private walletClient: WalletProvider,
        private translate: TranslateService,
        private profile: ProfileProvider,
        private alertCtrl: AlertController
    ) {}

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad RestorePage");
    }

    restoreWallet(seed: string) {
        let trimSeed = seed.trim();
        let lowerSeed = trimSeed.toLocaleLowerCase();
        let arrSeed = lowerSeed.split(" ");
        if (arrSeed.length == 12) {
            this.finalSeed = arrSeed.join(" ");
            this.presentPrompt();
        } else {
            this.popup.globalToast(this.translate.instant("The input seed is invalid"));
        }
    }

    creatWallet(password, seeds: string) {
        this.walletClient
            .createWallet(password, seeds)
            .then(wallet => {
                this.profile.storeWallet(wallet);
                this.navCtrl.setRoot(TabsPage);
            })
            .catch(ret => {
                this.popup.globalToast(this.translate.instant("Create Wallet Error"));
            });
    }

    presentPrompt() {
        let alert = this.alertCtrl.create({
            title: this.translate.instant("Restore wallet"),
            message: this.errMsg,
            cssClass: 'alertConfirm',
            inputs: [
                {
                    name: 'password',
                    placeholder: this.translate.instant("Please enter password"),
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: this.translate.instant("Cancel"),
                    role: 'cancel',
                    handler: data => {
                        this.logger.info("Cancel RestorePage");
                        this.errMsg = '';
                        this.passwordStr = '';
                    }
                },
                {
                    text: this.translate.instant("Restore"),
                    handler: (data) => {
                        if(this.passwordStr){
                            if(this.passwordStr == data.password){
                                this.errMsg = '';
                                this.passwordStr = '';
                                this.creatWallet(data.password, this.finalSeed);
                            }else{
                                this.errMsg = this.translate.instant("The two password entries are inconsistent");
                                this.presentPrompt();
                            }
                        }else{
                            this.passwordStr = data.password;
                            this.errMsg = this.translate.instant("Please enter password again");
                            this.presentPrompt();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
}
