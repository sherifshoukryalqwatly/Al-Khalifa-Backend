import mongoose from "mongoose";

/* ----------------------------- Localization Schema ----------------------------- */
function createLocalizedStringSchema(min = 2, max = 500, required = true) {
  return new mongoose.Schema(
    {
      ar: {
        type: String,
        trim: true,
        required: required ? [true, `النص العربي مطلوب`] : false,
        minlength: [min, `النص العربي يجب ألا يقل عن ${min} أحرف`],
        maxlength: [max, `النص العربي يجب ألا يزيد عن ${max} أحرف`],
      },
      en: {
        type: String,
        trim: true,
        required: required ? [true, "English text is required"] : false,
        minlength: [min, `Text must be at least ${min} characters`],
        maxlength: [max, `Text must not exceed ${max} characters`],
      },
    },
    { _id: false }
  );
}

/* ----------------------------- Variant Schema ----------------------------- */
const VariantSchema = new mongoose.Schema(
  {
    size: { type: String, required: [true, "Size Required"] },
    color: { type: String, required: [true, "Color Required"] },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
  },
  { _id: false }
);

/* ----------------------------- Product Schema ----------------------------- */
const ProductSchema = new mongoose.Schema(
  {
    title: createLocalizedStringSchema(3, 200),
    description: createLocalizedStringSchema(5, 500),

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is Required / الفئة مطلوبة"],
    },

    brand: {
      type: String,
      required: [true, "Brand is Required / الماركة مطلوبة"],
    },

    price: {
      type: Number,
      required: [true, "Price is Required / السعر مطلوب"],
      min: [0, "Price must be positive"],
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    images: {
      type: [String],
      required: [true, "Images Array Required / مصفوفة الصور مطلوبة"],
    },

    variants: {
      type: [VariantSchema],
      default: [],
    },

    material: { type: String, default: null },

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: [true, "Gender is Required / النوع مطلوب"],
    },

    sportType: {
      type: [String], // football, basketball, gym, running...
      default: [],
    },

    isFeatured: { type: Boolean, default: false },

    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    ratingsCount: {
      type: Number,
      default: 0,
    },
    isApproved: {type: Boolean, default: false},

    sold: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

/* ----------------------------- Virtual: finalPrice ----------------------------- */
ProductSchema.virtual("finalPrice").get(function () {
  if (this.discount > 0) {
    return Number((this.price - (this.price * this.discount) / 100).toFixed(2));
  }
  return this.price;
});

/* ----------------------------- Full Text Search Index ----------------------------- */
ProductSchema.index({
  "title.en": "text",
  "title.ar": "text",
  "description.en": "text",
  "description.ar": "text",
  brand: "text",
  sportType: "text",
});

/* ----------------------------- Soft Delete Middleware ----------------------------- */
// For find, findOne, etc.
ProductSchema.pre(/^find/, function() {
  this.where({ isDeleted: false });
});

ProductSchema.pre('aggregate', function() {
  // Insert a $match stage at the beginning
  this.pipeline().unshift({ $match: { isDeleted: false } });
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
