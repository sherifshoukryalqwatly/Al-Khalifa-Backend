/* --------------------------------------------------------------------------
 * 🧠 Inventory Service (Business Logic Layer)
 * - Handles workflow logic
 * - Checks stock availability
 * - Updates stock after orders
 * - Throws AppErrors for controller
 * -------------------------------------------------------------------------- */
import AppErrors from "../../utils/AppErrors.js";
import { inventoryRepo } from "../../repo/Sales/inventory.repo.js";

export const inventoryService = {
  async create(data) {
    return inventoryRepo.create(data);
  },

  async findAll() {
    return inventoryRepo.findAll();
  },

  async findById(id) {
    const inventory = await inventoryRepo.findById(id);
    if (!inventory) throw AppErrors.notFound("Inventory not found / المخزون غير موجود");
    return inventory;
  },

  async update(id, data) {
    const inventory = await inventoryRepo.update(id, data);
    if (!inventory) throw AppErrors.notFound("Inventory not found / المخزون غير موجود");
    return inventory;
  },

  async delete(id) {
    const inventory = await inventoryRepo.softDelete(id);
    if (!inventory) throw AppErrors.notFound("Inventory not found / المخزون غير موجود");
    return inventory;
  },

  async checkStock(productId, variant, quantity) {
    const inventory = await inventoryRepo.findByProductAndVariant(productId, variant);
    if (!inventory) throw AppErrors.notFound("Inventory not found for this product variant / المخزون غير موجود لهذا المنتج");
    if (inventory.quantity < quantity) throw AppErrors.badRequest("Insufficient stock / الكمية المطلوبة غير متوفرة");
    return true;
  },

  async reduceStock(productId, variant, quantity) {
    const inventory = await inventoryRepo.findByProductAndVariant(productId, variant);
    if (!inventory) throw AppErrors.notFound("Inventory not found for this product variant / المخزون غير موجود لهذا المنتج");
    if (inventory.quantity < quantity) throw AppErrors.badRequest("Insufficient stock / الكمية المطلوبة غير متوفرة");

    inventory.quantity -= quantity;
    return inventory.save();
  }
};
