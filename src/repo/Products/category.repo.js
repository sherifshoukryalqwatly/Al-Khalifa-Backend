import Category from "../../models/Products/category.model.js";

export const categoryRepo = {
  /* -------------------------------------------------------
     CREATE
  ---------------------------------------------------------*/
  create:async (data) =>await Category.create(data),

  /* -------------------------------------------------------
     FIND
  ---------------------------------------------------------*/
  findAll:async (filter = {}) =>
    await Category.find({ isDeleted: false, ...filter }).sort({ createdAt: -1 }),

  findById:async (id) =>
    await Category.findOne({ _id: id, isDeleted: false }),

  findBySlug:async (slug) =>
    await Category.findOne({
      $or: [{ "slug.en": slug }, { "slug.ar": slug }],
      isDeleted: false
    }),

  findByName:async (title) =>
    await Category.findOne({
      $or: [{ "name.en": title }, { "name.ar": title }],
      isDeleted: false
    }),

  /* -------------------------------------------------------
     UPDATE
  ---------------------------------------------------------*/
  updateById:async (id, data) =>
    await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }),

  /* -------------------------------------------------------
     SOFT DELETE
  ---------------------------------------------------------*/
  softDelete:async (id, deletedBy = null) =>
    await Category.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
      },
      { new: true }
    ),
};
