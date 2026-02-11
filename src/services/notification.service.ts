import { NotificationModel } from "../modals/notification.model.js";
import { NotificationType } from "../enums/notification.enums.js";

export class NotificationService {
  async send(
    brokerId: string,
    type: NotificationType,
    message: string
  ) {
    return NotificationModel.create({
      brokerId,
      type,
      message,
    });
  }
}


// send(brokerId, type, message)
// getMyNotifications(brokerId)
// markAsRead(notificationId, brokerId)
// markAllAsRead(brokerId)
// delete(notificationId, brokerId)
