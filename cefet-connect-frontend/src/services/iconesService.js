import { apiFetch } from "./api";

function unwrap(response) {
  return response?.dados || response;
}

export async function listMyIcons() {
  const response = await apiFetch("/icone/meus");
  return unwrap(response);
}

export async function listUserIcons(idUsuario) {
  const response = await apiFetch(`/icone/usuario/${idUsuario}`);
  return unwrap(response);
}

export async function importarIconesDoGradment() {
  const response = await apiFetch("/icone/importar", {
    method: "POST",
  });

  return unwrap(response);
}