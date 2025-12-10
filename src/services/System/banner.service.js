/* --------------------------------------------------------------------------
 * 🧠 Banner Service (Business Logic Layer)
 * - Handles workflow logic for Banner
 * - Triggers audit logs (with old & new values)
 * -------------------------------------------------------------------------- */

import AppErrors from "../../utils/AppErrors.js";
import { bannerRepo } from "../../repo/System/banner.repo.js";

export const bannerService = {
  /* ----------------------------- Create Banner ----------------------------- */
  async create(data, user) {
    const banner = await bannerRepo.create(data);
    return banner;
  },

  /* ----------------------------- Get All Banners --------------------------- */
  async findAll() {
    return bannerRepo.findAll();
  },

  /* ----------------------------- Get Banner by ID -------------------------- */
  async findById(id) {
    const banner = await bannerRepo.findById(id);
    if (!banner) throw AppErrors.notFound("Banner not found / البانر غير موجود");
    return banner;
  },

  /* -------------------------------- Update -------------------------------- */
  async update(id, data, user) {
    const oldData = await bannerRepo.getBeforeUpdate(id);
    if (!oldData) throw AppErrors.notFound("Banner not found / البانر غير موجود");
    const updatedBanner = await bannerRepo.update(id, data);
    return updatedBanner;
  },

  /* ------------------------------ Soft Delete ------------------------------ */
  async delete(id, user) {
    const oldData = await bannerRepo.getBeforeUpdate(id);
    if (!oldData) throw AppErrors.notFound("Banner not found / البانر غير موجود");
    const deletedBanner = await bannerRepo.softDelete(id);
    return deletedBanner;
  }
};
