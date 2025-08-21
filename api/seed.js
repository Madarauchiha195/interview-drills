import "dotenv/config";
import mongoose from "mongoose";
import Drill from "./models/Drill.js";

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Drill.deleteMany({});
  const drill = await Drill.create({
    title: "JavaScript Basics",
    difficulty: "easy",
    tags: ["javascript", "basics"],
    questions: [
      { id: "q1", prompt: "What is closure?", keywords: ["scope", "function"] },
      { id: "q2", prompt: "Explain hoisting.", keywords: ["var", "declaration"] },
      { id: "q3", prompt: "What is `this`?", keywords: ["context", "object"] },
      { id: "q4", prompt: "Difference between let and var?", keywords: ["block", "scope"] },
      { id: "q5", prompt: "What is a promise?", keywords: ["async", "resolve", "reject"] }
    ]
  });

  console.log("✅ Seeded drill:", drill._id.toString());
  process.exit(0);
})();
