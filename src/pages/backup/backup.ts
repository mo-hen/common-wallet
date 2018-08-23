import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";

@Component({
    selector: "page-backup",
    templateUrl: "backup.html"
})
export class BackupPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger
    ) {}

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad BackupPage");
        this.logger.info(this.navParams.get("phrase"));
    }
}
