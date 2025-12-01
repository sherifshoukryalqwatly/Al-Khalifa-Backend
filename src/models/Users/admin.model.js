import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { globalRegex } from "../../utils/constants.js";
import { decryptRSA, encryptRSA } from "../../utils/bcrypt.js";

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
/* ----------------------------- Admin Schema ----------------------------- */
const adminSchema = new mongoose.Schema({
    name: createLocalizedStringSchema(3,50,true),
    bio: createLocalizedStringSchema(3,1000,true),
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, "Email is required / البريد الإلكتروني مطلوب"],
        unique: [true ,"Email Must be unique / يجب أن يكون البريد الإلكتروني فريدًا"],
        index: true,
        validate: {
          validator: function(v) {
            return globalRegex.emailRegex.test(v);
          },
          message: "Invalid email format / بريد إلكتروني غير صالح"
        }
      },
    role: {
        type:String,
        enum:["super_admin","admin"],
        default:"admin"
    },
    password:{
        type:String,
        required:[true,"Admin Password is required / الادمن باسورد مطلوب"],
        minlength:[8,"Password must be at least 8 characters long / يجب أن تكون كلمة المرور 8 أحرف على الأقل"],
        maxlength: [128, "Password too long / كلمة المرور طويلة جدًا"],
        select:false,
        validate: {
            validator: (val) => globalRegex.passwordRegex.test(val),
            message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character / يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد وحرف خاص واحد",
        },
    },
    profileImage: {
      type: String,
      required: [true, "Profile image is required / الصورة الشخصية مطلوبة"],
      validate: {
        validator: function(v) {
          // ex : https://res.cloudinary.com/demo/image/upload/sample.jpg
          return globalRegex.profileImageRegex.test(v);
        },
        message: "Invalid image URL format / صيغة رابط الصورة غير صالحة"
      }
    },
    phone: {
        type: String,
        required: [true, "Phone number is required / رقم الهاتف مطلوب"],
        trim: true,
        validate: {
          validator: function(v) {
            return globalRegex.phoneRegex.test(v);
          },
          message: "Invalid phone number / رقم هاتف غير صالح"
        }
      },
    // Settings
    isActive: {
      type: Boolean,
      default: true,
      required: [true, "Active status is required / حالة النشاط مطلوبة"],
    },
},{
    timestamps: true,
    strict: true,
    toJSON: { virtuals: true ,
      transform: (doc, ret) => {
        delete ret.password; // remove password field
        delete ret.role; // remove role field
        delete ret.isActive; // remove isActive field
        delete ret.createdAt;
        delete ret.updatedAt;
        ret.contact.phone = decryptRSA(ret.contact.phone);
        delete ret.__v; // remove version key
        delete ret._id;
        return ret
      },
    },
    toObject: { virtuals: true }
  });

  // 🔹 Indexes for better performance
adminSchema.index({ "email": 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ createdAt: -1 });

adminSchema.pre('save',async function (next){
    if(!this.isModified("password")) return next();
    try {
        const saltRounds = parseInt(process.env.ADMIN_PASSWORD_SALT, 10) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password,salt);
        if(this.contact.phone){
          this.phone = encryptRSA(this.phone);
    }
        next();
    } catch (error) {
        console.error("Password hashing failed:", error);
        next(error);
    }
});

adminSchema.virtual('profileCompletionPercentage').get(function() {
  let completionScore = 0;
  const totalFields = 5;
  
  // Check required fields completion
  if (this.name?.ar && this.name?.en) completionScore += 1;
  if (this.bio?.ar && this.bio?.en) completionScore += 1;
  if (this.profileImage) completionScore += 1;
  if (this.phone) completionScore += 1;
  if (this.email) completionScore += 1;
  
  return Math.round((completionScore / totalFields) * 100);
});

const Admin = mongoose.model('Admin',adminSchema);
export default Admin;