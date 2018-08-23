import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

import { CreatePage } from "../create/create";
import { RestorePage } from "../restore/restore";
import { TabsPage } from "../tabs/tabs";

import { ProfileProvider } from "../../providers";
import { Logger } from "../../providers/logger/logger";

@Component({
    selector: "page-welcome",
    templateUrl: "welcome.html"
})
export class WelcomePage {
    constructor(
        public navCtrl: NavController,
        private profile: ProfileProvider,
        private logger: Logger
    ) {
        this.logger.info("welcome initialized.");
    }

    restoreWallet() {
        this.navCtrl.push(RestorePage);
    }

    createWallet() {
        if (!this.profile.profileTotal.wallet.address) {
            this.navCtrl.push(CreatePage);
        } else {
            this.navCtrl.setRoot(TabsPage);
        }
    }
}
