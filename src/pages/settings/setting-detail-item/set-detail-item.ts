import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { Logger } from "../../../providers/logger/logger";
import { ProfileProvider } from "../../../providers/profile/profile";
import { settingType, walletType } from "../../../providers/types/types";
import { PopupProvider } from "../../../providers";

@Component({
    selector: "setting-detail-item",
    templateUrl: "set-detail-item.html"
})

/**设置具体项 层级3*/
export class SetDetailItemPage {
    public currentTitle: string;
    public settings: settingType;
    public wallet: walletType;
    public islock: boolean;
    public unlock: boolean = false;

    public checkPassAble: boolean = true;

    constructor(
        params: NavParams,
        private logger: Logger,
        private translate: TranslateService,
        private profile: ProfileProvider,
        public popup: PopupProvider,
        public alertCtrl: AlertController,
        private navCtrl: NavController
    ) {
        this.currentTitle = params.data.item;
        this.settings = this.profile.profileTotal.setting;
        this.wallet = this.profile.profileTotal.wallet;
        this.islock = this.profile.profileTotal.status.isLock;
        this.unlock = this.islock;

        this.logger.info("设置------" + this.currentTitle);
    }

    passwordSet(val1: any, val2: any) {
        if (!val1 || !val2) {
            this.popup.globalToast(this.translate.instant("Please enter password"));
            return false;
        } else if (val1 !== val2) {
            this.popup.globalToast(
                this.translate.instant("The two password entries are inconsistent")
            );
            return false;
        } else {
            this.profile.lock(val1).then(
                success => {
                    this.popup.globalToast(this.translate.instant("Password set success"));
                    this.navCtrl.pop();
                },
                error => {
                    this.logger.info(error.msg);
                }
            );
        }
    }

    passwordUpdate(val1: any, val2: any, val3: any) {
        console.log("update pass");
        if (!val1 || !val2) {
            this.popup.globalToast(this.translate.instant("Please enter password"));
            return false;
        } else if (val1 !== val2) {
            this.popup.globalToast(
                this.translate.instant("The two password entries are inconsistent")
            );
            return false;
        } else {
            this.profile.unlock(val3).then(
                success => {
                    this.logger.info(success.msg);
                    this.profile.lock(val1).then(
                        success => {
                            this.logger.info(success.msg);
                            this.popup.globalToast(this.translate.instant("Password set success"));
                            this.navCtrl.pop();
                        },
                        error => {
                            this.logger.info(error.msg);
                            this.popup.globalToast(error.msg);
                        }
                    );
                },
                error => {
                    this.logger.info(error.msg);
                    this.popup.globalToast(error.msg);
                }
            );
        }
    }

    // 点击 取消密码
    unLock(lock: boolean) {
        let title = this.translate.instant("Close password");
        let msg = "";
        let okText = this.translate.instant("Ok");

        this.showPasswordConfirm(title, msg, okText);
    }
    showPasswordConfirm(title, msg, okText) {
        this.popup.passwordConfirm(title, msg, okText).then(
            res => {
                this.profile.unlock(res).then(
                    success => {
                        this.popup.globalToast(this.translate.instant("Password unlock success"));
                        this.navCtrl.pop();
                    },
                    error => {
                        this.unlock = this.islock;
                        this.popup.globalToast(this.translate.instant(error.msg));
                    }
                );
            },
            err => {
                this.unlock = this.islock;
                this.logger.info("点击取消");
            }
        );
    }
}
