import axios from "axios";

export type User = {
  _id: string;
  email: string;
  name?: string;
  picture?: string;
};

export type DrillListItem = {
  _id: string;
  title: string;
  difficulty?: string;
  tags?: string[];
};

export type Drill = DrillListItem & {
  questions: string[];
};

export type Attempt = {
  _id: string;
  drillId: string;
  score: number;
  createdAt: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  withCredentials: true
});

// Auth
export async function getMe(): Promise<User> {
  const { data } = await api.get("/api/me");
  return data;
}

// Drills
export async function getDrills(): Promise<DrillListItem[]> {
  const { data } = await api.get("/api/drills");
  return data;
}

export async function getDrill(id: string): Promise<Drill> {
  const { data } = await api.get(`/api/drills/${id}`);
  return data;
}

// Attempts
export async function submitAttempt(drillId: string, answers: string[]): Promise<{ score: number; attemptId: string; createdAt: string; }> {
  const { data } = await api.post("/api/attempts", { drillId, answers });
  return data;
}

export async function getAttempts(limit = 5): Promise<Attempt[]> {
  const { data } = await api.get(`/api/attempts?limit=${limit}`);
  return data;
}

// (Optional) Update profile name — if your backend supports PATCH /api/me
export async function updateMeName(name: string): Promise<User> {
  const { data } = await api.patch("/api/me", { name });
  return data;
}

// Helper for OAuth URL
export function googleAuthUrl() {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
  return `${base}/auth/google`;
}
