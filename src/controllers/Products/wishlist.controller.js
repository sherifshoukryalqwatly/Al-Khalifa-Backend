import { wishlistService } from "../../services/Products/wishlist.service.js";
import asyncWrapper from "../../utils/asyncHandler.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const wishlistController = {

  // Create wishlist for authenticated user
  create: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await wishlistService.create(userId);
    return appResponses.success(
      res,
      { wishlist },
      "Wishlist created successfully / تم إنشاء قائمة الرغبات بنجاح",
      StatusCodes.CREATED
    );
  }),

  // Get wishlist for authenticated user
  getByUser: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await wishlistService.getByUser(userId);
    return appResponses.success(res, { wishlist });
  }),

  // Add products to wishlist
  addProducts: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const { products } = req.body;
    const wishlist = await wishlistService.addProducts(userId, products);
    return appResponses.success(
      res,
      { wishlist },
      "Products added to wishlist / تم إضافة المنتجات إلى قائمة الرغبات"
    );
  }),

  // Remove products from wishlist
  removeProducts: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const { products } = req.body;
    const wishlist = await wishlistService.removeProducts(userId, products);
    return appResponses.success(
      res,
      { wishlist },
      "Products removed from wishlist / تم إزالة المنتجات من قائمة الرغبات"
    );
  }),

  // Soft delete wishlist
  delete: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await wishlistService.delete(userId);
    return appResponses.success(
      res,
      { wishlist },
      "Wishlist deleted successfully / تم حذف قائمة الرغبات"
    );
  }),
};
