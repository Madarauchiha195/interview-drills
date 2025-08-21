import mongoose from 'mongoose';
import User from './models/User.js';
import Drill from './models/Drill.js';
import Attempt from './models/Attempt.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleDrills = [
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of basic JavaScript concepts including variables, functions, and control flow.",
    difficulty: "easy",
    category: "Programming",
    tags: ["javascript", "basics", "fundamentals"],
    questions: [
      {
        id: "js1",
        prompt: "What is the correct way to declare a variable in JavaScript?",
        options: [
          { id: "a", text: "var x = 5;" },
          { id: "b", text: "let x = 5;" },
          { id: "c", text: "const x = 5;" },
          { id: "d", text: "All of the above" }
        ],
        correctAnswer: "d",
        points: 1,
        explanation: "All three are valid ways to declare variables in JavaScript, each with different scoping rules."
      },
      {
        id: "js2",
        prompt: "Which method is used to add an element to the end of an array?",
        options: [
          { id: "a", text: "push()" },
          { id: "b", text: "pop()" },
          { id: "c", text: "shift()" },
          { id: "d", text: "unshift()" }
        ],
        correctAnswer: "a",
        points: 1,
        explanation: "push() adds elements to the end of an array, while pop() removes from the end."
      },
      {
        id: "js3",
        prompt: "What is the output of: console.log(typeof null);",
        options: [
          { id: "a", text: "null" },
          { id: "b", text: "undefined" },
          { id: "c", text: "object" },
          { id: "d", text: "number" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "This is a known JavaScript quirk - typeof null returns 'object'."
      }
    ],
    instructions: "Answer all questions to the best of your ability. Each question is worth 1 point."
  },
  {
    title: "React Hooks Deep Dive",
    description: "Advanced concepts in React Hooks including useState, useEffect, and custom hooks.",
    difficulty: "medium",
    category: "Frontend",
    tags: ["react", "hooks", "frontend"],
    questions: [
      {
        id: "react1",
        prompt: "What is the correct way to use useState hook?",
        options: [
          { id: "a", text: "const [state, setState] = useState(initialValue);" },
          { id: "b", text: "const state = useState(initialValue);" },
          { id: "c", text: "const [state] = useState(initialValue);" },
          { id: "d", text: "useState(initialValue);" }
        ],
        correctAnswer: "a",
        points: 1,
        explanation: "useState returns an array with the current state and a function to update it."
      },
      {
        id: "react2",
        prompt: "When does useEffect run by default?",
        options: [
          { id: "a", text: "Only on mount" },
          { id: "b", text: "On every render" },
          { id: "c", text: "Only on unmount" },
          { id: "d", text: "Never" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "useEffect runs after every render by default unless you provide a dependency array."
      },
      {
        id: "react3",
        prompt: "What is the purpose of the dependency array in useEffect?",
        options: [
          { id: "a", text: "To specify when the effect should run" },
          { id: "b", text: "To optimize performance" },
          { id: "c", text: "To prevent infinite loops" },
          { id: "d", text: "All of the above" }
        ],
        correctAnswer: "d",
        points: 1,
        explanation: "The dependency array controls when the effect runs, optimizes performance, and prevents infinite loops."
      }
    ],
    instructions: "Focus on understanding the concepts behind React Hooks and their proper usage patterns."
  },
  {
    title: "Advanced TypeScript",
    description: "Complex TypeScript concepts including generics, utility types, and advanced type patterns.",
    difficulty: "hard",
    category: "Programming",
    tags: ["typescript", "advanced", "types"],
    questions: [
      {
        id: "ts1",
        prompt: "What is a generic type in TypeScript?",
        options: [
          { id: "a", text: "A type that can work with multiple types" },
          { id: "b", text: "A type that is always any" },
          { id: "c", text: "A type that cannot be changed" },
          { id: "d", text: "A type that only works with objects" }
        ],
        correctAnswer: "a",
        points: 1,
        explanation: "Generics allow you to create reusable components that can work with multiple types."
      },
      {
        id: "ts2",
        prompt: "What does the 'extends' keyword do in TypeScript generics?",
        options: [
          { id: "a", text: "It extends the class" },
          { id: "b", text: "It constrains the generic type" },
          { id: "c", text: "It creates a new type" },
          { id: "d", text: "It imports a module" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "extends constrains the generic type to ensure it has certain properties or structure."
      },
      {
        id: "ts3",
        prompt: "What is the difference between 'interface' and 'type' in TypeScript?",
        options: [
          { id: "a", text: "There is no difference" },
          { id: "b", text: "Interfaces can be extended, types cannot" },
          { id: "c", text: "Types can be extended, interfaces cannot" },
          { id: "d", text: "Interfaces can be extended and merged, types are more flexible" }
        ],
        correctAnswer: "d",
        points: 1,
        explanation: "Interfaces can be extended and merged, while types are more flexible and can represent unions, intersections, etc."
      }
    ],
    instructions: "This is an advanced TypeScript drill. Take your time to understand the type system concepts."
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Drill.deleteMany({});
    await Attempt.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample drills
    const createdDrills = await Drill.insertMany(sampleDrills);
    console.log(`📚 Created ${createdDrills.length} sample drills`);

    // Create a test user
    const testUser = await User.create({
      email: 'test@example.com',
      name: 'Test User',
      username: 'testuser',
      picture: 'https://via.placeholder.com/150',
      providers: ['google']
    });
    console.log('👤 Created test user');

    // Create some sample attempts for the test user
    const sampleAttempts = [
      {
        userId: testUser._id,
        drillId: createdDrills[0]._id, // JavaScript Fundamentals
        answers: { js1: 'd', js2: 'a', js3: 'c' },
        score: 100,
        totalQuestions: 3,
        correctAnswers: 3,
        timeSpent: 180,
        completed: true
      },
      {
        userId: testUser._id,
        drillId: createdDrills[1]._id, // React Hooks
        answers: { react1: 'a', react2: 'b', react3: 'd' },
        score: 100,
        totalQuestions: 3,
        correctAnswers: 3,
        timeSpent: 240,
        completed: true
      },
      {
        userId: testUser._id,
        drillId: createdDrills[2]._id, // Advanced TypeScript
        answers: { ts1: 'a', ts2: 'b', ts3: 'c' },
        score: 67,
        totalQuestions: 3,
        correctAnswers: 2,
        timeSpent: 360,
        completed: true
      }
    ];

    await Attempt.insertMany(sampleAttempts);
    console.log(`📊 Created ${sampleAttempts.length} sample attempts`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log(`   - ${createdDrills.length} Drills`);
    console.log(`   - 1 Test User (test@example.com)`);
    console.log(`   - ${sampleAttempts.length} Attempts`);
    console.log('\n🔗 You can now test the application with this data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();
