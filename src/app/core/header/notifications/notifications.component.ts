import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { Notification } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notifications.service';
import { TxService, Tx } from '../../../tx.service';
import { Utils } from '../../../utils/utils';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('anmNotifications', [
      state('open', style({
        opacity: 1,
        display: 'block',
        top: '43px'
      })),
      state('closed', style({
        opacity: 0,
        display: 'none',
        top: '48px'
      })),
      transition('open => closed', [
        animate('.3s')
      ]),
      transition('closed => open', [
        animate('.3s')
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit {
  viewDetail: string;
  selection: string;
  previousSelection: string;

  timeEvent = 0; // TODO define the value

  // Notification Model
  mNotification = Notification;
  oNotifications: Array<Notification> = [];
   // Change value of detail from Notifications Service
  notificationsCounter: any = this.notificationsService.changeCounter(this.oNotifications.length);

  constructor(
    private txService: TxService,
    public notificationsService: NotificationsService
  ) { }

  getTime(timestamp) {
    if (timestamp <= 0) {
      return 'Just now';
    }
    return timestamp + 's';
  }

  ngOnInit() {
    this.notificationsService.currentDetail.subscribe(detail => this.viewDetail = detail); // Subscribe to detail from Notifications Service
    this.txService.subscribeNewTx((tx: Tx) => this.onNewTransaction(tx));
    this.txService.subscribeConfirmedTx((tx: Tx) => this.onNewTransaction(tx));
    this.txService.unsubscribeConfirmedTx((tx: Tx) => this.onNewTransaction(tx));
  }

  private onNewTransaction(tx: Tx) {
    this.oNotifications.push(new Notification(
      Utils.capFirstLetter(tx.type.toString()),
      Utils.shortAddress(tx.to),
      Utils.formatDelta(Math.floor((new Date().getTime() - tx.timestamp) / 1000)),
      Utils.capFirstLetter(tx.type.toString()),
      'a new loan'
    ));
    this.notificationsService.changeCounter(this.oNotifications.length);
  }
}