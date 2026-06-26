export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("cefetconnect_token");
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object"
        ? Array.isArray(data?.message)
          ? data.message.join(" ")
          : data?.message ||
            data?.sqlMessage ||
            data?.error ||
            "Erro ao comunicar com o servidor."
        : typeof data === "string" && data
          ? data
          : "Erro ao comunicar com o servidor.";

    const fullMessage = String(message);

    // COMUNIDADES
    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("nomeComunidade")
    ) {
      throw new Error("O nome da comunidade pode ter no máximo 255 caracteres.");
    }

    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("descricaoComunidade")
    ) {
      throw new Error("A descrição da comunidade pode ter no máximo 255 caracteres.");
    }

    // EVENTOS
    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("titulo")
    ) {
      throw new Error("O nome do evento pode ter no máximo 255 caracteres.");
    }

    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("localEvento")
    ) {
      throw new Error("O local do evento pode ter no máximo 255 caracteres.");
    }

    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("descricaoEvento")
    ) {
      throw new Error("A descrição do evento está muito grande.");
    }

    // Quando cria evento, o backend também cria um post com a descrição do evento.
    // Por isso o erro pode vir como coluna "conteudo".
    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("conteudo") &&
      path.includes("/evento")
    ) {
      throw new Error("A descrição do evento pode ter no máximo 1000 caracteres.");
    }

    // POSTS
    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("conteudo") &&
      path.includes("/post")
    ) {
      throw new Error("O conteúdo do post pode ter no máximo 1000 caracteres.");
    }

    // COMENTÁRIOS
    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("texto")
    ) {
      throw new Error("O comentário está muito grande.");
    }

    // PERFIL
    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("nomeUsuario")
    ) {
      throw new Error("O nome de usuário está muito grande.");
    }

    if (
      fullMessage.includes("Data too long") &&
      fullMessage.includes("biografia")
    ) {
      throw new Error("A descrição acadêmica pode ter no máximo 300 caracteres.");
    }

    throw new Error(fullMessage);
  }

  return data;
}