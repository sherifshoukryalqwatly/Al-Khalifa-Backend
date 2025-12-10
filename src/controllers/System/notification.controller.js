import asyncWrapper from "../../utils/asyncHandler.js";
import { notificationService } from "../../services/System/notification.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper to log audit events
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
};

export const notificationController = {
  create: asyncWrapper(async (req, res) => {
    const notification = await notificationService.create(req.body, req.user);

    await logAction({
      req,
      action: "CREATE",
      targetModel: "Notification",
      targetId: notification._id,
      description: `Created notification: ${notification.title || "No title"}`
    });

    return appResponses.success(res, notification, "Notification created successfully / تم إنشاء الإشعار بنجاح");
  }),

  findAllByUser: asyncWrapper(async (req, res) => {
    const notifications = await notificationService.findAllByUser(req.user);

    await logAction({
      req,
      action: "READ",
      targetModel: "Notification",
      description: `Fetched all notifications for user`
    });

    return appResponses.success(res, notifications, "Notifications fetched successfully / تم جلب الإشعارات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const notification = await notificationService.findById(req.params.id);

    await logAction({
      req,
      action: "READ",
      targetModel: "Notification",
      targetId: notification._id,
      description: `Fetched notification by ID`
    });

    return appResponses.success(res, notification, "Notification fetched successfully / تم جلب الإشعار بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const updatedNotification = await notificationService.update(req.params.id, req.body);

    await logAction({
      req,
      action: "UPDATE",
      targetModel: "Notification",
      targetId: updatedNotification._id,
      description: `Updated notification: ${updatedNotification.title || "No title"}`
    });

    return appResponses.success(res, updatedNotification, "Notification updated successfully / تم تحديث الإشعار بنجاح");
  }),

  markAsRead: asyncWrapper(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id);

    await logAction({
      req,
      action: "UPDATE",
      targetModel: "Notification",
      targetId: notification._id,
      description: `Marked notification as read`
    });

    return appResponses.success(res, notification, "Notification marked as read / تم تمييز الإشعار كمقروء");
  }),

  delete: asyncWrapper(async (req, res) => {
    const deletedNotification = await notificationService.delete(req.params.id);

    await logAction({
      req,
      action: "DELETE",
      targetModel: "Notification",
      targetId: deletedNotification._id,
      description: `Deleted notification`
    });

    return appResponses.success(res, deletedNotification, "Notification deleted successfully / تم حذف الإشعار بنجاح");
  })
};
