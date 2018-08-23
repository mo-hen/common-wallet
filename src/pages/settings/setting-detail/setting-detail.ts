import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "../../../providers/logger/logger";
import { ProfileProvider } from "../../../providers/profile/profile";
import { RestorePage } from "../../restore/restore";
import { settingType, walletType } from "../../../providers/types/types";
import { LanguageProvider } from "../../../providers";
import { SetDetailItemPage } from "../setting-detail-item/set-detail-item";
import { version } from "../../../assets/config";

/**设置详情页 层级2*/
@Component({
    selector: "setting-detail",
    templateUrl: "setting-detail.html"
})
export class SettingDetailsPage {
    public version: string = version;
    public currentTitle: string;
    public settings: settingType;
    public wallet: walletType;

    constructor(
        params: NavParams,
        private navCtrl: NavController,
        private logger: Logger,
        private translate: TranslateService,
        private language: LanguageProvider,
        private profile: ProfileProvider
    ) {
        this.currentTitle = params.data.name;
        this.settings = this.profile.profileTotal.setting;
        this.wallet = this.profile.profileTotal.wallet;

        this.logger.info(this.profile.profileTotal);
    }

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad Settings-detail-Page");
    }

    switchLanguage(lang: string) {
        this.language.set(lang);
        this.profile.storeSetting(this.settings).then(ret => {
            this.logger.info(ret);
        });
    }

    switchCurrency(name: string) {
        switch (name) {
            case "CNY":
                this.settings.currency = "CNY";
                break;
            case "USD":
                this.translate.use("en");
                this.settings.currency = "USD";
                break;
            default:
                this.settings.currency = "CNY";
                break;
        }
        this.profile.storeSetting(this.settings).then(ret => {
            this.logger.info(ret);
        });
    }

    setPass(): void {
        this.navCtrl.push(SetDetailItemPage, { item: "SETPASS" });
    }

    updatePass(): void {
        this.navCtrl.push(SetDetailItemPage, { item: "UPDATEPASS" });
    }

    backupSeed() {
        this.navCtrl.push(SetDetailItemPage, { item: "BACKUP_WALLET" });
    }

    switchWallet() {
        this.navCtrl.push(RestorePage);
    }
}
