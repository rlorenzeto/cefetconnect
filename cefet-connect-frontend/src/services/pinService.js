import { apiFetch } from "./api";

function unwrap(response) {
  return response?.dados || response;
}

export async function listAvailablePins(search = "") {
  const query = search?.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";

  const response = await apiFetch(`/pin/disponiveis${query}`);
  return response?.dados || response;
}

export async function listMyPins() {
  const response = await apiFetch("/pin/meus");
  return unwrap(response);
}

export async function listUserPins(idUsuario) {
  const response = await apiFetch(`/pin/usuario/${idUsuario}`);
  return unwrap(response);
}

export async function addManualPin(nomePin, categoriaPin = "disciplina") {
  const response = await apiFetch("/pin", {
    method: "POST",
    body: JSON.stringify({
      nomePin,
      categoriaPin,
    }),
  });

  return unwrap(response);
}

export async function suggestPinsFromGradment() {
  const response = await apiFetch("/pin/sugerir-gradment", {
    method: "GET",
  });

  return unwrap(response);
}

export async function importPinsFromGradment(pins = []) {
  const response = await apiFetch("/pin/importar", {
    method: "POST",
    body: JSON.stringify({
      pins,
    }),
  });

  return unwrap(response);
}

export async function removePinFromProfile(idPin) {
  const response = await apiFetch(`/pin/${idPin}`, {
    method: "DELETE",
  });

  return unwrap(response);
}

export async function getPinDetails(idPin) {
  const response = await apiFetch(`/pin/${idPin}`);
  return unwrap(response);
}

export async function listPinUsers(idPin) {
  const response = await apiFetch(`/pin/${idPin}/usuarios`);
  return unwrap(response);
}

export async function listPinCommunities(idPin) {
  const response = await apiFetch(`/pin/${idPin}/comunidades`);
  return unwrap(response);
}

export async function listCommunityPins(idComunidade) {
  const response = await apiFetch(`/pin/comunidade/${idComunidade}`);
  return unwrap(response);
}

export async function listPinsByCommunityName(nomeComunidade) {
  if (!nomeComunidade?.trim()) return [];

  const response = await listAvailablePins(nomeComunidade);
  const pins = Array.isArray(response) ? response : [];

  const normalizedCommunityName = nomeComunidade
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return pins.filter((pin) => {
    const normalizedPinName = pin.nomePin
      ?.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return (
      normalizedPinName === normalizedCommunityName ||
      normalizedPinName?.includes(normalizedCommunityName) ||
      normalizedCommunityName.includes(normalizedPinName)
    );
  });
}

export async function addPinToCommunity(idPin, idComunidade) {
  const response = await apiFetch(`/pin/${idPin}/comunidades/${idComunidade}`, {
    method: "POST",
  });

  return unwrap(response);
}

export async function removePinFromCommunity(idPin, idComunidade) {
  const response = await apiFetch(`/pin/${idPin}/comunidades/${idComunidade}`, {
    method: "DELETE",
  });

  return unwrap(response);
}