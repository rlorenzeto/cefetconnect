import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import LikeButton from "./LikeButton";
import PostImages from "./PostImages";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import PostLikesModal from "./PostLikesModal";
import {
  addPostPhotos,
  deletePost,
  getPostById,
  getPostLikes,
  likePost,
  removePostPhotos,
  unlikePost,
  updatePost,
} from "../../services/postService";
import { getProfileImageUrl } from "../../services/authService";
import { EditIcon, TrashIcon } from "../icons/AppIcons";

function PostActionMenu({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold text-[#555] transition hover:bg-[#f1f1f1]"
        aria-label="Abrir opções do post"
      >
        ⋯
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-40 w-40 overflow-hidden rounded-2xl border border-[#e3e3e3] bg-white py-2 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-[#343434] transition hover:bg-[#f7f7f7]"
          >
            <EditIcon className="h-4 w-4" />
            Editar
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}

export default function PostCard({
  post,
  currentUser,
  onPostDeleted,
  onPostUpdated,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [conteudo, setConteudo] = useState(post.conteudo || "");
  const [showComments, setShowComments] = useState(false);
  const [commentTotal, setCommentTotal] = useState(
    Number(post?.totalComentarios ?? post?.comentarios?.length ?? 0)
  );
  const [likeTotal, setLikeTotal] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likedUsers, setLikedUsers] = useState([]);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleGoToUserProfile() {
    const idAutor = post?.usuario?.idUsuario;

    if (!idAutor) return;

    navigate(`/profile/${idAutor}`);
  }

  const postOwnerId = String(post?.usuario?.idUsuario || "");
  const currentUserId = String(currentUser?.idUsuario || "");

  const isOwner =
    postOwnerId &&
    currentUserId &&
    postOwnerId === currentUserId;

  useEffect(() => {
    setConteudo(post.conteudo || "");
  }, [post.conteudo]);

  useEffect(() => {
    setCommentTotal(Number(post?.totalComentarios ?? post?.comentarios?.length ?? 0));
  }, [post?.totalComentarios, post?.comentarios?.length]);

  useEffect(() => {
    async function loadLikes() {
      try {
        const response = await getPostLikes(post.idPost);
        const dados = response?.dados || response;

        const usuarios = Array.isArray(dados?.usuarios) ? dados.usuarios : [];

        setLikeTotal(Number(dados?.total ?? usuarios.length ?? 0));
        setLikedUsers(usuarios);

        const userLiked = usuarios.some(
          (usuario) =>
            String(usuario?.idUsuario || "") ===
            String(currentUser?.idUsuario || "")
        );

        setLiked(userLiked);
      } catch (error) {
        console.error("Erro ao carregar curtidas:", error);
      }
    }

    if (post?.idPost) {
      loadLikes();
    }
  }, [post?.idPost, currentUser?.idUsuario]);

  function formatDate(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function getPostLocationLabel() {
    if (post?.comunidade?.nome) {
      return post.comunidade.nome;
    }

    if (post?.fk_Comunidade_idComunidade || post?.comunidade) {
      return "Comunidade";
    }

    return "Feed";
  }

  async function handleToggleLike() {
    try {
      setIsLikeLoading(true);

      if (liked) {
        await unlikePost(post.idPost);

        setLiked(false);
        setLikeTotal((prev) => Math.max(prev - 1, 0));

        setLikedUsers((prev) =>
          prev.filter(
            (usuario) =>
              String(usuario?.idUsuario || "") !==
              String(currentUser?.idUsuario || "")
          )
        );
      } else {
        await likePost(post.idPost);

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
      }
    } catch (error) {
      if (error.message?.toLowerCase().includes("já curtiu")) {
        setLiked(true);
      } else {
        console.error("Erro ao curtir post:", error);
      }
    } finally {
      setIsLikeLoading(false);
    }
  }
  async function handleDoubleClick() {
    if (!liked) {
      await handleToggleLike();
    }
  }

  async function handleSaveEdit(payload) {
    try {
      setIsSavingEdit(true);
      setError("");

      await updatePost(post.idPost, {
        conteudo: payload.conteudo,
        destino: payload.destino,
      });

      if (payload.idsFotosRemover?.length > 0) {
        await removePostPhotos(post.idPost, payload.idsFotosRemover);
      }

      if (payload.novasFotos?.length > 0) {
        await addPostPhotos(post.idPost, payload.novasFotos);
      }

      const response = await getPostById(post.idPost);
      const updatedPost = response?.dados || response;

      onPostUpdated({
        ...post,
        ...updatedPost,
        usuario: updatedPost.usuario || post.usuario,
        fotosPost:
          updatedPost.fotosPost !== undefined
            ? updatedPost.fotosPost
            : post.fotosPost,
      });

      setIsEditModalOpen(false);
    } catch (error) {
      setError(error.message || "Não foi possível atualizar o post.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setError("");

      await deletePost(post.idPost);
      onPostDeleted(post.idPost);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError(error.message || "Não foi possível excluir o post.");
    } finally {
      setIsDeleting(false);
    }
  }

  function getCommentButtonLabel() {
    const totalText =
      commentTotal === 1 ? "1 comentário" : `${commentTotal} comentários`;

    return showComments
      ? `Ocultar comentários (${totalText})`
      : `Mostrar comentários (${totalText})`;
  }

  return (
    <>
      <article
        onDoubleClick={handleDoubleClick}
        className="mx-auto w-full max-w-[680px] rounded-[22px] bg-white p-4 shadow-sm"
      >
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGoToUserProfile}
            className="shrink-0 rounded-full transition hover:opacity-85"
            aria-label={`Abrir perfil de ${post?.usuario?.nomeUsuario || "usuário"}`}
          >
            <ProfileAvatar
              src={getProfileImageUrl(post?.usuario?.fotoUrl)}
              name={post?.usuario?.nomeUsuario}
              size="post"
            />
          </button>

          <div>
            <button
              type="button"
              onClick={handleGoToUserProfile}
              className="block max-w-[220px] truncate text-left text-sm font-bold text-[#202020] transition hover:underline"
            >
              {post?.usuario?.nomeUsuario || "Usuário"}
            </button>

              <p className="text-xs text-[#777]">
                Publicado em {getPostLocationLabel()}
              </p>

              <p className="text-xs text-[#777]">
                {formatDate(post.dataHoraPublicacao)}
              </p>
            </div>
          </div>

          {isOwner && (
            <PostActionMenu
              onEdit={() => setIsEditModalOpen(true)}
              onDelete={() => setIsDeleteModalOpen(true)}
            />
          )}
        </header>

        <div className="mt-4">
          {post.conteudo && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-[#343434]">
              {post.conteudo}
            </p>
          )}
          <PostImages
            fotos={post.fotosPost || []}
            post={post}
            currentUser={currentUser}
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <LikeButton
              liked={liked}
              total={likeTotal}
              onClick={handleToggleLike}
              onTotalClick={() => setIsLikesModalOpen(true)}
              disabled={isLikeLoading}
            />

            <button
              type="button"
              onClick={() => setShowComments((prev) => !prev)}
              className="rounded-full bg-[#f1f1f1] px-4 py-2 text-sm font-medium text-[#343434] hover:bg-[#e5e5e5]"
            >
              {getCommentButtonLabel()}
            </button>
            
          </div>
          


        </footer>

        {showComments && (
          <CommentSection
            postId={post.idPost}
            currentUser={currentUser}
            onCountChange={setCommentTotal}
          />
        )}
      </article>

      {isEditModalOpen && (
        <EditPostModal
          key={post.idPost}
          post={post}
          currentUser={currentUser}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          isSaving={isSavingEdit}
        />
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-[#202020]">
              Excluir publicação?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#666]">
              Essa ação não poderá ser desfeita. O post será removido do feed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="rounded-full bg-[#f1f1f1] px-5 py-2 text-sm font-semibold text-[#343434] transition hover:bg-[#e5e5e5]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
      <PostLikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        users={likedUsers}
      />
    </>
  );
}
