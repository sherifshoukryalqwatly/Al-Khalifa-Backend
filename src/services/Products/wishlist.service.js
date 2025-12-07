import { wishlistRepo } from "../../repo/Products/wishlist.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const wishlistService = {

  // Create wishlist for a user
  create: async (userId) => {
    const existing = await wishlistRepo.findByUser(userId);
    if (existing) {
      throw AppErrors.conflict(
        "Wishlist already exists for this user / قائمة الرغبات موجودة بالفعل لهذا المستخدم"
      );
    }
    return wishlistRepo.create({ user: userId });
  },

  // Get wishlist by user
  getByUser: async (userId) => {
    const wishlist = await wishlistRepo.findByUser(userId);
    if (!wishlist) throw AppErrors.notFound("Wishlist not found / قائمة الرغبات غير موجودة");
    return wishlist;
  },

  // Add products to wishlist
  addProducts: async (userId, productIds) => wishlistRepo.addProducts(userId, productIds),

  // Remove products from wishlist
  removeProducts: async (userId, productIds) => wishlistRepo.removeProducts(userId, productIds),

  // Soft delete wishlist
  delete: async (userId) => wishlistRepo.deleteByUser(userId),
};
