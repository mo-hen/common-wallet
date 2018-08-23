import { JSApiProvider } from "./../providers/jsapi/jsapi";
import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Nav, Platform, Events } from "ionic-angular";

import { WelcomePage } from "../pages/welcome/welcome";
import { SettingsPage } from "../pages/settings/settings";
import { TabsPage } from "../pages/tabs/tabs";
import { DiscoverPage } from "../pages/discover/discover";
import { ProfileProvider } from "../providers/profile/profile";
import { Logger, LanguageProvider } from "../providers";
import { ScanPage } from "../pages/scan/scan";

import { Observable } from "rxjs";

@Component({
    template: `<ion-menu [content]="content">
    <ion-header>
        <ion-toolbar>
            <ion-title>Pages</ion-title>
        </ion-toolbar>
    </ion-header>

    <ion-content>
        <ion-list>
            <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
            {{p.title}}
            </button>
        </ion-list>
    </ion-content>

    </ion-menu>
    <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage: any;

    @ViewChild(Nav)
    nav: Nav;

    pages: any[] = [
        { title: "Welcome", component: WelcomePage },
        { title: "Scan", component: ScanPage },
        { title: "Tabs", component: TabsPage },
        { title: "Settings", component: SettingsPage },
        { title: "Discover", component: DiscoverPage }
    ];

    constructor(
        platform: Platform,
        private events: Events,
        private statusBar: StatusBar,
        private profile: ProfileProvider,
        private logger: Logger,
        private language: LanguageProvider,
        private jsapi: JSApiProvider,
        private splashScreen: SplashScreen
    ) {
        this.profile.loadProfile().then(profile => {
            this.logger.info("start loadProfile");
            profile.setting.language = this.language.load();
            this.logger.info(profile.setting.language);
            if (!profile.status.agree) {
                this.logger.info("not agree");
                // TODO: agree page
            } else {
                if (profile.wallet.address) {
                    this.rootPage = TabsPage;
                } else {
                    this.rootPage = WelcomePage;
                }
            }
            this.profile.storeProfile(profile);
        });

        platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.scanFromWalletEvent();
        });
    }

    private scanFromWalletEvent(): void {
        this.events.subscribe("ExitScan", async () => {
            this.closeScannerFromWithinWallet();
        });
    }

    private async closeScannerFromWithinWallet() {
        await this.toggleScannerVisibilityFromWithinWallet(false, 300);
    }

    private toggleScannerVisibilityFromWithinWallet(
        visible: boolean,
        transitionDuration: number
    ): Promise<number> {
        return Observable.timer(transitionDuration).toPromise();
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }
}
