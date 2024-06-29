import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minLenght: 8},
  role: { type: String, enum: ["user", "admin"], default: "user"},
}, 
{
  toJSON: {
    transform: function (doc, ret) {
      delete ret.__v;
      delete ret._id;
      delete ret.password;
    },
  }
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return  next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

userSchema.index({ userId: 1, email: 1});

const User = mongoose.model("User", userSchema);

export default User;