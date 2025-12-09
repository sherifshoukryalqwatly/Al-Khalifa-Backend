/* --------------------------------------------------------------------------
 * 🎮 Notification Controller (HTTP Layer)
 * - Handles express req/res
 * - Delegates logic to service layer
 * - Sends formatted responses
 * -------------------------------------------------------------------------- */

import asyncWrapper from "../../utils/asyncHandler.js";
import { notificationService } from "../../services/System/notification.service.js";
import { appResponses } from "../../utils/AppResponses.js";

export const notificationController = {
  create: asyncWrapper(async (req, res) => {
    const notification = await notificationService.create(req.body, req.user);
    return appResponses.success(res, notification, "Notification created successfully / تم إنشاء الإشعار بنجاح");
  }),

  findAllByUser: asyncWrapper(async (req, res) => {
    const notifications = await notificationService.findAllByUser(req.user);
    return appResponses.success(res, notifications, "Notifications fetched successfully / تم جلب الإشعارات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const notification = await notificationService.findById(req.params.id);
    return appResponses.success(res, notification, "Notification fetched successfully / تم جلب الإشعار بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const notification = await notificationService.update(req.params.id, req.body);
    return appResponses.success(res, notification, "Notification updated successfully / تم تحديث الإشعار بنجاح");
  }),

  markAsRead: asyncWrapper(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id);
    return appResponses.success(res, notification, "Notification marked as read / تم تمييز الإشعار كمقروء");
  }),

  delete: asyncWrapper(async (req, res) => {
    const notification = await notificationService.delete(req.params.id);
    return appResponses.success(res, notification, "Notification deleted successfully / تم حذف الإشعار بنجاح");
  })
};
