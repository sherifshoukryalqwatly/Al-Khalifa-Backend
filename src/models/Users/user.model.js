import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { decryptRSA, encryptRSA } from "../../utils/bcrypt.js";
import { globalRegex } from "../../utils/constants.js";

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
/* ----------------------------- User Schema ----------------------------- */
const userData = {
  faceBookid: {
    type: String,
    unique: [
      true,
      "Facebook ID must be unique / يجب أن يكون معرف فيسبوك فريدًا",
    ],
    sparse: true,
  },
  googleid: {
    type: String,
    unique: [true, "Google ID must be unique / يجب أن يكون معرف جوجل فريدًا"],
    sparse: true,
  },
  twitterid: {
    type: String,
    unique: [true, "Twitter ID must be unique / يجب أن يكون معرف تويتر فريدًا"],
    sparse: true,
  },
  loginMethods: {
    type: [String],
    enum: ["local", "google", "facebook", "twitter"],
    default: ["local"],
  },
  name: createLocalizedStringSchema(2,50,true),
  email: {
    type:String,
    required:[true,"Email is Required / البريد الالكترونى مطلوب"],
    uniqe: [true,"Email must be unique / يجب أن يكون البريد الإلكتروني فريدًا"],
    lowercase: true,
    validate: {
      validator: function (value) {
        return globalRegex.emailRegex.test(value);
      },
      message: (props) =>
        `"${props.value}" is not a valid email address / "${props.value}" ليس عنوان بريد إلكتروني صالح`,
    },
  },
  password: {
    type: String,
    required: [
      function () {
        return (
          !this.googleid &&
          !this.faceBookid &&
          !this.twitterid
        );
      },
      "Password is required / الرقم السري مطلوب",
    ],
    minLength: [
      6,
      "Password must be at least 6 characters / كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    ],
    maxLength: [
      100,
      "Password must be at most 100 characters / كلمة المرور يجب أن تكون 100 حرف كحد أقصى",
    ],
    validate: {
      validator: function (value) {
        if (!value) return true; // skip validation for social logins
        return globalRegex.passwordRegex.test(
          value
        );
      },
      message: (props) =>
        ` ${props.value} Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character / ${props.value} يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد وحرف خاص واحد`,
    },
  },
  phonenumber: {
    type: String,
    required: [
      function () {
        return (
          !this.googleid &&
          !this.faceBookid &&
          !this.twitterid
        );
      },
      "Phone number is required / رقم الهاتف مطلوب",
    ],
    unique: [true, "Phone number must be unique / يجب أن يكون رقم الهاتف فريدًا"],
    sparse: true,
    validate: {
      validator: function (value) {
        if (!value) return true; // skip validation for social logins
        return globalRegex.phoneRegex.test(value);
      },
      message: (props) =>
        `"${props.value}" is not a valid phone number / "${props.value}" ليس رقم هاتف صالح`,
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "{VALUE} is not supported / {VALUE} غير مدعوم",
    },
    default: "user",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },

  isVerify: {
    type: Boolean,
    default: false,
  },
}
const userSchema = new mongoose.Schema(userData,{
  timestamps:true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id;
      ret.phonenumber = decryptRSA(ret.phonenumber);
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      delete ret.googleid;
      delete ret.faceBookid;
      delete ret.twitterid;
      return ret;
    },
  },
});

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed:", this.password);
    if (this.phonenumber)
      this.phonenumber = encryptRSA(this.phonenumber);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User',userSchema);

export default User;