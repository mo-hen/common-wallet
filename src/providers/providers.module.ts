import { NgModule } from "@angular/core";
import {
    Clipboard,
    Logger,
    ConfigProvider,
    PlatformProvider,
    StorageProvider,
    ProfileProvider,
    NodeWebkitProvider,
    QRScanner,
    ExternalLinkProvider,
    PopupProvider,
    ScanProvider,
    ApiProvider,
    ServiceProvider,
    TypesProvider,
    ResultProvider,
    LanguageProvider,
    JSApiProvider,
    FactoryProvider,
    WalletProvider
} from "./index";

@NgModule({
    providers: [
        Clipboard,
        Logger,
        ConfigProvider,
        PlatformProvider,
        StorageProvider,
        ProfileProvider,
        NodeWebkitProvider,
        QRScanner,
        ExternalLinkProvider,
        PopupProvider,
        ScanProvider,
        ApiProvider,
        ServiceProvider,
        TypesProvider,
        ResultProvider,
        LanguageProvider,
        JSApiProvider,
        FactoryProvider,
        WalletProvider
    ]
})
export class ProvidersModule {}
