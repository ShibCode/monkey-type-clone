import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      { _id: this._id, username: this.username, email: this.email },
      process.env.JWT_SECRET_KEY
    );
  } catch (error) {
    console.log(error);
  }
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);
