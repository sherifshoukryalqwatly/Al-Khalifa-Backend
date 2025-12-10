import asyncWrapper from "../../utils/asyncHandler.js";
import { orderService } from "../../services/Sales/order.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper to log audit actions
const logAction = async ({ req, user, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: user?._id || user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null
  });
};

export const orderController = {

  /* -------------------------------
     CREATE ORDER
  -------------------------------- */
  createOrder: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const orderData = { ...req.body, user: userId };
    const order = await orderService.createOrder(orderData);

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Order',
      targetId: order._id,
      description: `Created order with total: ${order.totalAmount}`
    });

    return appResponses.success(res, order, "Order created successfully / تم إنشاء الطلب بنجاح", StatusCodes.CREATED);
  }),

  /* -------------------------------
     GET ORDER BY ID
  -------------------------------- */
  getOrderById: asyncWrapper(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Order',
      targetId: order._id,
      description: `Fetched order by ID`
    });

    return appResponses.success(res, order, "Order fetched successfully / تم جلب الطلب بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     GET ORDERS OF LOGGED-IN USER
  -------------------------------- */
  getMyOrders: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const orders = await orderService.getOrdersByUser(userId);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Order',
      description: `Fetched all orders for logged-in user (count: ${orders.length})`
    });

    return appResponses.success(res, orders, "Your orders fetched successfully / تم جلب طلباتك بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     UPDATE ORDER
  -------------------------------- */
  updateOrder: asyncWrapper(async (req, res) => {
    const updated = await orderService.updateOrder(req.params.id, req.body);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Order',
      targetId: updated._id,
      description: `Updated order with total: ${updated.totalAmount}`
    });

    return appResponses.success(res, updated, "Order updated successfully / تم تحديث الطلب بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     DELETE ORDER
  -------------------------------- */
  deleteOrder: asyncWrapper(async (req, res) => {
    const deleted = await orderService.deleteOrder(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Order',
      targetId: deleted._id,
      description: `Deleted order with total: ${deleted.totalAmount}`
    });

    return appResponses.success(res, deleted, "Order deleted successfully / تم حذف الطلب بنجاح", StatusCodes.OK);
  }),

  /* -------------------------------
     LIST ALL ORDERS
  -------------------------------- */
  listOrders: asyncWrapper(async (req, res) => {
    const orders = await orderService.listOrders();

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Order',
      description: `Fetched all orders (count: ${orders.length})`
    });

    return appResponses.success(res, orders, "Orders fetched successfully / تم جلب جميع الطلبات بنجاح", StatusCodes.OK);
  })
};
