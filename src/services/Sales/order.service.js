// ==========================================
// 🔹 ORDER SERVICE — BUSINESS LOGIC
// ==========================================
import { orderRepo } from "../../repo/Sales/order.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const orderService = {

  /* -------------------------------
     CREATE NEW ORDER
  -------------------------------- */
  async createOrder(data) {
    return orderRepo.create(data);
  },

  /* -------------------------------
     GET ORDER BY ID
  -------------------------------- */
  async getOrderById(id) {
    const order = await orderRepo.findById(id);
    if (!order) throw AppErrors.notFound("Order not found / الطلب غير موجود");
    return order;
  },

  /* -------------------------------
     GET ORDERS OF LOGGED-IN USER
  -------------------------------- */
  async getOrdersByUser(userId) {
    return orderRepo.findByUser(userId);
  },

  /* -------------------------------
     UPDATE ORDER STATUS OR INFO
  -------------------------------- */
  async updateOrder(id, update) {
    const updated = await orderRepo.updateById(id, update);
    if (!updated) throw AppErrors.notFound("Order not found / الطلب غير موجود");
    return updated;
  },

  /* -------------------------------
     DELETE ORDER
  -------------------------------- */
  async deleteOrder(id) {
    const deleted = await orderRepo.removeById(id);
    if (!deleted) throw AppErrors.notFound("Order not found / الطلب غير موجود");
    return deleted;
  },

  /* -------------------------------
     LIST ALL ORDERS
  -------------------------------- */
  async listOrders(filter = {}) {
    return orderRepo.findAll(filter);
  }
};
