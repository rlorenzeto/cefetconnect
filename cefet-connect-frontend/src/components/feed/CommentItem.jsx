import { useEffect, useState } from "react";
import LikeButton from "./LikeButton";
import {
  deleteComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
  updateComment,
} from "../../services/commentService";

export default function CommentItem({ comment, currentUser, onDeleted }) {
  const [texto, setTexto] = useState(comment.texto || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [likeTotal, setLikeTotal] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = comment?.usuario?.matricula === currentUser?.matricula;

  useEffect(() => {
    async function loadLikes() {
      try {
        const response = await getCommentLikes(comment.idComentario);
        const dados = response?.dados || response;

        setLikeTotal(dados?.totalCurtidas || 0);
      } catch (error) {
        console.error("Erro ao carregar curtidas do comentário:", error);
      }
    }

    loadLikes();
  }, [comment.idComentario]);

  async function handleSave() {
    if (!texto.trim()) {
      setError("O comentário não pode ficar vazio.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      await updateComment(comment.idComentario, texto.trim());
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Não foi possível editar o comentário.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja excluir este comentário?");

    if (!confirmed) return;

    try {
      await deleteComment(comment.idComentario);
      onDeleted(comment.idComentario);
    } catch (error) {
      setError(error.message || "Não foi possível excluir o comentário.");
    }
  }

  async function handleToggleLike() {
    try {
      setIsLikeLoading(true);

      if (liked) {
        await unlikeComment(comment.idComentario);
        setLiked(false);
        setLikeTotal((prev) => Math.max(prev - 1, 0));
      } else {
        await likeComment(comment.idComentario);
        setLiked(true);
        setLikeTotal((prev) => prev + 1);
      }
    } catch (error) {
      if (error.message?.toLowerCase().includes("já curtiu")) {
        setLiked(true);
      } else {
        console.error("Erro ao curtir comentário:", error);
      }
    } finally {
      setIsLikeLoading(false);
    }
  }

  return (
    <article className="rounded-2xl bg-[#f7f7f7] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#202020]">
            {comment?.usuario?.nomeUsuario || "Usuário"}
          </p>

          {isEditing ? (
            <textarea
              value={texto}
              onChange={(event) => {
                setTexto(event.target.value);
                setError("");
              }}
              maxLength={255}
              className="mt-2 min-h-20 w-full resize-none rounded-xl border border-[#d9d9d9] bg-white px-3 py-2 text-sm outline-none"
            />
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-[#343434]">
              {texto}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className="text-xs font-semibold text-[#0291db]"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-semibold text-red-500"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <div className="mt-3 flex items-center justify-between gap-3">
        <LikeButton
          liked={liked}
          total={likeTotal}
          label="Curtir"
          onClick={handleToggleLike}
          disabled={isLikeLoading}
        />

        {isEditing && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full bg-[#089464] px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        )}
      </div>
    </article>
  );
}