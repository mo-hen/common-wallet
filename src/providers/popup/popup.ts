import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastController, AlertController, Modal, ModalController } from "ionic-angular";
import { MiniModalComponent } from "../../components/mini-modal/mini-modal";
import { Logger } from "../../providers/logger/logger";

export type MiniModalTitle =
    | "backup-needed"
    | "backup-ready"
    | "backup-warning"
    | "fee-warning"
    | "sensitive-info";

@Injectable()
export class PopupProvider {
    constructor(
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private logger: Logger,
        private modalCtrl: ModalController,
        private translate: TranslateService
    ) {}

    public globalToast(msg: string) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: "bottom",
            cssClass: "globalToastStyle"
        });

        toast.present();
    }

    public globalAlert(
        title: string,
        subTitle?: string,
        okText?: string
    ): Promise<any> {
        return new Promise(resolve => {
            let alert = this.alertCtrl.create({
                title,
                subTitle,
                enableBackdropDismiss: false,
                buttons: [
                    {
                        text: okText ? okText : this.translate.instant("OK"),
                        handler: () => {
                            this.logger.info("Ok clicked");
                            resolve();
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    public globalConfirm(
        title: string,
        message: string,
        okText?: string,
        cancelText?: string
    ): Promise<any> {
        return new Promise(resolve => {
            let confirm = this.alertCtrl.create({
                title,
                message,
                buttons: [
                    {
                        text: cancelText
                            ? cancelText
                            : this.translate.instant("CANCEL"),
                        handler: () => {
                            this.logger.info("Disagree clicked");
                            resolve(false);
                        }
                    },
                    {
                        text: okText ? okText : this.translate.instant("OK"),
                        handler: () => {
                            this.logger.info("Agree clicked");
                            resolve(true);
                        }
                    }
                ],
                enableBackdropDismiss: false
            });
            confirm.present();
        });
    }

    public createMiniModal(modalTitle: MiniModalTitle): Modal {
        return this.modalCtrl.create(
            MiniModalComponent,
            { modalTitle },
            { cssClass: "fullscreen-modal" }
        );
    }

    // 密码弹框（ 全局 ）
    public passwordConfirm(
        title: string,
        message: string,
        text: string
    ): Promise<any> {
            return new Promise( (resolve, reject) => {
                const prompt = this.alertCtrl.create({
                    cssClass: 'alertConfirm',
                    title: title,
                    message: message,
                    inputs: [
                        {
                            name: "password",
                            type: "password",
                            placeholder: this.translate.instant("Please enter password")
                        }
                    ],
                    buttons: [
                        {
                            text: this.translate.instant("Cancel"),
                            handler: () => { reject('cancel') }
                        },
                        {
                            text: text,
                            handler: data => { resolve(data.password) }
                        }
                    ]
                });
                prompt.present();
            })
    }


}
