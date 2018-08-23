import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Logger } from "../../providers/logger/logger";
import { ProfileProvider } from "../profile/profile";

import _ from "lodash";

@Injectable()
export class LanguageProvider {
    private languages = [
        {
            name: "English",
            isoCode: "en"
        },
        {
            name: "中文",
            isoCode: "zh",
            useIdeograms: true
        }
    ];
    private current: string;

    constructor(
        private translate: TranslateService,
        private profile: ProfileProvider,
        private logger: Logger
    ) {
        this.logger.info("LanguageProvider initialized.");
        this.translate.onLangChange.subscribe(event => {
            this.logger.info("Setting new default language to: " + event.lang);
        });
    }

    public load(): string {
        let lang = this.profile.profileTotal.setting.language;
        if (!_.isEmpty(lang)) this.current = lang;
        else {
            const browserLang = this.translate.getBrowserLang();
            this.current = this.getName(browserLang) ? browserLang : this.getDefault();
        }
        this.logger.info("Default language: " + this.current);
        this.translate.setDefaultLang(this.current);
        return this.current;
    }

    private getDefault(): string {
        return this.languages[0]["isoCode"];
    }

    public getName(lang: string): string {
        return _.result(
            _.find(this.languages, {
                isoCode: lang
            }),
            "name"
        );
    }

    public set(lang: string): void {
        this.current = lang;
        this.translate.use(lang);
        this.profile.profileTotal.setting.language = lang;
    }

    public getCurrent() {
        return this.current;
    }

    public getAvailables() {
        return this.languages;
    }
}
