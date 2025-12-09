/* --------------------------------------------------------------------------
 * 🗂 Shipping Repository (Database Layer)
 * - ONLY interacts with MongoDB
 * - No business logic
 * - Clean & reusable DB functions
 * -------------------------------------------------------------------------- */
import Shipping from "../../models/Sales/shipping.model.js";

export const shippingRepo = {
  create: (data) => Shipping.create(data),
  findAll: () => Shipping.find({ isDeleted: false }).sort({ createdAt: -1 }),
  findById: (id) => Shipping.findOne({ _id: id, isDeleted: false }),
  update: (id, data) => Shipping.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  softDelete: (id) => Shipping.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true }),
  findByOrder: (orderId) => Shipping.findOne({ order: orderId, isDeleted: false })
};
