import { FactoryProvider } from "./../../providers/factory/factory";
import { ProfileProvider } from "./../../providers/profile/profile";
import { ServiceProvider } from "./../../providers/service/service";
import { historyType, txType } from "./../../providers/types/types";
import { NavController, LoadingController } from "ionic-angular";
import { Logger } from "./../../providers/logger/logger";
import { Component } from "@angular/core";
import * as _ from "lodash";
import { HistoryDetailPage } from "./history-detail/history-detail";

@Component({
    selector: "page-history",
    templateUrl: "history.html"
})
export class HistoryPage {
    history: historyType;
    historyList: txType[];
    public page: number = 1;
    private loader: any;

    constructor(
        private logger: Logger,
        private profile: ProfileProvider,
        private factory: FactoryProvider,
        private service: ServiceProvider,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController
    ) {
        this.history = {};
        this.historyList = [];
        this.loadHistory();
        this.loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });
    }

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad HistoryPage");
    }

    loadHistory() {
        this.profile.loadHistory().then(
            ret => {
                this.logger.info("--------loadHistory--------");
                this.logger.info(ret);
                if (ret && Object.keys(ret).length > 0) {
                    for (const key of Object.keys(ret)) {
                        this.historyList.push(ret[key]);
                    }
                    this.historyList = this.historyList.sort(this.compare);
                    //this.logger.info("---------historyList--------");
                    //this.logger.info(this.historyList);
                } else {
                    this.service
                        .getUnit(this.profile.profileTotal.wallet.address, "base", 1, 10)
                        .subscribe(response => {
                            response.data.forEach(item => {
                                let tx = this.factory.unpackUnit(item);
                                this.history[tx.unit] = _.clone(tx);
                            });
                            for (const key of Object.keys(this.history)) {
                                this.historyList.push(this.history[key]);
                            }
                            this.historyList = this.historyList.sort(this.compare);
                            this.profile.storeHistory(this.history);
                        });
                }
            },
            error => {
                this.logger.info(error);
            }
        );
    }

    public refresh(refresher) {
        this.service
            .getUnit(this.profile.profileTotal.wallet.address, "base", 1, 10)
            .subscribe(response => {
                if (response.errCode == 0 && response.data.length > 0) {
                    this.historyList = [];
                    this.logger.info("**********refresh***********");
                    this.logger.info(response);
                    response.data.forEach(item => {
                        let tx = this.factory.unpackUnit(item);
                        this.history[tx.unit] = _.clone(tx);
                    });
                    // TODO historyList repeat
                    for (const key of Object.keys(this.history)) {
                        this.historyList.push(this.history[key]);
                    }
                }
                this.profile.storeHistory(this.history).then(ret => {
                    refresher.complete();
                    this.page = 1;
                });
            });
    }

    loadMore() {
        this.loader.present();
        if (this.page == 1) {
            this.service
                .getUnit(this.profile.profileTotal.wallet.address, "base", 1, 10)
                .subscribe(response => {
                    if (response.errCode == 0 && response.data.length > 0) {
                        this.historyList = [];
                        response.data.forEach(item => {
                            let tx = this.factory.unpackUnit(item);
                            this.history[tx.unit] = _.clone(tx);
                        });
                        // TODO historyList repeat
                        for (const key of Object.keys(this.history)) {
                            this.historyList.push(this.history[key]);
                        }
                    }
                    this.profile.storeHistory(this.history);
                });
        }
        this.page++;
        this.service
            .getUnit(this.profile.profileTotal.wallet.address, "base", this.page, 10)
            .subscribe(response => {
                if (response.errCode == 0 && response.data.length > 0) {
                    this.logger.info("***********loadMore*********");
                    this.logger.info(response);
                    response.data.forEach(item => {
                        let tx = this.factory.unpackUnit(item);
                        this.history[tx.unit] = _.clone(tx);
                    });
                    // TODO historyList repeat
                    for (const key of Object.keys(this.history)) {
                        this.historyList.push(this.history[key]);
                    }
                    this.historyList = this.historyList.sort(this.compare);
                } else {
                    this.page--;
                }
                this.loader.dismiss();
            });
    }

    toDetail(data: string) {
        this.navCtrl.push(HistoryDetailPage, { data: JSON.stringify(data) });
    }

    compare(obj1, obj2) {
        var val1 = obj1.timestamp;
        var val2 = obj2.timestamp;
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }
    }
}
