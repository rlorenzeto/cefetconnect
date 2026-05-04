import { apiFetch, API_BASE_URL } from "./api";

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

export function saveCurrentUser(user) {
  localStorage.setItem("cefetconnect_user", JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem("cefetconnect_token");
  localStorage.removeItem("cefetconnect_user");
}

export function verifyEmail(payload) {
  return apiFetch(`/usuario/${payload.matricula}/verificar-email`, {
    method: "POST",
    body: JSON.stringify({
      codigo: payload.codigo,
    }),
  });
}

export function resendEmailVerificationCode(payload) {
  return apiFetch(`/usuario/${payload.matricula}/reenviar-codigo`, {
    method: "POST",
  });
}

export function getUserProfile(matricula) {
  return apiFetch(`/usuario/${matricula}`);
}

export function updateUserProfile(matricula, payload) {
  const formData = new FormData();

  if (payload.nomeUsuario) formData.append("nomeUsuario", payload.nomeUsuario);
  if (payload.biografia !== undefined) formData.append("biografia", payload.biografia);
  if (payload.fotoUrl) formData.append("fotoUrl", payload.fotoUrl);

  return apiFetch(`/usuario/${matricula}`, {
    method: "PATCH",
    body: formData,
  });
}

export function changeUserPassword(matricula, payload) {
  return apiFetch(`/usuario/${matricula}/alterar-senha`, {
    method: "PATCH",
    body: JSON.stringify({
      senhaAtual: payload.senhaAtual,
      novaSenha: payload.novaSenha,
    }),
  });
}

export function changeUserEmail(matricula, payload) {
  return apiFetch(`/usuario/${matricula}/alterar-email`, {
    method: "PATCH",
    body: JSON.stringify({
      senha: payload.senha,
      novoEmail: payload.novoEmail,
    }),
  });
}

export function deleteUserAccount(matricula) {
  return apiFetch(`/usuario/${matricula}`, {
    method: "DELETE",
  });
}

export function getProfileImageUrl(fotoUrl) {
  if (!fotoUrl) return "";

  if (fotoUrl.startsWith("http")) {
    return fotoUrl;
  }

  return `${API_BASE_URL}/${fotoUrl.replace(/^\/+/, "")}`;
}