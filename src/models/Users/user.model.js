import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { decryptRSA, encryptRSA } from "../../utils/bcrypt.js";
import { globalRegex } from "../../utils/constants.js";

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
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Fitst Name is Required / الاسم الاول مطلوب'],
    minlength: [2, `Fitst Name must be at least two characters long / الاسم الاول يجب على الاقل حرفين `],
    maxlength: [100, `Fitst Name must not exceed 100 characters / الاسم الاول يجب على الاكثر 100 حرف `],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is Required / الاسم الاخير مطلوب'],
    minlength: [2, `Last Name must be at least two characters long / الاسم الاخير يجب على الاقل حرفين `],
    maxlength: [100, `Last Name must not exceed 100 characters / الاسم الاخير يجب على الاكثر 100 حرف `],
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
        return !this.googleid && !this.faceBookid;
      },
      "Password is required / الرقم السري مطلوب",
    ],
    validate: [
      {
        validator: function (value) {
          // Skip validation for social logins
          if (this.googleid || this.faceBookid) return true;

          if (!value) return false; // required for local users
          return value.length >= 6 && value.length <= 100;
        },
        message: "Password must be between 6 and 100 characters / كلمة المرور يجب أن تكون بين 6 و 100 حرف",
      },
      {
        validator: function (value) {
          // Skip validation for social logins
          if (this.googleid || this.faceBookid) return true;

          if (!value) return false;
          return globalRegex.passwordRegex.test(value);
        },
        message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character / كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد وحرف خاص واحد",
      },
    ],
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
  otp:{
    type:Number,
    default:null
  },
  otpExpiry:{
    type:Date,
    default:null
  },
  resetPasswordToken: String,
  resetPasswordExpiry: Date,
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