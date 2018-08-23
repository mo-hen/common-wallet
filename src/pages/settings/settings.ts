import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";
import { SettingDetailsPage } from "./setting-detail/setting-detail";

/**设置主页面 层级1*/
@Component({
    selector: "page-settings",
    templateUrl: "settings.html"
})
export class SettingsPage {
    constructor(private navCtrl: NavController, private logger: Logger) {}

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad SettingsPage");
    }

    public openPage(name: string): void {
        this.navCtrl.push(SettingDetailsPage, { name });
    }
}
