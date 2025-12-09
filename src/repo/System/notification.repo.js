/* --------------------------------------------------------------------------
 * 🗂️ Notification Repository (Database Layer)
 * - ONLY interacts with MongoDB
 * - No business logic, no HTTP handling
 * - Clean & reusable DB functions
 * -------------------------------------------------------------------------- */

import Notification from "../../models/System/notification.model.js";

export const notificationRepo = {
  create: (data) => Notification.create(data),

  findAllByUser: (userId) =>
    Notification.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 }),

  findById: (id) =>
    Notification.findOne({ _id: id, isDeleted: false }),

  update: (id, data) =>
    Notification.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  softDelete: (id) =>
    Notification.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    ),

  markAsRead: (id) =>
    Notification.findByIdAndUpdate(id, { isRead: true }, { new: true })
};
