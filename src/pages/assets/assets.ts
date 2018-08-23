import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";

import { ProfileProvider } from "../../providers";
import { ServiceProvider } from "../../providers/service/service";

@Component({
    selector: "page-assets",
    templateUrl: "assets.html"
})
export class AssetsPage {
    constructor(
        public navCtrl: NavController,
        private logger: Logger,
        public navParams: NavParams,
        private service: ServiceProvider,
        public profile: ProfileProvider
    ) {}

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad AssetsPage");
    }


    getAllBalance(){
        this.service
            .getBalance(this.profile.profileTotal.wallet.address)
            .subscribe(response => {
                this.logger.info(response);
            });
    }
}
