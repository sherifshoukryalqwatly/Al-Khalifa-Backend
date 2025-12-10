import asyncWrapper from "../../utils/asyncHandler.js";
import { bannerService } from "../../services/System/banner.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import { auditLogService } from "../../services/System/auditlog.service.js";

// Helper for audit logging
const logAction = async ({ req, action, targetModel, targetId, description }) => {
  await auditLogService.createLog({
    user: req.user?.id || null,
    action,
    targetModel,
    targetId,
    description,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
};

export const bannerController = {
  create: asyncWrapper(async (req, res) => {
    if (!req.file) {
      return appResponses.badRequest(res, "Banner image is required / الصورة مطلوبة");
    }

    const uploadedImage = await uploadToCloudinary(req.file, "Banner");

    const bannerData = {
      title: {
        en: req.body["title.en"],
        ar: req.body["title.ar"]
      },
      subtitle: {
        en: req.body["subtitle.en"] || "",
        ar: req.body["subtitle.ar"] || ""
      },
      image: uploadedImage.secure_url,
      link: req.body.link || null,
      displayOrder: req.body.displayOrder || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    };

    const banner = await bannerService.create(bannerData, req.user);

    await logAction({
      req,
      action: "CREATE",
      targetModel: "Banner",
      targetId: banner._id,
      description: `Created banner: ${banner.title.en || "No title"}`
    });

    return appResponses.success(res, banner, "Banner created successfully / تم إنشاء البانر بنجاح");
  }),

  findAll: asyncWrapper(async (req, res) => {
    const banners = await bannerService.findAll();

    await logAction({
      req,
      action: "READ",
      targetModel: "Banner",
      description: `Fetched all banners (count: ${banners.length})`
    });

    return appResponses.success(res, banners, "Banners fetched successfully / تم جلب البانرات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const banner = await bannerService.findById(req.params.id);

    await logAction({
      req,
      action: "READ",
      targetModel: "Banner",
      targetId: banner._id,
      description: `Fetched banner by ID`
    });

    return appResponses.success(res, banner, "Banner fetched successfully / تم جلب البانر بنجاح");
  }),

  update: asyncWrapper(async (req, res) => {
    const updatedData = {
      ...req.body,
      title: req.body["title"] ? { en: req.body["title.en"], ar: req.body["title.ar"] } : undefined,
      subtitle: req.body["subtitle"] ? { en: req.body["subtitle.en"], ar: req.body["subtitle.ar"] } : undefined
    };

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file, "Banner");
      updatedData.image = uploadedImage.secure_url;
    }

    const banner = await bannerService.update(req.params.id, updatedData, req.user);

    await logAction({
      req,
      action: "UPDATE",
      targetModel: "Banner",
      targetId: banner._id,
      description: `Updated banner: ${banner.title.en || "No title"}`
    });

    return appResponses.success(res, banner, "Banner updated successfully / تم تحديث البانر بنجاح");
  }),

  delete: asyncWrapper(async (req, res) => {
    const banner = await bannerService.delete(req.params.id, req.user);

    await logAction({
      req,
      action: "DELETE",
      targetModel: "Banner",
      targetId: banner._id,
      description: `Deleted banner: ${banner.title.en || "No title"}`
    });

    return appResponses.success(res, banner, "Banner deleted successfully / تم حذف البانر بنجاح");
  })
};
