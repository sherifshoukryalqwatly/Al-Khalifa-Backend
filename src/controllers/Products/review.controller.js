import { reviewService } from "../../services/Products/review.service.js";
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

    await logAction({
      req,
      user: req.user,
      action: 'CREATE',
      targetModel: 'Review',
      targetId: review._id,
      description: `Created review for product ${review.product} by user ${userId}`
    });

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

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Review',
      description: `Fetched all reviews (count: ${reviews.length})`
    });

    return appResponses.success(res, { reviews });
  }),

  // Get review by ID
  findById: asyncWrapper(async (req, res) => {
    const review = await reviewService.findById(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'READ',
      targetModel: 'Review',
      targetId: review._id,
      description: `Fetched review ${review._id} for product ${review.product}`
    });

    return appResponses.success(res, { review });
  }),

  // Update review
  update: asyncWrapper(async (req, res) => {
    const updated = await reviewService.update(req.params.id, req.body);

    await logAction({
      req,
      user: req.user,
      action: 'UPDATE',
      targetModel: 'Review',
      targetId: updated._id,
      description: `Updated review ${updated._id} for product ${updated.product}`
    });

    return appResponses.success(
      res,
      { updated },
      "Review updated successfully / تم تحديث التقييم بنجاح"
    );
  }),

  // Soft delete review
  remove: asyncWrapper(async (req, res) => {
    const deleted = await reviewService.remove(req.params.id);

    await logAction({
      req,
      user: req.user,
      action: 'DELETE',
      targetModel: 'Review',
      targetId: deleted._id,
      description: `Deleted review ${deleted._id} for product ${deleted.product}`
    });

    return appResponses.success(
      res,
      { deleted },
      "Review deleted successfully / تم حذف التقييم بنجاح"
    );
  }),
};
