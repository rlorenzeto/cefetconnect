import { apiFetch, API_BASE_URL } from "./api";

export async function loginUser(payload) {
  const body = payload.ssoToken 
    ? { ssoToken: payload.ssoToken }
    : { email: payload.email, senha: payload.senha };

  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (data?.access_token) {
    localStorage.setItem("cefetconnect_token", data.access_token);
  }

  if (data?.token_integracao) {
    localStorage.setItem("cefetconnect_integration_token", data.token_integracao);
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
      dataNascimento: payload.dataNascimento,
      aceitouTermos: payload.aceitouTermos,
    }),
  });
}

export function forgotPassword(payload) {
  return apiFetch("/usuario/esqueceu-senha", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
    }),
  });
}

export function resetPassword(payload) {
  return apiFetch("/usuario/resetar-senha", {
    method: "PATCH",
    body: JSON.stringify({
      email: payload.email,
      codigo: payload.codigo,
      novaSenha: payload.novaSenha,
    }),
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
  return apiFetch(`/usuario/${payload.idUsuario}/verificar-email`, {
    method: "POST",
    body: JSON.stringify({
      codigo: payload.codigo,
    }),
  });
}

export function resendEmailVerificationCode(payload) {
  return apiFetch(`/usuario/${payload.idUsuario}/reenviar-codigo`, {
    method: "POST",
  });
}

export function getUserProfile(idUsuario) {
  return apiFetch(`/usuario/${idUsuario}`);
}

export function updateUserProfile(idUsuario, payload) {
  const formData = new FormData();

  if (payload.nomeUsuario) formData.append("nomeUsuario", payload.nomeUsuario);
  if (payload.biografia !== undefined) formData.append("biografia", payload.biografia);
  if (payload.fotoUrl) formData.append("fotoUrl", payload.fotoUrl);

  return apiFetch(`/usuario/${idUsuario}`, {
    method: "PATCH",
    body: formData,
  });
}

export function changeUserPassword(idUsuario, payload) {
  return apiFetch(`/usuario/${idUsuario}/alterar-senha`, {
    method: "PATCH",
    body: JSON.stringify({
      senhaAtual: payload.senhaAtual,
      novaSenha: payload.novaSenha,
    }),
  });
}

export function changeUserEmail(idUsuario, payload) {
  return apiFetch(`/usuario/${idUsuario}/alterar-email`, {
    method: "PATCH",
    body: JSON.stringify({
      senha: payload.senha,
      novoEmail: payload.novoEmail,
    }),
  });
}

export function deleteUserAccount(idUsuario) {
  return apiFetch(`/usuario/${idUsuario}`, {
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