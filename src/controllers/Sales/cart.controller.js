// ==========================================
// 🔹 CART CONTROLLER — HTTP LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { cartService } from "../../services/Sales/cart.service.js";
import { appResponses } from "../../utils/AppResponses.js"
import { StatusCodes } from "../../utils/constants.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper for audit logs
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

export const cartController = {

  /* -------------------------------
     GET USER CART
  -------------------------------- */
  getCart: asyncWrapper(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Cart',
      targetId: req.user._id,
      description: `Fetched cart for user ${req.user._id}`
    });

    return appResponses.success(
      res,
      cart,
      "Cart fetched successfully / تم جلب السلة بنجاح",
      StatusCodes.OK
    );
  }),

  /* -------------------------------
     ADD ITEM TO CART
  -------------------------------- */
  addItem: asyncWrapper(async (req, res) => {
    const cart = await cartService.addItem(req.user._id, req.body);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Cart',
      targetId: req.user._id,
      description: `Added item ${req.body.productId} to cart`
    });

    return appResponses.success(
      res,
      cart,
      "Item added to cart successfully / تم إضافة العنصر إلى السلة بنجاح",
      StatusCodes.CREATED
    );
  }),

  /* -------------------------------
     REMOVE ITEM
  -------------------------------- */
  removeItem: asyncWrapper(async (req, res) => {
    const { productId } = req.params;
    const { variant } = req.body;

    const cart = await cartService.removeItem(
      req.user._id,
      productId,
      variant
    );

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Cart',
      targetId: req.user._id,
      description: `Removed item ${productId} from cart`
    });

    return appResponses.success(
      res,
      cart,
      "Item removed successfully / تم حذف العنصر بنجاح",
      StatusCodes.OK
    );
  }),

  /* -------------------------------
     CLEAR CART
  -------------------------------- */
  clear: asyncWrapper(async (req, res) => {
    await cartService.clearCart(req.user._id);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Cart',
      targetId: req.user._id,
      description: `Cleared cart for user ${req.user._id}`
    });

    return appResponses.success(
      res,
      {},
      "Cart cleared successfully / تم تنظيف السله بنجاح",
      StatusCodes.OK
    );
  }),
};
