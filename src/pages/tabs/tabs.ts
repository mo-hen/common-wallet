import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";
import { DiscoverPage } from "../discover/discover";
import { SettingsPage } from "../settings/settings";

export enum TabIndex {
    HOME,
    DISCOVER,
    SETTINGS
}

@Component({
    selector: "page-tabs",
    templateUrl: "tabs.html"
})
export class TabsPage {
    @ViewChild("tabs") TabsPage: any;

    tab1Root: any = HomePage;
    tab2Root: any = DiscoverPage;
    tab3Root: any = SettingsPage;
    tabIndex: TabIndex;

    constructor(public navCtrl: NavController, private params: NavParams) {
        // 如果传入参数则展示指定tab页面 {index: TabIndex.DISCOVER}
        this.tabIndex = this.params.get("index") || TabIndex.HOME;
    }
}
