import TestStarted from "@/context/TestStarted";

import { User } from "@/model/user";
import dbConnect from "@/utils/dbConn";
import { NextResponse } from "next/server";
import { generateTestData } from "./generateTestData";
import { formatTime } from "@/utils/formatTime";
import { model } from "mongoose";
import bcrypt from "bcrypt";
import { Test } from "@/model/test";

const levels = [
  "beginner",
  "average",
  "aboveAverage",
  "fast",
  "professional",
  "extremelyFast",
  "worldClass",
  "exceptional",
];

const users = [
  { _id: "66941da1a9b5eb04c528eb4f", level: levels[7] },
  { _id: "66941da1a9b5eb04c528eb50", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb51", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb52", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb53", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb54", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb55", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb56", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb57", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb58", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb59", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb5a", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb5b", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb5c", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb5d", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb5e", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb5f", level: levels[0] },
  { _id: "66941da1a9b5eb04c528eb60", level: levels[0] },
  { _id: "66941da1a9b5eb04c528eb61", level: levels[0] },
  { _id: "66941da1a9b5eb04c528eb62", level: levels[0] },
  { _id: "66941da1a9b5eb04c528eb63", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb64", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb65", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb66", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb67", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb68", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb69", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb6a", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb6b", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb6c", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb6d", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb6e", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb6f", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb70", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb71", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb72", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb73", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb74", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb75", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb76", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb77", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb78", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb79", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb7a", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb7b", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb7c", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb7d", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb7e", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eb7f", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb80", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb81", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb82", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eb83", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb84", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb85", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb86", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb87", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb88", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb89", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb8a", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb8b", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb8c", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb8d", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb8e", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb8f", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb90", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb91", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb92", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb93", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb94", level: levels[6] },
  { _id: "66941da1a9b5eb04c528eb95", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb96", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb97", level: levels[5] },
  { _id: "66941da1a9b5eb04c528eb98", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb99", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb9a", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb9b", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb9c", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb9d", level: levels[4] },
  { _id: "66941da1a9b5eb04c528eb9e", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eb9f", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eba0", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eba1", level: levels[3] },
  { _id: "66941da1a9b5eb04c528eba2", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eba3", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eba4", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eba5", level: levels[2] },
  { _id: "66941da1a9b5eb04c528eba6", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eba7", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eba8", level: levels[1] },
  { _id: "66941da1a9b5eb04c528eba9", level: levels[1] },
  { _id: "66941da1a9b5eb04c528ebaa", level: levels[1] },
  { _id: "66941da1a9b5eb04c528ebab", level: levels[1] },
  { _id: "66941da1a9b5eb04c528ebac", level: levels[1] },
  { _id: "66941da1a9b5eb04c528ebad", level: levels[1] },
  { _id: "66941da1a9b5eb04c528ebae", level: levels[0] },
  { _id: "66941da1a9b5eb04c528ebaf", level: levels[0] },
  { _id: "66941da1a9b5eb04c528ebb0", level: levels[0] },
  { _id: "66941da1a9b5eb04c528ebb1", level: levels[0] },
  { _id: "66941da1a9b5eb04c528ebb2", level: levels[0] },
];

export async function GET() {
  try {
    await dbConnect();

    const start = new Date();

    const activeMode = { name: "words", category: 10 };

    const data = [];

    const timeTaken = new Date() - start;

    return NextResponse.json({ timeTaken, data });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ e });
  }
}

// if (words[position.word].split(" ").length > 1) {
//   const lengths = words[position.word]
//     .split(" ")
//     .map((word) => word.length);

//   const partOfWord = lengths.reduce(
//     (acc, curr, i) => {
//       if (acc.part !== null) return acc;

//       if (acc.accLength + curr >= position.charInWord)
//         return { part: i, accLength: acc.accLength + curr + 1 };
//       return {
//         part: acc.part,
//         accLength: acc.accLength + curr + 1,
//       };
//     },
//     { part: null, accLength: 0 }
//   );

//   return { word: position.word, charInWord: partOfWord.accLength };
// } else
