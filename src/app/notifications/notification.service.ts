import { Injectable } from '@angular/core';
import { LocalNotifications } from '@nativescript/local-notifications';

export interface MessageNotification {
  id: number;
  title: string;
  body: string;
  delay: number;
}

@Injectable()
export class NotificationService {

  constructor() {
    LocalNotifications.requestPermission().then(
      (granted) => {
        // console.log('Permission granted? ' + granted);
      }
    );
    LocalNotifications.addOnMessageReceivedCallback(notificationData => {
      console.log('Notification received: ' + JSON.stringify(notificationData));
    });
  }

  /**
   * Used to notify a message to tablet bar
   * @param message
   */
  pushMessage(message: MessageNotification) {
    LocalNotifications.schedule(
      [{
        id: message.id,
        thumbnail: true,
        title: message.title,
        body: message.body,
        forceShowWhenInForeground: true,
        at: new Date(new Date().getTime() + message.delay * 1000)
      }])
      .catch(error => console.log('doScheduleId5WithInput error: ' + error));
  }

  /**
   * Used for delete the active notify from id
   * @param messageId
   */
  deleteMessage(messageId: number) {
    LocalNotifications.cancel(messageId).then(
      function (foundAndCanceled) {
        if (foundAndCanceled) {
          console.log('OK, it\'s gone!');
        } else {
          console.log('No ID ' + messageId + 'was scheduled');
        }
      }
    )
  }
}
