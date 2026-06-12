import { apiFetch, API_BASE_URL } from "./api";

export function getEventImageUrl(url) {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
}

export function listEventos() {
  return apiFetch("/evento");
}

export function listMeusEventos() {
  return apiFetch("/evento/meus");
}

export function getEvento(idEvento) {
  return apiFetch(`/evento/${idEvento}`);
}

export function createEvento(payload) {
  const formData = new FormData();

  formData.append("titulo", payload.titulo);
  formData.append("descricaoEvento", payload.descricaoEvento || "");
  formData.append("localEvento", payload.localEvento || "");
  formData.append("status", payload.status ?? true);
  formData.append("dataEvento", payload.dataEvento);

  if (payload.comunidadeId) {
    formData.append("comunidadeId", payload.comunidadeId);
  }

  if (payload.capaEvento) {
    formData.append("capaEvento", payload.capaEvento);
  }

  if (payload.fotoUrlEvento) {
    formData.append("fotoUrlEvento", payload.fotoUrlEvento);
  }

  return apiFetch("/evento", {
    method: "POST",
    body: formData,
  });
}

export function updateEvento(idEvento, payload) {
  const formData = new FormData();

  if (payload.titulo !== undefined) {
    formData.append("titulo", payload.titulo);
  }

  if (payload.descricaoEvento !== undefined) {
    formData.append("descricaoEvento", payload.descricaoEvento);
  }

  if (payload.localEvento !== undefined) {
    formData.append("localEvento", payload.localEvento);
  }

  if (payload.status !== undefined) {
    formData.append("status", payload.status);
  }

  if (payload.dataEvento !== undefined) {
    formData.append("dataEvento", payload.dataEvento);
  }

  if (payload.comunidadeId !== undefined) {
    formData.append("comunidadeId", payload.comunidadeId || "");
  }

  if (payload.capaEvento) {
    formData.append("capaEvento", payload.capaEvento);
  }

  if (payload.fotoUrlEvento) {
    formData.append("fotoUrlEvento", payload.fotoUrlEvento);
  }

  return apiFetch(`/evento/${idEvento}`, {
    method: "PATCH",
    body: formData,
  });
}

export function deleteEvento(idEvento) {
  return apiFetch(`/evento/${idEvento}`, {
    method: "DELETE",
  });
}

export function participarEvento(idEvento) {
  return apiFetch(`/evento/${idEvento}/participar`, {
    method: "POST",
  });
}

export function sairEvento(idEvento) {
  return apiFetch(`/evento/${idEvento}/sair`, {
    method: "DELETE",
  });
}