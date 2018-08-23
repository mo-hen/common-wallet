import { Logger } from "./../../providers/logger/logger";
import { ServiceProvider } from "./../../providers/service/service";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Slides } from "ionic-angular";
import { BrowserPage } from "../browser/browser";

@Component({
    selector: "page-discover",
    templateUrl: "discover.html"
})
export class DiscoverPage {
    public applist: any;

    @ViewChild(Slides)
    slides: Slides;
    //解决切换其他页面回去轮播图不动问题
    ionViewWillEnter() {
        this.slides.startAutoplay();
    }
    ionViewWillLeave() {
        this.slides.stopAutoplay();
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private service: ServiceProvider,
        private logger: Logger
    ) {
        this.service.getMiniApp().subscribe(response => {
            this.logger.info(response);
            this.applist = response;
        });
    }

    browserShow(url: string, title: string) {
        this.navCtrl.push(BrowserPage, { url, title: title });
    }
}
