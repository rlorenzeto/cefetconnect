import { apiFetch } from "./api";

function unwrap(response) {
  return response?.dados || response;
}

export async function getRankingPreview() {
  const response = await apiFetch("/ranking/preview");
  return unwrap(response);
}

export async function getRankingCompleto() {
  const response = await apiFetch("/ranking");
  return unwrap(response);
}