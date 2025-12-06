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
  loginMethods: {
    type: [String],
    enum: ["local", "google", "facebook"],
    default: ["local"],
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is Required / الاسم مطلوب'],
    minlength: [2, `Text must be at least two characters long / الاسم يجب على الاقل حرفين `],
    maxlength: [100, `Text must not exceed 100 characters / الاسم يجب على الاكثر 100 حرف `],
  },
  email: {
    type:String,
    required:[true,"Email is Required / البريد الالكترونى مطلوب"],
    unique: [true,"Already Registered / مسجل بالفعل"],
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
          !this.faceBookid 
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
          !this.faceBookid 
        );
      },
      "Phone number is required / رقم الهاتف مطلوب",
    ],
    unique: [true, "Phone number must be unique / يجب أن يكون رقم الهاتف فريدًا"],
    sparse: true
  },
  role: {
    type: String,
    enum: {
      values: ["SUPER_ADMIN","USER", "ADMIN"],
      message: "{VALUE} is not supported / {VALUE} غير مدعوم",
    },
    default: "USER",
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
function safeDecryptRSA(value) {
  if (!value) return null; // skip undefined
  if (!/^[A-Za-z0-9+/=]+$/.test(value)) return value; // only Base64
  try { 
      return decryptRSA(value); 
  } catch (err) { 
      console.warn("Failed to decrypt phonenumber:", err.message); 
      return value; 
  }
}

const userSchema = new mongoose.Schema(userData, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            ret.phonenumber = safeDecryptRSA(ret.phonenumber);

            delete ret._id;
            delete ret.__v;
            delete ret.password;
            delete ret.googleid;
            delete ret.faceBookid;

            return ret;
        },
    },
});


// 🔒 Hash password before saving
userSchema.pre("save",async function () {
  if (!this.isModified("password") || !this.password) return ;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Password hashed:", this.password);
    if (this.phonenumber)
      this.phonenumber = encryptRSA(this.phonenumber);
  } catch (err) {
    throw err;
  }
});

const User = mongoose.model('User',userSchema);

export default User;