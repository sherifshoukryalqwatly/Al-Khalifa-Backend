import Product from "../../models/Products/product.model.js";

/* -------------------------------------------------------
   CREATE PRODUCT
---------------------------------------------------------*/
export const create = async (data) => {
  const product = new Product(data);
  return await product.save();
};

/* -------------------------------------------------------
   FIND BY ID
---------------------------------------------------------*/
export const findById = async (id) => {
  return await Product.findById(id);
};

/* -------------------------------------------------------
   FIND BY TITLE (EN or AR)
---------------------------------------------------------*/
export const findByTitle = async (title) => {
  return await Product.findOne({
    $or: [
      { "title.en": title },
      { "title.ar": title }
    ]
  });
};

/* -------------------------------------------------------
   FIND ALL WITH FILTERS + SORT + PAGINATION
---------------------------------------------------------*/
export const findAll = async (filters, sort, pagination) => {
  const [products, total] = await Promise.all([
    Product.find(filters)
      .sort(sort)
      .limit(pagination.limit)
      .skip(pagination.skip),

    Product.countDocuments(filters),
  ]);

  return { products, total };
};

/* -------------------------------------------------------
   UPDATE PRODUCT
---------------------------------------------------------*/
export const update = async (id, newData) => {
  return await Product.findByIdAndUpdate(id, newData, {
    new: true,
    runValidators: true,
  });
};

/* -------------------------------------------------------
   HARD DELETE
---------------------------------------------------------*/
export const hRemove = async (id) => {
  return await Product.findByIdAndDelete(id);
};

/* -------------------------------------------------------
   SOFT DELETE
---------------------------------------------------------*/
export const remove = async (id, adminId) => {
  return await Product.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: adminId || null,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

/* -------------------------------------------------------
   HARD DELETE MANY
---------------------------------------------------------*/
export const hRemoveAll = async (ids) => {
  return await Product.deleteMany({ _id: { $in: ids } });
};

/* -------------------------------------------------------
   SOFT DELETE MANY
---------------------------------------------------------*/
export const removeAll = async (ids, adminId) => {
  return await Product.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: adminId || null,
      },
    },
    { runValidators: true }
  );
};
