import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-adv-popover',
  templateUrl: './adv-popover.component.html',
  styleUrls: ['./adv-popover.component.scss'],
})
export class AdvPopoverComponent implements OnInit {

  constructor(private popCtrl: PopoverController) { }

  ngOnInit() { }

  dismiss(): void {
    this.popCtrl.dismiss();
  }
}
