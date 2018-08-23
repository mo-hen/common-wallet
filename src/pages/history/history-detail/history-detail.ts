import { txType } from "../../../providers/types/types";
import { NavController, NavParams } from "ionic-angular";
import { Logger } from "../../../providers/logger/logger";
import { Component } from "@angular/core";
import * as _ from "lodash";
import { BrowserPage } from "../../browser/browser";

@Component({
    selector: "history-detail",
    templateUrl: "history-detail.html"
})
export class HistoryDetailPage {
    public historyDetail: txType;
    public page: number = 1;

    constructor(private logger: Logger, public navCtrl: NavController, private params: NavParams) {
        this.historyDetail = JSON.parse(this.params.get("data"));
        this.logger.info(this.historyDetail);
    }

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad HistoryDetailPage");
    }

    toBrowser(unit: string) {
        this.navCtrl.push(BrowserPage, { unit });
    }
}
