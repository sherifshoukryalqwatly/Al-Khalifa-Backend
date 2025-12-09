/* --------------------------------------------------------------------------
 * 🗂️ Banner Repository (Database Layer)
 * - ONLY interacts with MongoDB
 * - No business logic, no HTTP handling, no validation
 * - Clean & reusable DB functions
 * -------------------------------------------------------------------------- */

import Banner from "../../models/System/banner.model.js";

export const bannerRepo = {
  create: (data) => Banner.create(data),

  findAll: () =>
    Banner.find({ isDeleted: false }).sort({ displayOrder: 1 }),

  findById: (id) =>
    Banner.findOne({ _id: id, isDeleted: false }),

  update: async (id, data) => {
    return Banner.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true, runValidators: true }
    );
  },

  getBeforeUpdate: (id) =>
    Banner.findOne({ _id: id, isDeleted: false }).lean(),

  softDelete: async (id) =>
    Banner.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    )
};