import axios from "axios";
import { z } from "zod";

// =====================
// Schemas & Types
// =====================
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
  username: z.string().nullable().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const DrillListItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
  difficulty: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type DrillListItem = z.infer<typeof DrillListItemSchema>;

export const DrillSchema = DrillListItemSchema.extend({
  questions: z.array(z.string()),
});

export type Drill = z.infer<typeof DrillSchema>;

export const AttemptSchema = z.object({
  _id: z.string(),
  drillId: z.string(),
  score: z.number(),
  createdAt: z.string(),
});

export type Attempt = z.infer<typeof AttemptSchema>;

export const SubmitAttemptResponseSchema = z.object({
  score: z.number(),
  attemptId: z.string(),
  createdAt: z.string(),
});

// =====================
// Axios instance
// =====================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  withCredentials: true,
});

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
  answers: string[]
): Promise<SubmitAttemptResponse> {
  const { data } = await api.post("/api/attempts", { drillId, answers });
  return SubmitAttemptResponseSchema.parse(data);
}


export async function getAttempts(limit = 5): Promise<Attempt[]> {
  const { data } = await api.get(`/api/attempts?limit=${limit}`);
  return z.array(AttemptSchema).parse(data);
}

// =====================
// Helper: OAuth URL
// =====================
export function googleAuthUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  return `${base}/auth/google`;
}
