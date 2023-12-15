import getDate from "@/utils/getDate";
import getTime from "@/utils/getTime";
import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wpm: {
      type: Number,
      required: true,
    },
    raw: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    correct: {
      type: Number,
      required: true,
    },
    incorrect: {
      type: Number,
      required: true,
    },
    missed: {
      type: Number,
      required: true,
    },
    extra: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    wpmEachSecond: {
      type: [Number],
      required: true,
    },
    rawWpmEachSecond: {
      type: [Number],
      required: true,
    },
    errorsEachSecond: {
      type: [Number],
      required: true,
    },
    mode: {
      name: {
        type: String,
        required: true,
      },
      category: {
        type: Number,
        required: true,
      },
    },
    language: {
      type: String,
      required: true,
    },
    isPersonalBest: {
      type: Boolean,
      required: true,
    },
    date: {
      type: String,
      required: true,
      default: getDate,
    },
    time: {
      type: String,
      required: true,
      default: getTime,
    },
  },
  {
    timestamps: true,
  }
);

export const Test = mongoose.models.Test || mongoose.model("Test", testSchema);
