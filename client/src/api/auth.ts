import { apiRequest } from "./client";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function login(username: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { username, password },
  });
}

export function fetchMe(token: string) {
  return apiRequest<{ user: AuthUser }>("/auth/me", { token });
}
