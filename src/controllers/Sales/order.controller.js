// ==========================================
// 🔹 ORDER CONTROLLER — HTTP RESPONSE LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { orderService } from "../../services/Sales/order.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const orderController = {

  /* -------------------------------
     CREATE ORDER
  -------------------------------- */
  createOrder: asyncWrapper(async (req, res) => {
    // ✅ Get userId from logged-in user
    const userId = req.user._id;
    const orderData = { ...req.body, user: userId };
    const order = await orderService.createOrder(orderData);
    return appResponses.success(res, order, "Order created successfully / تم إنشاء الطلب بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET ORDER BY ID
  -------------------------------- */
  getOrderById: asyncWrapper(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    return appResponses.success(res, order, "Order fetched successfully / تم جلب الطلب بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     GET ORDERS OF LOGGED-IN USER
  -------------------------------- */
  getMyOrders: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const orders = await orderService.getOrdersByUser(userId);
    return appResponses.success(res, orders, "Your orders fetched successfully / تم جلب طلباتك بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     UPDATE ORDER
  -------------------------------- */
  updateOrder: asyncWrapper(async (req, res) => {
    const updated = await orderService.updateOrder(req.params.id, req.body);
    return appResponses.success(res, updated, "Order updated successfully / تم تحديث الطلب بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE ORDER
  -------------------------------- */
  deleteOrder: asyncWrapper(async (req, res) => {
    const deleted = await orderService.deleteOrder(req.params.id);
    return appResponses.success(res, deleted, "Order deleted successfully / تم حذف الطلب بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL ORDERS
  -------------------------------- */
  listOrders: asyncWrapper(async (req, res) => {
    const orders = await orderService.listOrders();
    return appResponses.success(res, orders, "Orders fetched successfully / تم جلب جميع الطلبات بنجاح", StatusCodes.OK);
  })
};
