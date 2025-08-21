
export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  prompt: string;
  options: MCQOption[];
  correctAnswer: string;
  points: number;
}

export interface Drill {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  questions: MCQQuestion[];
  timeLimit: number; // in minutes
  totalPoints: number;
}

export interface DrillAttempt {
  _id: string;
  drillId: string;
  userId: string;
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  createdAt: string;
  completed: boolean;
}

export interface PerformanceStats {
  totalAttempts: number;
  averageScore: number;
  totalCorrect: number;
  totalQuestions: number;
  timeSpent: number;
  drillWiseStats: DrillWiseStats[];
}

export interface DrillWiseStats {
  drillId: string;
  drillTitle: string;
  attempts: number;
  bestScore: number;
  averageScore: number;
  lastAttempt: string;
}
