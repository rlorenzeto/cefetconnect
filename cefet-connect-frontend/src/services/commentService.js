import { apiFetch } from "./api";

export function listPostComments(idPost) {
  return apiFetch(`/comentario/post/${idPost}`);
}

export function createComment(idPost, texto) {
  return apiFetch(`/comentario/post/${idPost}`, {
    method: "POST",
    body: JSON.stringify({
      texto,
    }),
  });
}

export function updateComment(idComentario, texto) {
  return apiFetch(`/comentario/${idComentario}`, {
    method: "PATCH",
    body: JSON.stringify({
      texto,
    }),
  });
}

export function deleteComment(idComentario) {
  return apiFetch(`/comentario/${idComentario}`, {
    method: "DELETE",
  });
}

export function likeComment(idComentario) {
  return apiFetch(`/comentario/${idComentario}/curtir`, {
    method: "POST",
  });
}

export function unlikeComment(idComentario) {
  return apiFetch(`/comentario/${idComentario}/curtir`, {
    method: "DELETE",
  });
}

export function getCommentLikes(idComentario) {
  return apiFetch(`/comentario/${idComentario}/curtidas`);
}