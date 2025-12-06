import mongoose from "mongoose";

/* ----------------------------- Localization Schema ----------------------------- */
function createLocalizedStringSchema(min = 2, max = 500, required = true) {
  return new mongoose.Schema(
    {
      ar: {
        type: String,
        trim: true,
        required: required ? [true, `النص العربي مطلوب`] : false,
        minlength: [min, `النص العربي يجب أن لا يقل عن ${min} أحرف`],
        maxlength: [max, `النص العربي يجب أن لا يزيد عن ${max} أحرف`],
      },
      en: {
        type: String,
        trim: true,
        required: required ? [true, `English text is required`] : false,
        minlength: [min, `Text must be at least ${min} characters long`],
        maxlength: [max, `Text must not exceed ${max} characters`],
      },
    },
    { _id: false }
  );
}

const VariantSchema = new mongoose.Schema({
  size: { type: String, required: true },     // S, M, L, XL
  color: { type: String, required: true },    // Red, Blue, Black
  stock: { type: Number, default: 0 },        // Track inventory
  sku: { type: String, unique: true }         // Optional SKU
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title:  createLocalizedStringSchema(3,200),

  description: createLocalizedStringSchema(5,500),

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true,'Category is Required / الفئه مطلوبه']
  },

  brand: { type: String, required: [true,"Brand is Required / الماركه مطلوبه"] },

  price: {
    type: Number,
    required: [true,'Price is Required / السعر مطلوب'],
    min: 0
  },

  discount: {
    type: Number,
    default: 0,         // percentage: 10 = 10%
    min: 0,
    max: 100
  },

  images: {
    type: [String],     // array of image URLs
    required: [true,'Array of Images Required / مصفوفه من الصور مطلوبه']
  },

  variants: {
    type: [VariantSchema],
    default: []
  },

  material: {
    type: String,       // e.g., Polyester, Cotton
    default: null
  },

  gender: {
    type: String,
    enum: ["male", "female", "unisex"],
    required: [true,'Gender is Required / النوع مطلوب']
  },

  sportType: [
    {
      type: String,     // football, gym, running, basketball...
    }
  ],

  isFeatured: { type: Boolean, default: false },

  ratingsAverage: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  ratingsCount: {
    type: Number,
    default: 0
  },

  sold: { type: Number, default: 0 },

  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },

}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
