/* --------------------------------------------------------------------------
 * 🧠 Shipping Service (Business Logic Layer)
 * - Handles workflow logic
 * - Calls repository methods
 * - Throws AppErrors for controller
 * -------------------------------------------------------------------------- */
import AppErrors from "../../utils/AppErrors.js";
import { shippingRepo } from "../../repo/Sales/shipping.repo.js";

export const shippingService = {
  async create(data) {
    return shippingRepo.create(data);
  },

  async findAll() {
    return shippingRepo.findAll();
  },

  async findById(id) {
    const shipping = await shippingRepo.findById(id);
    if (!shipping) throw AppErrors.notFound("Shipping not found / الشحنة غير موجودة");
    return shipping;
  },

  async update(id, data) {
    const shipping = await shippingRepo.update(id, data);
    if (!shipping) throw AppErrors.notFound("Shipping not found / الشحنة غير موجودة");
    return shipping;
  },

  async delete(id) {
    const shipping = await shippingRepo.softDelete(id);
    if (!shipping) throw AppErrors.notFound("Shipping not found / الشحنة غير موجودة");
    return shipping;
  }
};
