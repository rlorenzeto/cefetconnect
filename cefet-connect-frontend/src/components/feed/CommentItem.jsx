import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import LikeButton from "./LikeButton";
import PostLikesModal from "./PostLikesModal";
import { getProfileImageUrl } from "../../services/authService";
import {
  deleteComment,
  getCommentLikes,
  likeComment,
  unlikeComment,
  updateComment,
} from "../../services/commentService";

export default function CommentItem({
  comment,
  currentUser,
  onDeleted,
  onRankingChanged,
}) {
  const navigate = useNavigate();

  const [texto, setTexto] = useState(comment.texto || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [likeTotal, setLikeTotal] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [error, setError] = useState("");

  const commentAuthorId = comment?.usuario?.idUsuario;

  const isOwner =
    String(commentAuthorId || "") === String(currentUser?.idUsuario || "");

  function handleGoToCommentAuthorProfile() {
    if (!commentAuthorId) return;

    navigate(`/profile/${commentAuthorId}`);
  }

  useEffect(() => {
    async function loadLikes() {
      try {
        const response = await getCommentLikes(comment.idComentario);
        const dados = response?.dados || response;

        const usuarios = Array.isArray(dados?.usuarios) ? dados.usuarios : [];

        setLikeTotal(Number(dados?.totalCurtidas ?? usuarios.length ?? 0));
        setLikedUsers(usuarios);

        const userLiked = usuarios.some(
          (usuario) =>
            String(usuario?.idUsuario || "") ===
            String(currentUser?.idUsuario || "")
        );

        setLiked(userLiked);
      } catch (error) {
        console.error("Erro ao carregar curtidas do comentário:", error);
      }
    }

    if (comment?.idComentario) {
      loadLikes();
    }
  }, [comment?.idComentario, currentUser?.idUsuario]);

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
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este comentário?"
    );

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

        setLikedUsers((prev) =>
          prev.filter(
            (usuario) =>
              String(usuario?.idUsuario || "") !==
              String(currentUser?.idUsuario || "")
          )
        );

        onRankingChanged?.();
      } else {
        await likeComment(comment.idComentario);

        setLiked(true);
        setLikeTotal((prev) => prev + 1);

        setLikedUsers((prev) => {
          const alreadyInList = prev.some(
            (usuario) =>
              String(usuario?.idUsuario || "") ===
              String(currentUser?.idUsuario || "")
          );

          if (alreadyInList) return prev;

          return [
            ...prev,
            {
              idUsuario: currentUser?.idUsuario,
              nomeUsuario: currentUser?.nomeUsuario,
              fotoUrl: currentUser?.fotoUrl,
            },
          ];
        });

        onRankingChanged?.();
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
    <>
      <article className="min-w-0 max-w-full overflow-hidden rounded-2xl bg-[#f7f7f7] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <button
              type="button"
              onClick={handleGoToCommentAuthorProfile}
              className="shrink-0 rounded-full transition hover:opacity-85"
              aria-label={`Abrir perfil de ${
                comment?.usuario?.nomeUsuario || "usuário"
              }`}
            >
              <ProfileAvatar
                src={getProfileImageUrl(comment?.usuario?.fotoUrl)}
                name={comment?.usuario?.nomeUsuario}
                size="post"
              />
            </button>

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={handleGoToCommentAuthorProfile}
                className="block max-w-full truncate text-left text-sm font-semibold text-[#202020] transition hover:underline"
              >
                {comment?.usuario?.nomeUsuario || "Usuário"}
              </button>

              {isEditing ? (
                <textarea
                  value={texto}
                  onChange={(event) => {
                    setTexto(event.target.value);
                    setError("");
                  }}
                  maxLength={255}
                  className="mt-2 min-h-20 w-full max-w-full resize-none rounded-xl border border-[#d9d9d9] bg-white px-3 py-2 text-sm outline-none whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
                />
              ) : (
                <p className="mt-1 max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-[#343434] [overflow-wrap:anywhere]">
                  {texto}
                </p>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex shrink-0 gap-2">
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

        <div className="mt-3 flex items-center justify-between gap-3 pl-[60px]">
          <LikeButton
            liked={liked}
            total={likeTotal}
            label="Curtir"
            onClick={handleToggleLike}
            onTotalClick={() => setIsLikesModalOpen(true)}
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

      <PostLikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        users={likedUsers}
        title="Pessoas que curtiram o comentário"
        emptyMessage="Ninguém curtiu este comentário ainda."
      />
    </>
  );
}