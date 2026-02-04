import mongoose from "mongoose";
import bcrypt from "bcrypt";
const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    remember_token: {
      type: String,
      default: null,
    },
    email_verified_at: {
      type: Date,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    google_id: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    verification_token: {
      type: String,
      default: null,
    },
    reset_password_token: String,
    reset_password_expire: Date,
    verification_token_expire: Date,
  },
  { timestamps: true }
);

user_schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

user_schema.methods.compare_password = async function (password) {
  return await bcrypt.compare(password, this.password);
};
user_schema.methods.verify_email = async function () {
  this.is_verified = true;
  this.email_verified_at = new Date();
  this.verification_token = null;
};
const User = mongoose.models.User || mongoose.model("User", user_schema);
export default User;
