import { reviewService } from "../../services/Products/review.service.js";
import asyncWrapper from "../../utils/asyncHandler.js";
import { appResponses } from "../../utils/AppResponses.js";
import { StatusCodes } from "../../utils/constants.js";

export const reviewController = {

  // Create a new review
    create: asyncWrapper(async (req, res) => {
    // Get authenticated user's ID from the request
    const userId = req.user._id;
    console.log("Authenticated user ID:", userId);

    // Merge user ID with request body
    const reviewData = { ...req.body, user: userId };

    // Call the service to create the review
    const review = await reviewService.create(reviewData);

    // Return standardized success response
    return appResponses.success(
        res,
        { review },
        "Review created successfully / تم إنشاء التقييم بنجاح",
        StatusCodes.CREATED
    );
    }),


  // Get all reviews
  findAll: asyncWrapper(async (req, res) => {
    const reviews = await reviewService.findAll();
    return appResponses.success(res, { reviews });
  }),

  // Get review by ID
  findById: asyncWrapper(async (req, res) => {
    const review = await reviewService.findById(req.params.id);
    return appResponses.success(res, { review });
  }),

  // Update review
  update: asyncWrapper(async (req, res) => {
    const updated = await reviewService.update(req.params.id, req.body);
    return appResponses.success(
      res,
      { updated },
      "Review updated successfully / تم تحديث التقييم بنجاح"
    );
  }),

  // Soft delete review
  remove: asyncWrapper(async (req, res) => {
    const deleted = await reviewService.remove(req.params.id);
    return appResponses.success(
      res,
      { deleted },
      "Review deleted successfully / تم حذف التقييم بنجاح"
    );
  }),
};
