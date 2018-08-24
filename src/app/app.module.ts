import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Camera } from "@ionic-native/camera";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { IonicStorageModule } from "@ionic/storage";
import { TranslatePoHttpLoader } from "@biesbjerg/ngx-translate-po-http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { NgxQRCodeModule } from "ngx-qrcode2";

import { MyApp } from "./app.component";
import { PAGES } from "../pages/pages";

/* Directives */
import { CopyToClipboard } from "../directives/copy-to-clipboard/copy-to-clipboard";

/* Providers */
import { ProvidersModule } from "./../providers/providers.module";
import { COMPONENTS } from "../components/components";

/**pipes */
import { DateFormatPipe } from "../pipes/dateFormat/dateFormat";

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
    return new TranslatePoHttpLoader(http, "./assets/i18n", ".po");
}

@NgModule({
    declarations: [MyApp, ...PAGES, ...COMPONENTS, CopyToClipboard, DateFormatPipe],
    imports: [
        BrowserModule,
        HttpClientModule,
        ProvidersModule,
        NgxQRCodeModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(MyApp, {
            backButtonText: "",
            tabsHideOnSubPages: 'true',
            activator: 'highlight',
            swipeBackEnabled: true
        }),
        IonicStorageModule.forRoot({
            name: "__tttdb",
            driverOrder: ["indexeddb", "sqlite", "websql"]
        }),
        ZXingScannerModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [MyApp, ...PAGES, ...COMPONENTS],
    providers: [
        Camera,
        SplashScreen,
        StatusBar,
        // Keep this to enable Ionic's runtime error handling during development
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule {}
