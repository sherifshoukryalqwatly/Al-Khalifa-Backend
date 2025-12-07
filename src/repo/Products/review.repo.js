import Review from "../../models/Products/review.model.js";

export const reviewRepo = {

  // Create a new review
  create: async (data) => Review.create(data),

  // Find a review by its ID, populating user and product details
  findById: async (id) => Review.findById(id).populate("user product"),

  // Find all reviews with optional filter, pagination, and sorting
  findAll: async (filter = {}, options = {}) =>
    Review.find(filter)
      .populate("user product")
      .skip(options.skip || 0)
      .limit(options.limit || 0)
      .sort(options.sort || { createdAt: -1 }),

  // Update a review by ID with validation
  updateById: async (id, data) =>
    Review.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  // Soft delete a review by marking isDeleted and setting deletedAt
  deleteById: async (id) =>
    Review.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    ),

  // Check if a user already reviewed a specific product
  findByUserAndProduct: async (userId, productId) =>
    Review.findOne({ user: userId, product: productId }),
};
