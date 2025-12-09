/* --------------------------------------------------------------------------
 * 🎮 Banner Controller (HTTP Layer)
 * - Handles express req/res
 * - Uploads image to Cloudinary
 * - Delegates logic to service layer
 * -------------------------------------------------------------------------- */

import asyncWrapper from "../../utils/asyncHandler.js";
import { bannerService } from "../../services/System/banner.service.js";
import { appResponses } from "../../utils/AppResponses.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

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
    return appResponses.success(res, banner, "Banner created successfully / تم إنشاء البانر بنجاح");
  }),

  findAll: asyncWrapper(async (req, res) => {
    const banners = await bannerService.findAll();
    return appResponses.success(res, banners, "Banners fetched successfully / تم جلب البانرات بنجاح");
  }),

  findById: asyncWrapper(async (req, res) => {
    const banner = await bannerService.findById(req.params.id);
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
    return appResponses.success(res, banner, "Banner updated successfully / تم تحديث البانر بنجاح");
  }),

  delete: asyncWrapper(async (req, res) => {
    const banner = await bannerService.delete(req.params.id, req.user);
    return appResponses.success(res, banner, "Banner deleted successfully / تم حذف البانر بنجاح");
  })
};
