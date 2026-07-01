import { apiFetch, API_BASE_URL } from "./api";

export function getCommunityImageUrl(url) {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
}

export function listComunidades(page = 1) {
  return apiFetch(`/comunidade?page=${page}`);
}

export function listMinhasComunidades() {
  return apiFetch("/comunidade/usuario/minhas");
}

export function getComunidade(idComunidade) {
  return apiFetch(`/comunidade/${idComunidade}`);
}

export function createComunidade(payload) {
  const formData = new FormData();

  formData.append("nomeComunidade", payload.nomeComunidade);
  formData.append("descricaoComunidade", payload.descricaoComunidade || "");

  if (payload.capaComunidade) {
    formData.append("capaComunidade", payload.capaComunidade);
  }

  if (payload.fotoUrlComunidade) {
    formData.append("fotoUrlComunidade", payload.fotoUrlComunidade);
  }

  return apiFetch("/comunidade", {
    method: "POST",
    body: formData,
  });
}

export function updateComunidade(idComunidade, payload) {
  const formData = new FormData();

  if (payload.nomeComunidade !== undefined) {
    formData.append("nomeComunidade", payload.nomeComunidade);
  }

  if (payload.descricaoComunidade !== undefined) {
    formData.append("descricaoComunidade", payload.descricaoComunidade);
  }

  if (payload.capaComunidade) {
    formData.append("capaComunidade", payload.capaComunidade);
  }

  if (payload.fotoUrlComunidade) {
    formData.append("fotoUrlComunidade", payload.fotoUrlComunidade);
  }

  return apiFetch(`/comunidade/${idComunidade}`, {
    method: "PATCH",
    body: formData,
  });
}

export function deleteComunidade(idComunidade) {
  return apiFetch(`/comunidade/${idComunidade}`, {
    method: "DELETE",
  });
}

export function entrarComunidade(idComunidade) {
  return apiFetch(`/comunidade/${idComunidade}/entrar`, {
    method: "POST",
  });
}

export function sairComunidade(idComunidade) {
  return apiFetch(`/comunidade/${idComunidade}/sair`, {
    method: "DELETE",
  });
}

export function listPostsComunidade(idComunidade, page = 1) {
  return apiFetch(`/comunidade/${idComunidade}/posts?page=${page}`);
}

export function listMembrosComunidade(idComunidade) {
  return apiFetch(`/comunidade/${idComunidade}/membros`);
}