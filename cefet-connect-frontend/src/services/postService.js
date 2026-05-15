import { apiFetch, API_BASE_URL } from "./api";

export function getImageUrl(url) {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `${API_BASE_URL}/${url.replace(/^\/+/, "")}`;
}

export function listPosts() {
  return apiFetch("/post");
}

export function getPostById(idPost) {
  return apiFetch(`/post/${idPost}`);
}

export function createPost({ conteudo, fotos, destino }) {
  const formData = new FormData();

  if (conteudo) {
    formData.append("conteudo", conteudo);
  }
  if (destino) {
    formData.append("destino", destino);
  }

  if (fotos?.length) {
    fotos.forEach((foto) => {
      formData.append("fotos", foto);
    });
  }

  return apiFetch("/post", {
    method: "POST",
    body: formData,
  });
}

export function updatePost(idPost, payload) {
  return apiFetch(`/post/${idPost}`, {
    method: "PATCH",
    body: JSON.stringify({
      conteudo: payload.conteudo,
      destino: payload.destino,
      comunidadeId: payload.comunidadeId,
    }),
  });
}

export function addPostPhotos(idPost, fotos) {
  const formData = new FormData();

  fotos.forEach((foto) => {
    formData.append("fotos", foto);
  });

  return apiFetch(`/post/${idPost}/fotos`, {
    method: "POST",
    body: formData,
  });
}

export function removePostPhotos(idPost, ids = []) {
  return apiFetch(`/post/${idPost}/fotos`, {
    method: "DELETE",
    body: JSON.stringify({
      ids,
    }),
  });
}

export function deletePost(idPost) {
  return apiFetch(`/post/${idPost}`, {
    method: "DELETE",
  });
}

export function likePost(idPost) {
  return apiFetch(`/post/${idPost}/curtir`, {
    method: "POST",
  });
}

export function unlikePost(idPost) {
  return apiFetch(`/post/${idPost}/curtir`, {
    method: "DELETE",
  });
}

export function getPostLikes(idPost) {
  return apiFetch(`/post/${idPost}/curtidas`);
}

export function getUserPostLikes(matricula) {
  return apiFetch(`/post/usuario/${matricula}/likes`);
}