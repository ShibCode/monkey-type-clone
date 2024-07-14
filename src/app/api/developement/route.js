import TestStarted from "@/context/TestStarted";
import { Test } from "@/model/test";
import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import { generateTestData } from "./generateTestData";
import { formatTime } from "@/utils/formatTime";
import { model } from "mongoose";

const ranges = [
  "beginner",
  "slow",
  "average",
  "aboveAverage",
  "fast",
  "professional",
  "extremelyFast",
  "worldClass",
];

const userIds = [
  { _id: "657aed4342f88c207ef66e4a" },
  { _id: "6582b6be4d809ac04b2fcb78" },
  { _id: "65898e4821cead63d7fd2eb0" },
  { _id: "668fc2ee6a2a652db68196ff" },
  { _id: "668fc2ee6a2a652db6819706" },
  { _id: "668fc2ee6a2a652db68196fd" },
  { _id: "668fc2ee6a2a652db68196fe" },
  { _id: "668fc2ee6a2a652db6819704" },
  { _id: "668fc2ee6a2a652db6819705" },
  { _id: "668fc2ee6a2a652db6819708" },
  { _id: "668fc2ee6a2a652db6819710" },
  { _id: "668fc2ee6a2a652db6819707" },
  { _id: "668fc2ee6a2a652db6819709" },
  { _id: "668fc2ee6a2a652db681970d" },
  { _id: "668fc2ee6a2a652db681970e" },
  { _id: "668fc2ee6a2a652db6819701" },
  { _id: "668fc2ee6a2a652db6819703" },
  { _id: "668fc2ee6a2a652db681970b" },
  { _id: "668fc2ee6a2a652db681970f" },
  { _id: "668fc2ee6a2a652db6819700" },
  { _id: "668fc2ee6a2a652db6819702" },
  { _id: "668fc2ee6a2a652db681970a" },
  { _id: "668fc2ee6a2a652db681970c" },
  { _id: "66919295629af0f7d7f3709d" },
  { _id: "66929bedaea9588dbe8cd494" },
  { _id: "6692b1895316a6565d093912" },
  { _id: "669382dbc1ac664c5cb8a765" },
  { _id: "6693b2a81f2d71c50ba923bb" },
  { _id: "6693b3cf1f2d71c50ba92400" },
];

// {_id: "6692b1d05316a6565d093922", },
export async function GET() {
  try {
    await dbConnect();

    const start = new Date();

    const data = generateTestData(userIds, 50000);

    // await Test.insertMany(data);

    const timeTaken = new Date() - start;

    return NextResponse.json({ timeTaken, data });
  } catch (e) {
    console.log(e);
  }
}
