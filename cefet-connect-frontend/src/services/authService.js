import { apiFetch } from "./api";

export async function loginUser(payload) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      senha: payload.senha,
    }),
  });

  if (data?.access_token) {
    localStorage.setItem("cefetconnect_token", data.access_token);
  }

  if (data?.usuario) {
    localStorage.setItem("cefetconnect_user", JSON.stringify(data.usuario));
  }

  return data;
}

export function registerUser(payload) {
  return apiFetch("/usuario", {
    method: "POST",
    body: JSON.stringify({
      matricula: payload.matricula,
      nomeUsuario: payload.nomeUsuario,
      email: payload.email,
      senha: payload.senha,
    }),
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
  const user = localStorage.getItem("cefetconnect_user");
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem("cefetconnect_token");
  localStorage.removeItem("cefetconnect_user");
}