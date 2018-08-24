import { PopupProvider } from "./../../providers/popup/popup";
import { FactoryProvider } from "./../../providers/factory/factory";
import { Component } from "@angular/core";
import { NavController, AlertController } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";
import { ProfileProvider, ServiceProvider } from "../../providers";
import * as Core from "wallet-base";
import { TranslateService } from "@ngx-translate/core";
import { WalletProvider } from "../../providers/wallet/wallet";

@Component({
    selector: "page-send",
    templateUrl: "send.html"
})
export class SendPage {
    myAddress: string;
    payeeAddress: string;
    paymentAmount: number;
    additionalMessage: string;
    detailUnit: string;

    transData: {
        payer: string;
        message?: string;
        outputs: any[];
    };

    txid: string;
    textToSign: string;
    sig: string;
    walletPrivkey: string;
    path: string;
    sigData: any;

    isReadonly: boolean;
    assetType: string;

    constructor(
        public navCtrl: NavController,
        private logger: Logger,
        private popup: PopupProvider,
        private profile: ProfileProvider,
        private translate: TranslateService,
        private service: ServiceProvider,
        public alertCtrl: AlertController,
        public wallet: WalletProvider,
        private factory: FactoryProvider
    ) {
        this.myAddress = this.profile.profileTotal.wallet.address;
    }

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad SendPage");
        this.isReadonly = false;
        this.assetType = 'MN';
    }


    onKey(ev){
        if( this.wallet.isValidAddress(ev.target.value) ){
            this.fnIsReadonly(true);
        }
    }
    fnIsReadonly(isReadonly: boolean){
        this.isReadonly = isReadonly;
    }

    // 清空地址
    clearAddress(){
        this.fnIsReadonly(false);
        this.payeeAddress = '';
    }

    getCurrentValue(){
        console.log('^^^^^^^^^^^^^^^^^' + this.assetType)
    }

    // 发送 资产
    send() {
        if (!this.payeeAddress || !this.paymentAmount) {
            this.popup.globalToast("No Empty");
            return;
        }
        this.transData = {
            payer: this.myAddress,
            outputs: [
                {
                    address: this.payeeAddress,
                    amount: (this.paymentAmount - 0) * 1000000
                }
            ]
        };
        if (this.additionalMessage) {
            this.transData.message = this.additionalMessage;
        }

        this.service.transfer(this.transData).subscribe(response => {
            this.logger.info(response);
            this.textToSign = response.data.b64_to_sign; // 需要 签名信息
            this.txid = response.data.txid; // 返回给后台的 txid

            if(this.profile.profileTotal.status.isLock){
                let title = this.translate.instant("Please enter password");
                let msg = '';
                let okText = this.translate.instant("Ok");
                this.showPasswordConfirm(title, msg, okText);
            }else{
                this.signAndSubmit();
            }
        });
    }
    // 签名 & 提交
    signAndSubmit() {
        this.path = "m/44'/0'/0'/0/0"; // 签名路径
        this.walletPrivkey = this.profile.profileTotal.wallet.privkey; // 当前钱包 根私钥
        this.sig = Core.sign(this.textToSign, this.walletPrivkey, this.path); // 签名
        // 验证签名是否正确
        let ret = Core.verify(
            this.textToSign,
            this.sig,
            this.profile.profileTotal.wallet.addressPubkey
        );
        this.logger.info("本地验证结果: ", ret);
        if (ret) {
            this.sigData = {
                txid: this.txid,
                sig: this.sig
            };
            this.logger.info("sigData: ", this.sigData);
            this.service.submitSig(this.sigData).subscribe(response => {
                this.logger.info("交易成功返回信息:", response);
                let tx = this.factory.unpackUnit(response.data.unit);
                this.profile.profileTotal.history[tx.unit] = tx;
                this.profile.storeHistory(this.profile.profileTotal.history).then(ret => {
                    this.logger.info(ret);
                });
                this.navCtrl.pop();
            });
        } else {
            this.popup.globalToast("verify error");
            return;
        }
    }
    // 需要弹出密码框
    showPasswordConfirm(title, msg, okText){
        this.popup
            .passwordConfirm(title, msg, okText)
            .then(res => {
                this.profile.unlock(res).then(
                    success => {
                        this.signAndSubmit();
                        this.profile.lock(res).then(
                            success => {},
                            error => {}
                        );
                    },
                    error => {
                        let msg = this.translate.instant('wrong password');
                        this.showPasswordConfirm(title, msg, okText);
                    }
                );
            }, err => { this.logger.info('点击取消') });
    }
}
