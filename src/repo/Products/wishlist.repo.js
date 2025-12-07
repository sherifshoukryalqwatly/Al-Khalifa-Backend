import Wishlist from "../../models/Products/wishlist.model.js";

export const wishlistRepo = {
  // Create a new wishlist for a user
  create: async (data) => Wishlist.create(data),

  // Find wishlist by ID
  findById: async (id) => Wishlist.findById(id).populate("user products"),

  // Find wishlist by user ID
  findByUser: async (userId) => Wishlist.findOne({ user: userId }).populate("products"),

  // Add products to user's wishlist
  addProducts: async (userId, productIds) =>
    Wishlist.findOneAndUpdate(
      { user: userId },
      { $addToSet: { products: { $each: productIds } } },
      { new: true, runValidators: true }
    ),

  // Remove products from user's wishlist
  removeProducts: async (userId, productIds) =>
    Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { $in: productIds } } },
      { new: true }
    ),

  // Soft delete wishlist
  deleteByUser: async (userId) =>
    Wishlist.findOneAndUpdate(
      { user: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    ),
};
