import axios from "axios";
import { z } from "zod";

// =====================
// Schemas & Types
// =====================
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string(),
  username: z.string().nullable().optional(),
  picture: z.string().url().optional(),
  providers: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const DrillListItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  totalPoints: z.number().optional(),
  timeLimit: z.number().optional(),
  questionCount: z.number().optional(),
});

export type DrillListItem = z.infer<typeof DrillListItemSchema>;

export const DrillSchema = DrillListItemSchema.extend({
  questions: z.array(z.object({
    id: z.string(),
    prompt: z.string(),
    options: z.array(z.object({
      id: z.string(),
      text: z.string()
    })),
    correctAnswer: z.string(),
    points: z.number().default(1),
    explanation: z.string().optional(),
    keywords: z.array(z.string()).optional()
  })),
  instructions: z.string().optional(),
  category: z.string().optional(),
});

export type Drill = z.infer<typeof DrillSchema>;

export const AttemptSchema = z.object({
  _id: z.string(),
  drillId: z.object({
    _id: z.string(),
    title: z.string(),
    difficulty: z.string(),
    tags: z.array(z.string()).optional()
  }),
  score: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number(),
  timeSpent: z.number(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export type Attempt = z.infer<typeof AttemptSchema>;

export const SubmitAttemptResponseSchema = z.object({
  success: z.boolean(),
  attempt: z.object({
    _id: z.string(),
    score: z.number(),
    totalQuestions: z.number(),
    correctAnswers: z.number(),
    timeSpent: z.number(),
    createdAt: z.string(),
    drillId: z.object({
      _id: z.string(),
      title: z.string(),
      difficulty: z.string()
    })
  })
});

export const AttemptStatsSchema = z.object({
  totalAttempts: z.number(),
  averageScore: z.number(),
  totalTimeSpent: z.number(),
  bestScore: z.number(),
  improvementRate: z.number(),
  completionRate: z.number(),
  drillStats: z.array(z.object({
    drillId: z.string(),
    drillTitle: z.string(),
    difficulty: z.string(),
    attempts: z.number(),
    averageScore: z.number(),
    bestScore: z.number(),
    averageTime: z.number()
  }))
});

export type AttemptStats = z.infer<typeof AttemptStatsSchema>;

// =====================
// Axios instance
// =====================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// =====================
// Auth
// =====================
export async function getMe(): Promise<User> {
  const { data } = await api.get("/api/me");
  return UserSchema.parse(data);
}

export async function updateMeName(name: string): Promise<User> {
  const { data } = await api.patch("/api/me", { name });
  return UserSchema.parse(data);
}

export async function updateMeUsername(username: string): Promise<User> {
  const { data } = await api.patch("/api/me", { username });
  return UserSchema.parse(data);
}

export async function checkAuthStatus(): Promise<{ authenticated: boolean; user?: any }> {
  try {
    const { data } = await api.get("/auth/status");
    return data;
  } catch (error) {
    return { authenticated: false };
  }
}

// =====================
// Drills
// =====================
export async function getDrills(): Promise<DrillListItem[]> {
  const { data } = await api.get("/api/drills");
  return z.array(DrillListItemSchema).parse(data);
}

export async function getDrill(id: string): Promise<Drill> {
  const { data } = await api.get(`/api/drills/${id}`);
  return DrillSchema.parse(data);
}

// =====================
// Attempts
// =====================
export type SubmitAttemptResponse = z.infer<typeof SubmitAttemptResponseSchema>;

export async function submitAttempt(
  drillId: string,
  answers: Record<string, string>,
  timeSpent: number
): Promise<SubmitAttemptResponse> {
  const { data } = await api.post("/api/attempts", { drillId, answers, timeSpent });
  return SubmitAttemptResponseSchema.parse(data);
}

export async function getAttempts(limit = 20, page = 1): Promise<{
  attempts: Attempt[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}> {
  const { data } = await api.get(`/api/attempts?limit=${limit}&page=${page}`);
  return {
    attempts: z.array(AttemptSchema).parse(data.attempts),
    pagination: data.pagination
  };
}

export async function getAttemptStats(): Promise<AttemptStats> {
  const { data } = await api.get("/api/attempts/stats");
  return AttemptStatsSchema.parse(data);
}

export async function getAttempt(id: string): Promise<Attempt> {
  const { data } = await api.get(`/api/attempts/${id}`);
  return AttemptSchema.parse(data);
}

// =====================
// Helper: OAuth URL
// =====================
export function googleAuthUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  return `${base}/auth/google`;
}
