// ==========================================
// 🔹 CART CONTROLLER — HTTP LAYER
// ==========================================
import asyncWrapper from "../../utils/asyncHandler.js";
import { cartService } from "../../services/Sales/cart.service.js";
import { appResponses } from "../../utils/AppResponses.js"
import { StatusCodes } from "../../utils/constants.js";

export const cartController = {

  /* -------------------------------
     GET USER CART
  -------------------------------- */
  getCart: asyncWrapper(async (req, res) => {
    const cart = await cartService.getCart(req.user._id);

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

    return appResponses.success(
      res,
      {},
      "Cart cleared successfully / تم تنظيف السله بنجاح",
      StatusCodes.OK
    );
  }),
};
