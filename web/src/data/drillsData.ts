
import { Drill } from '@/types/drill';

export const drillsData: Drill[] = [
  {
    _id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    difficulty: 'easy',
    tags: ['JavaScript', 'Programming', 'Fundamentals'],
    timeLimit: 15,
    totalPoints: 50,
    questions: [
      {
        id: 'js1',
        prompt: 'What is the correct way to declare a variable in JavaScript?',
        options: [
          { id: 'a', text: 'var myVar = 5;' },
          { id: 'b', text: 'variable myVar = 5;' },
          { id: 'c', text: 'declare myVar = 5;' },
          { id: 'd', text: 'int myVar = 5;' }
        ],
        correctAnswer: 'a',
        points: 10
      },
      {
        id: 'js2',
        prompt: 'Which method is used to add an element to the end of an array?',
        options: [
          { id: 'a', text: 'append()' },
          { id: 'b', text: 'push()' },
          { id: 'c', text: 'add()' },
          { id: 'd', text: 'insert()' }
        ],
        correctAnswer: 'b',
        points: 10
      },
      {
        id: 'js3',
        prompt: 'What does "=== " operator do in JavaScript?',
        options: [
          { id: 'a', text: 'Assigns a value' },
          { id: 'b', text: 'Compares values only' },
          { id: 'c', text: 'Compares values and types' },
          { id: 'd', text: 'Creates a new variable' }
        ],
        correctAnswer: 'c',
        points: 10
      },
      {
        id: 'js4',
        prompt: 'Which of the following is NOT a JavaScript data type?',
        options: [
          { id: 'a', text: 'String' },
          { id: 'b', text: 'Boolean' },
          { id: 'c', text: 'Float' },
          { id: 'd', text: 'Undefined' }
        ],
        correctAnswer: 'c',
        points: 10
      },
      {
        id: 'js5',
        prompt: 'How do you write a single-line comment in JavaScript?',
        options: [
          { id: 'a', text: '/* comment */' },
          { id: 'b', text: '// comment' },
          { id: 'c', text: '# comment' },
          { id: 'd', text: '<!-- comment -->' }
        ],
        correctAnswer: 'b',
        points: 10
      }
    ]
  },
  {
    _id: '2',
    title: 'React Components',
    description: 'Practice building and understanding React components, props, and state management.',
    difficulty: 'medium',
    tags: ['React', 'Components', 'Frontend'],
    timeLimit: 15,
    totalPoints: 50,
    questions: [
      {
        id: 'react1',
        prompt: 'What is JSX in React?',
        options: [
          { id: 'a', text: 'A JavaScript library' },
          { id: 'b', text: 'A syntax extension for JavaScript' },
          { id: 'c', text: 'A CSS framework' },
          { id: 'd', text: 'A database' }
        ],
        correctAnswer: 'b',
        points: 10
      },
      {
        id: 'react2',
        prompt: 'Which hook is used to manage state in functional components?',
        options: [
          { id: 'a', text: 'useEffect' },
          { id: 'b', text: 'useContext' },
          { id: 'c', text: 'useState' },
          { id: 'd', text: 'useReducer' }
        ],
        correctAnswer: 'c',
        points: 10
      },
      {
        id: 'react3',
        prompt: 'How do you pass data from parent to child component?',
        options: [
          { id: 'a', text: 'Through state' },
          { id: 'b', text: 'Through props' },
          { id: 'c', text: 'Through context' },
          { id: 'd', text: 'Through refs' }
        ],
        correctAnswer: 'b',
        points: 10
      },
      {
        id: 'react4',
        prompt: 'What is the virtual DOM in React?',
        options: [
          { id: 'a', text: 'A copy of the real DOM kept in memory' },
          { id: 'b', text: 'A new HTML standard' },
          { id: 'c', text: 'A CSS framework' },
          { id: 'd', text: 'A JavaScript library' }
        ],
        correctAnswer: 'a',
        points: 10
      },
      {
        id: 'react5',
        prompt: 'Which lifecycle method is called after component mounts?',
        options: [
          { id: 'a', text: 'componentWillMount' },
          { id: 'b', text: 'componentDidMount' },
          { id: 'c', text: 'componentWillUpdate' },
          { id: 'd', text: 'render' }
        ],
        correctAnswer: 'b',
        points: 10
      }
    ]
  },
  {
    _id: '3',
    title: 'Advanced Algorithms',
    description: 'Challenge yourself with complex algorithmic problems and data structures.',
    difficulty: 'hard',
    tags: ['Algorithms', 'Data Structures', 'Problem Solving'],
    timeLimit: 15,
    totalPoints: 50,
    questions: [
      {
        id: 'algo1',
        prompt: 'What is the time complexity of binary search?',
        options: [
          { id: 'a', text: 'O(n)' },
          { id: 'b', text: 'O(log n)' },
          { id: 'c', text: 'O(n²)' },
          { id: 'd', text: 'O(1)' }
        ],
        correctAnswer: 'b',
        points: 10
      },
      {
        id: 'algo2',
        prompt: 'Which data structure uses LIFO principle?',
        options: [
          { id: 'a', text: 'Queue' },
          { id: 'b', text: 'Array' },
          { id: 'c', text: 'Stack' },
          { id: 'd', text: 'Linked List' }
        ],
        correctAnswer: 'c',
        points: 10
      },
      {
        id: 'algo3',
        prompt: 'What is the worst-case time complexity of QuickSort?',
        options: [
          { id: 'a', text: 'O(n log n)' },
          { id: 'b', text: 'O(n²)' },
          { id: 'c', text: 'O(n)' },
          { id: 'd', text: 'O(log n)' }
        ],
        correctAnswer: 'b',
        points: 10
      },
      {
        id: 'algo4',
        prompt: 'Which algorithm is used to find the shortest path in a graph?',
        options: [
          { id: 'a', text: 'DFS' },
          { id: 'b', text: 'BFS' },
          { id: 'c', text: 'Dijkstra' },
          { id: 'd', text: 'Kruskal' }
        ],
        correctAnswer: 'c',
        points: 10
      },
      {
        id: 'algo5',
        prompt: 'What is a hash collision?',
        options: [
          { id: 'a', text: 'When two keys map to the same index' },
          { id: 'b', text: 'When a hash table is full' },
          { id: 'c', text: 'When hashing fails' },
          { id: 'd', text: 'When keys are duplicated' }
        ],
        correctAnswer: 'a',
        points: 10
      }
    ]
  }
];
