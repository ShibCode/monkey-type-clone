import mongoose from "mongoose";

// const user = {
//   username: "Shibet",
//   email: "shoaibafzaal1234@gmail.com",
//   password: "sevensis2007",
//   testHistory: [
//     { raw, wpm, acc, time, characters: { correct, incorrect, missed, extra } },
//   ],
// };

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    testHistory: {
      type: Array,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
