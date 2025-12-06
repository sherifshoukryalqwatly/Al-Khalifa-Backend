import mongoose from "mongoose";

const addressSchema = new mongoose.Schema( {
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true,"Client ID is Required / الرقم المخصص للعميل مطلوب"]
    },
    address: {
        country: {
            type: String,
            required: [true, "Country is required / البلد مطلوب"],
            minLength: [2, "Country must be at least 2 characters / يجب أن يكون البلد 2 حرفًا على الأقل"],
            maxLength: [50, "Country must be at most 50 characters / يجب أن يكون البلد 50 حرفًا كحد أقصى"],
        },
        city: {
            type: String,
            required: [true, "City is required / المدينة مطلوبة"],
            minLength: [2, "City must be at least 2 characters / يجب أن تكون المدينة 2 حرفًا على الأقل"],
            maxLength: [50, "City must be at most 50 characters / يجب أن تكون المدينة 50 حرفًا كحد أقصى"],
        },
        region:{
            type: String,
            required: [true, "Region is required / المنطقه مطلوبة"],
            minLength: [2, "Region must be at least 2 characters / يجب أن تكون المنطقه 2 حرفًا على الأقل"],
            maxLength: [50, "Region must be at most 50 characters / يجب أن تكون المنطقه 50 حرفًا كحد أقصى"],
        },
        street : {
            type: String,
            required: [true, "Street is required / الشارع مطلوب"],
            minLength: [2, "Street must be at least 2 characters / يجب أن تكون الشارع 2 حرفًا على الأقل"],
            maxLength: [150, "Street must be at most 150 characters / يجب أن تكون الشارع 150 حرفًا كحد أقصى"],
        },
        buldingNumber:{
            type:Number,
            required:[true, "Bulding Number is required / رقم المبنى مطلوبة"],
        },
        apartmentNumber:{
            type:Number,
            required:[true, "Apartment Number is required / رقم الشقه مطلوبة"],
        },
        distinctiveMark:{
            type: String,
            minLength: [2, "Distinctive Mark must be at least 2 characters / يجب أن تكون العلامه المميزه 2 حرفًا على الأقل"],
            maxLength: [200, "Distinctive Mark must be at most 200 characters / يجب أن تكون العلامه المميزه 200 حرفًا كحد أقصى"],
        }
    },
  },
  { _id: false }
);
const Address = mongoose.model('Address',addressSchema);
export default Address;