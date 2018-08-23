import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { Logger } from "../../providers/logger/logger";

import { ModalPage } from '../modal/modal';

@Component({
    selector: "page-popover",
    templateUrl: "popover.html"
})
export class PopoverPage {
    constructor(
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        private logger: Logger,
        public navParams: NavParams
    ) {}

    ionViewDidLoad() {
        this.logger.info("ionViewDidLoad PopoverPage");
    }

    presentModal(){
        this.navCtrl.pop();
        let modal = this.modalCtrl.create(ModalPage);
        modal.present();
    }

    presentModalscan(){
        //alert(111)
    }
}
