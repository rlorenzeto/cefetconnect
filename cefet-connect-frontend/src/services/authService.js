import { apiFetch } from "./api";

export function loginUser(payload) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(payload) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function resetPassword(payload) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCurrentUser() {
  return apiFetch("/auth/me");
}

export function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}