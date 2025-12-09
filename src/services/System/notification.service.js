/* --------------------------------------------------------------------------
 * 🧠 Notification Service (Business Logic Layer)
 * - Handles workflow logic
 * - Calls repo methods
 * - Can trigger audit logs or notifications
 * - Throws AppErrors for controller
 * -------------------------------------------------------------------------- */

import AppErrors from "../../utils/AppErrors.js";
import { notificationRepo } from "../../repo/System/notification.repo.js";
import { auditLogService } from "./auditlog.service.js";

export const notificationService = {
  async create(data, user) {
    const notification = await notificationRepo.create({ ...data, user: user._id });

    await auditLogService.createLog({
      user: user._id,
      action: "CREATE",
      targetModel: "Notification",
      targetId: notification._id,
      description: `Created a new notification`
    });

    return notification;
  },

  async findAllByUser(user) {
    return notificationRepo.findAllByUser(user._id);
  },

  async findById(id) {
    const notification = await notificationRepo.findById(id);
    if (!notification) throw AppErrors.notFound("Notification not found / الإشعار غير موجود");
    return notification;
  },

  async update(id, data) {
    const notification = await notificationRepo.update(id, data);
    if (!notification) throw AppErrors.notFound("Notification not found / الإشعار غير موجود");
    return notification;
  },

  async markAsRead(id) {
    const notification = await notificationRepo.markAsRead(id);
    if (!notification) throw AppErrors.notFound("Notification not found / الإشعار غير موجود");
    return notification;
  },

  async delete(id) {
    const notification = await notificationRepo.softDelete(id);
    if (!notification) throw AppErrors.notFound("Notification not found / الإشعار غير موجود");
    return notification;
  }
};
