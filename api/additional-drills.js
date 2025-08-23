import mongoose from 'mongoose';
import Drill from './models/Drill.js';
import dotenv from 'dotenv';

dotenv.config();

const additionalDrills = [
  {
    title: "Python Fundamentals",
    description: "Test your knowledge of Python basics including data types, functions, and control structures.",
    difficulty: "easy",
    category: "Programming",
    tags: ["python", "basics", "fundamentals"],
    questions: [
      {
        id: "py1",
        prompt: "What is the correct way to create a list in Python?",
        options: [
          { id: "a", text: "list = (1, 2, 3)" },
          { id: "b", text: "list = [1, 2, 3]" },
          { id: "c", text: "list = {1, 2, 3}" },
          { id: "d", text: "list = <1, 2, 3>" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "In Python, lists are created using square brackets []. Parentheses () create tuples, and curly braces {} create dictionaries or sets."
      },
      {
        id: "py2",
        prompt: "Which of the following is NOT a Python data type?",
        options: [
          { id: "a", text: "int" },
          { id: "b", text: "float" },
          { id: "c", text: "char" },
          { id: "d", text: "bool" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "Python does not have a 'char' data type. Characters in Python are represented as strings of length 1."
      },
      {
        id: "py3",
        prompt: "What does the 'self' parameter in a class method refer to?",
        options: [
          { id: "a", text: "The class itself" },
          { id: "b", text: "The instance of the class" },
          { id: "c", text: "The parent class" },
          { id: "d", text: "The module containing the class" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "In Python, 'self' refers to the instance of the class. It's used to access variables and methods of the class."
      },
      {
        id: "py4",
        prompt: "What is the output of: print(2 ** 3)?",
        options: [
          { id: "a", text: "6" },
          { id: "b", text: "8" },
          { id: "c", text: "5" },
          { id: "d", text: "Error" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The ** operator in Python is used for exponentiation. 2 ** 3 means 2 raised to the power of 3, which equals 8."
      },
      {
        id: "py5",
        prompt: "Which of the following is used to handle exceptions in Python?",
        options: [
          { id: "a", text: "try-catch" },
          { id: "b", text: "try-except" },
          { id: "c", text: "try-finally" },
          { id: "d", text: "if-else" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "Python uses try-except blocks for exception handling, not try-catch as in some other languages."
      }
    ],
    instructions: "Answer all questions to the best of your ability. Each question is worth 1 point."
  },
  {
    title: "SQL Fundamentals",
    description: "Test your knowledge of SQL basics including queries, joins, and database concepts.",
    difficulty: "medium",
    category: "Database",
    tags: ["sql", "database", "queries"],
    questions: [
      {
        id: "sql1",
        prompt: "Which SQL statement is used to retrieve data from a database?",
        options: [
          { id: "a", text: "GET" },
          { id: "b", text: "OPEN" },
          { id: "c", text: "SELECT" },
          { id: "d", text: "EXTRACT" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "The SELECT statement is used to retrieve data from a database. It's one of the most common SQL commands."
      },
      {
        id: "sql2",
        prompt: "Which type of JOIN returns rows when there is at least one match in both tables?",
        options: [
          { id: "a", text: "INNER JOIN" },
          { id: "b", text: "LEFT JOIN" },
          { id: "c", text: "RIGHT JOIN" },
          { id: "d", text: "FULL JOIN" }
        ],
        correctAnswer: "a",
        points: 1,
        explanation: "INNER JOIN returns rows when there is a match in both tables. It's the most common type of join."
      },
      {
        id: "sql3",
        prompt: "Which SQL clause is used to filter records?",
        options: [
          { id: "a", text: "LIMIT" },
          { id: "b", text: "WHERE" },
          { id: "c", text: "HAVING" },
          { id: "d", text: "GROUP BY" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The WHERE clause is used to filter records based on a specified condition."
      },
      {
        id: "sql4",
        prompt: "What does the SQL statement 'DELETE FROM table_name' do?",
        options: [
          { id: "a", text: "Deletes the table structure" },
          { id: "b", text: "Deletes all rows from the table" },
          { id: "c", text: "Deletes the table and all its data" },
          { id: "d", text: "Deletes only the first row from the table" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The DELETE FROM statement without a WHERE clause deletes all rows from a table but keeps the table structure intact."
      },
      {
        id: "sql5",
        prompt: "Which SQL function is used to count the number of rows in a result set?",
        options: [
          { id: "a", text: "SUM()" },
          { id: "b", text: "COUNT()" },
          { id: "c", text: "AVG()" },
          { id: "d", text: "MAX()" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The COUNT() function returns the number of rows that match a specified criterion."
      }
    ],
    instructions: "This quiz tests your knowledge of SQL fundamentals. Choose the best answer for each question."
  },
  {
    title: "Data Structures",
    description: "Test your knowledge of common data structures including arrays, linked lists, trees, and graphs.",
    difficulty: "hard",
    category: "Computer Science",
    tags: ["data structures", "algorithms", "computer science"],
    questions: [
      {
        id: "ds1",
        prompt: "What is the time complexity of searching for an element in a balanced binary search tree?",
        options: [
          { id: "a", text: "O(1)" },
          { id: "b", text: "O(log n)" },
          { id: "c", text: "O(n)" },
          { id: "d", text: "O(n log n)" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The time complexity of searching in a balanced binary search tree is O(log n) because each comparison eliminates roughly half of the remaining elements."
      },
      {
        id: "ds2",
        prompt: "Which data structure operates on a LIFO (Last In, First Out) principle?",
        options: [
          { id: "a", text: "Queue" },
          { id: "b", text: "Stack" },
          { id: "c", text: "Linked List" },
          { id: "d", text: "Tree" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "A stack operates on the LIFO principle, where the last element added is the first one to be removed."
      },
      {
        id: "ds3",
        prompt: "What is the worst-case time complexity of quicksort?",
        options: [
          { id: "a", text: "O(n)" },
          { id: "b", text: "O(n log n)" },
          { id: "c", text: "O(n²)" },
          { id: "d", text: "O(log n)" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "The worst-case time complexity of quicksort is O(n²), which occurs when the pivot chosen is always the smallest or largest element."
      },
      {
        id: "ds4",
        prompt: "Which of the following is NOT a characteristic of a hash table?",
        options: [
          { id: "a", text: "Fast lookups" },
          { id: "b", text: "Ordered elements" },
          { id: "c", text: "Fast insertions" },
          { id: "d", text: "Uses a hash function" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "Hash tables do not maintain order of elements. They provide fast lookups and insertions but at the cost of losing the order of elements."
      },
      {
        id: "ds5",
        prompt: "What is the space complexity of a breadth-first search on a graph with V vertices and E edges?",
        options: [
          { id: "a", text: "O(1)" },
          { id: "b", text: "O(V)" },
          { id: "c", text: "O(E)" },
          { id: "d", text: "O(V + E)" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The space complexity of BFS is O(V) because in the worst case, all vertices might be stored in the queue."
      }
    ],
    instructions: "This is an advanced data structures quiz. Take your time to analyze each question carefully."
  },
  {
    title: "System Design Concepts",
    description: "Test your knowledge of system design principles, scalability, and distributed systems.",
    difficulty: "hard",
    category: "System Design",
    tags: ["system design", "architecture", "scalability"],
    questions: [
      {
        id: "sd1",
        prompt: "Which of the following is NOT a benefit of microservices architecture?",
        options: [
          { id: "a", text: "Independent deployment" },
          { id: "b", text: "Technology diversity" },
          { id: "c", text: "Simplified testing" },
          { id: "d", text: "Team autonomy" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "Testing in microservices architecture is actually more complex due to service dependencies and distributed nature."
      },
      {
        id: "sd2",
        prompt: "What is the CAP theorem in distributed systems?",
        options: [
          { id: "a", text: "You can have at most two of: consistency, availability, and partition tolerance" },
          { id: "b", text: "You must have all three: consistency, availability, and partition tolerance" },
          { id: "c", text: "You can have only one of: consistency, availability, and partition tolerance" },
          { id: "d", text: "You can have consistency and availability only if you have partition tolerance" }
        ],
        correctAnswer: "a",
        points: 1,
        explanation: "The CAP theorem states that a distributed system can provide at most two out of the three properties: Consistency, Availability, and Partition tolerance."
      },
      {
        id: "sd3",
        prompt: "Which load balancing algorithm distributes requests based on the current server load?",
        options: [
          { id: "a", text: "Round Robin" },
          { id: "b", text: "Least Connections" },
          { id: "c", text: "IP Hash" },
          { id: "d", text: "Random" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "The Least Connections algorithm directs traffic to the server with the fewest active connections, which is a way to distribute load based on current server load."
      },
      {
        id: "sd4",
        prompt: "What is the primary purpose of a Content Delivery Network (CDN)?",
        options: [
          { id: "a", text: "To encrypt data in transit" },
          { id: "b", text: "To reduce latency by serving content from locations closer to users" },
          { id: "c", text: "To provide backup storage for web applications" },
          { id: "d", text: "To filter malicious traffic" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "A CDN's primary purpose is to reduce latency by serving content from edge locations that are geographically closer to users."
      },
      {
        id: "sd5",
        prompt: "Which database type is most suitable for handling complex relationships between data entities?",
        options: [
          { id: "a", text: "NoSQL document database" },
          { id: "b", text: "Relational database" },
          { id: "c", text: "Key-value store" },
          { id: "d", text: "Time-series database" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "Relational databases are designed to handle complex relationships between data entities through foreign keys and joins."
      }
    ],
    instructions: "This quiz covers advanced system design concepts. Consider the trade-offs in each scenario."
  },
  {
    title: "Algorithms Challenge",
    description: "Test your knowledge of common algorithms, their applications, and complexity analysis.",
    difficulty: "hard",
    category: "Computer Science",
    tags: ["algorithms", "complexity", "problem solving"],
    questions: [
      {
        id: "algo1",
        prompt: "Which sorting algorithm has the best average-case time complexity?",
        options: [
          { id: "a", text: "Bubble Sort" },
          { id: "b", text: "Insertion Sort" },
          { id: "c", text: "Merge Sort" },
          { id: "d", text: "Selection Sort" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "Merge Sort has an average-case time complexity of O(n log n), which is better than Bubble Sort, Insertion Sort, and Selection Sort."
      },
      {
        id: "algo2",
        prompt: "What is the time complexity of binary search?",
        options: [
          { id: "a", text: "O(1)" },
          { id: "b", text: "O(log n)" },
          { id: "c", text: "O(n)" },
          { id: "d", text: "O(n log n)" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "Binary search has a time complexity of O(log n) because it divides the search interval in half with each step."
      },
      {
        id: "algo3",
        prompt: "Which algorithm is commonly used to find the shortest path in a weighted graph?",
        options: [
          { id: "a", text: "Depth-First Search" },
          { id: "b", text: "Breadth-First Search" },
          { id: "c", text: "Dijkstra's Algorithm" },
          { id: "d", text: "Kruskal's Algorithm" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "Dijkstra's Algorithm is commonly used to find the shortest path in a weighted graph with non-negative weights."
      },
      {
        id: "algo4",
        prompt: "What problem does the Knapsack algorithm solve?",
        options: [
          { id: "a", text: "Finding the shortest path" },
          { id: "b", text: "Sorting elements" },
          { id: "c", text: "Maximizing value given a weight constraint" },
          { id: "d", text: "Finding the minimum spanning tree" }
        ],
        correctAnswer: "c",
        points: 1,
        explanation: "The Knapsack algorithm solves the problem of maximizing the value of items to include in a knapsack, given a weight constraint."
      },
      {
        id: "algo5",
        prompt: "Which of the following is an example of a greedy algorithm?",
        options: [
          { id: "a", text: "Merge Sort" },
          { id: "b", text: "Dijkstra's Algorithm" },
          { id: "c", text: "Binary Search" },
          { id: "d", text: "Depth-First Search" }
        ],
        correctAnswer: "b",
        points: 1,
        explanation: "Dijkstra's Algorithm is a greedy algorithm because it always chooses the path with the smallest known distance at each step."
      }
    ],
    instructions: "This quiz tests your understanding of algorithms and their applications. Analyze each question carefully."
  }
];

async function seedAdditionalDrills() {
  try {
    // Connect to MongoDB
    const dbName = process.env.MONGO_DB_NAME || 'upivot';
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: dbName,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Insert additional drills
    const createdDrills = await Drill.insertMany(additionalDrills);
    console.log(`📚 Created ${createdDrills.length} additional drills`);

    console.log('\n🎉 Additional drills seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding additional drills:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedAdditionalDrills();