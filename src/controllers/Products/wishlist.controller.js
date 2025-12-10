import { wishlistService } from "../../services/Products/wishlist.service.js";
import asyncWrapper from "../../utils/asyncHandler.js";
import { appResponses } from "../../utils/AppResponses.js";
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

export const wishlistController = {

  // Create wishlist for authenticated user
  create: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const wishlist = await wishlistService.create(userId);

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Wishlist',
      targetId: wishlist._id,
      description: `Created wishlist for user ${userId}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Wishlist',
      targetId: wishlist?._id,
      description: `Fetched wishlist for user ${userId}`
    });

    return appResponses.success(res, { wishlist });
  }),

  // Add products to wishlist
  addProducts: asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const { products } = req.body;
    const wishlist = await wishlistService.addProducts(userId, products);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Wishlist',
      targetId: wishlist._id,
      description: `Added products [${products.join(", ")}] to wishlist for user ${userId}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Wishlist',
      targetId: wishlist._id,
      description: `Removed products [${products.join(", ")}] from wishlist for user ${userId}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Wishlist',
      targetId: wishlist._id,
      description: `Deleted wishlist for user ${userId}`
    });

    return appResponses.success(
      res,
      { wishlist },
      "Wishlist deleted successfully / تم حذف قائمة الرغبات"
    );
  }),
};
