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
/* ----------------------------- Address Schema ----------------------------- */
const AddressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: createLocalizedStringSchema(3,50,true),
    phone: { type: String, required: [true, "Phone Number is Required / رقم الهاتف مطلوب"] },
    country: { type: String, required: [true, "Country is Required / البلد مطلوبه"] },
    city: { type: String, required: [true, "City is Required / المدينه مطلوبه"] },
    state: { type: String },
    street: { type: String, required: [true, "Street is Required / اسم الشارع مطلوب"] },
    postalCode: { type: String },
    isDefault: { type: Boolean, default: false }
},
{ timestamps: true }
);

const Address = mongoose.model('Address',AddressSchema);

export default Address;