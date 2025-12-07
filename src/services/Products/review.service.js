// src/modules/review/review.service.js
import { reviewRepo } from "../../repo/Products/review.repo.js";
import AppErrors from "../../utils/AppErrors.js";

export const reviewService = {

  // Create review, ensuring one review per user per product
  create: async (data) => {
    const existing = await reviewRepo.findByUserAndProduct(data.user, data.product);
    if (existing) {
      throw AppErrors.conflict(
        "You have already reviewed this product / لقد قمت بتقييم هذا المنتج بالفعل"
      );
    }
    return reviewRepo.create(data);
  },

  // Get all reviews
  findAll: async (filter = {}, options = {}) => reviewRepo.findAll(filter, options),

  // Get review by ID
  findById: async (id) => {
    const review = await reviewRepo.findById(id);
    if (!review) throw AppErrors.notFound("Review not found / التقييم غير موجود");
    return review;
  },

  // Update review
  update: async (id, data) => {
    const updated = await reviewRepo.updateById(id, data);
    if (!updated) throw AppErrors.notFound("Review not found / التقييم غير موجود");
    return updated;
  },

  // Soft delete review
  remove: async (id) => {
    const deleted = await reviewRepo.deleteById(id);
    if (!deleted) throw AppErrors.notFound("Review not found / التقييم غير موجود");
    return deleted;
  },
};
