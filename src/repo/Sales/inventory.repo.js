/* --------------------------------------------------------------------------
 * 🗂 Inventory Repository (Database Layer)
 * - ONLY interacts with MongoDB
 * - No business logic
 * - Clean & reusable DB functions
 * -------------------------------------------------------------------------- */
import Inventory from "../../models/Sales/inventory.model.js";

export const inventoryRepo = {
  create: (data) => Inventory.create(data),

  findAll: () => Inventory.find({ isDeleted: false }).sort({ createdAt: -1 }),

  findById: (id) => Inventory.findOne({ _id: id, isDeleted: false }),

  update: (id, data) => Inventory.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  softDelete: (id) => Inventory.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true }),

  findByProductAndVariant: (productId, variant) =>
    Inventory.findOne({ 
      product: productId,
      'variant.size': variant.size,
      'variant.color': variant.color,
      isDeleted: false
    })
};
