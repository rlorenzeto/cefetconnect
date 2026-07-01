import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import LikeButton from "./LikeButton";
import PostImages from "./PostImages";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import PostLikesModal from "./PostLikesModal";
import EventFormModal from "../event/EventFormModal";
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
import { CommentIcon, EditIcon, TrashIcon } from "../icons/AppIcons";
import EventPostContent from "./EventPostContent";
import {
  deleteEvento,
  participarEvento,
  sairEvento,
  updateEvento,
} from "../../services/eventoService";
import PinDetailsModal from "../pin/PinDetailsModal";
import UserPinsModal from "../pin/UserPinsModal";
import PinBadge from "../pin/PinBadge";

function PostActionMenu({ onEdit, onDelete, canEdit = true, onRankingChanged, }) {
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
          {canEdit && (
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
          )}

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
  onRankingChanged,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [conteudo, setConteudo] = useState(post.conteudo || "");
  const [showComments, setShowComments] = useState(false);
  const [commentTotal, setCommentTotal] = useState(
    Number(post?.totalComentarios ?? post?.comentarios?.length ?? 0)
  );
  const [likeTotal, setLikeTotal] = useState(
    Number(post?.totalCurtidas ?? post?.total ?? 0)
  );

  const [liked, setLiked] = useState(
    Boolean(post?.jaCurtiu ?? post?.curtido ?? false)
  );

  const [likedUsers, setLikedUsers] = useState([]);
  const [likesLoaded, setLikesLoaded] = useState(false);
  const [isLoadingLikedUsers, setIsLoadingLikedUsers] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isParticipatingEvent, setIsParticipatingEvent] = useState(false);
  const [isEventActionLoading, setIsEventActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEventEditModalOpen, setIsEventEditModalOpen] = useState(false);
  const [isSavingEventEdit, setIsSavingEventEdit] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isPinDetailsOpen, setIsPinDetailsOpen] = useState(false);
  const [isUserPinsModalOpen, setIsUserPinsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const event = post?.evento || null;
  const isEventPost = Boolean(event?.idEvento);
  const isEventFinished = isEventPost && isPastEvent(event?.dataEvento);

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
  
  const communityOwnerId = String(
    post?.comunidade?.criador?.idUsuario ||
      post?.comunidade?.idCriador ||
      ""
  );

  const isCommunityAdmin =
    communityOwnerId &&
    currentUserId &&
    communityOwnerId === currentUserId;

  const canManagePost = isOwner || isCommunityAdmin;

  useEffect(() => {
    setConteudo(post.conteudo || "");
  }, [post.conteudo]);

  useEffect(() => {
    setCommentTotal(Number(post?.totalComentarios ?? post?.comentarios?.length ?? 0));
  }, [post?.totalComentarios, post?.comentarios?.length]);

  useEffect(() => {
    if (isEventPost) return;

    setLikeTotal(Number(post?.totalCurtidas ?? post?.total ?? 0));
    setLiked(Boolean(post?.jaCurtiu ?? post?.curtido ?? false));

    setLikedUsers([]);
    setLikesLoaded(false);
  }, [
    post?.idPost,
    post?.totalCurtidas,
    post?.jaCurtiu,
    post?.total,
    post?.curtido,
    isEventPost,
  ]);

  useEffect(() => {
    if (!isEventPost || !event) return;

    const participantes = Array.isArray(event?.participantes)
      ? event.participantes
      : [];

    const alreadyParticipating = participantes.some(
      (usuario) =>
        String(usuario?.idUsuario || "") ===
        String(currentUser?.idUsuario || "")
    );

    setIsParticipatingEvent(Boolean(event?.isParticipando || alreadyParticipating));
  }, [isEventPost, event, currentUser?.idUsuario]);

  function normalizeDate(date) {
    if (!date) return null;

    const value = String(date);

    const hasTimezone =
      value.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(value);

    const normalizedValue = hasTimezone ? value : `${value}Z`;

    return new Date(normalizedValue);
  }

  function formatDate(date) {
    const parsedDate = normalizeDate(date);

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);
  }

  function isPastEvent(date) {
    const parsedDate = normalizeDate(date);

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) return false;

    return parsedDate < new Date();
  }

  function getPostLocationLabel() {
    if (isEventPost) {
      const eventCommunityName =
        event?.comunidade?.nomeComunidade ||
        post?.comunidade?.nomeComunidade;

      return eventCommunityName
        ? `Evento em ${eventCommunityName}`
        : "Evento público";
    }

    const communityName =
      post?.comunidade?.nomeComunidade ||
      post?.comunidade?.nome ||
      post?.nomeComunidade;

    if (communityName) {
      return communityName;
    }

    const communityId =
      post?.fk_Comunidade_idComunidade ||
      post?.idComunidade ||
      post?.comunidade?.idComunidade;

    if (communityId) {
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
        setLikedUsers([]);
        setLikesLoaded(false);
        onRankingChanged?.();
      } else {
        await likePost(post.idPost);

        setLiked(true);
        setLikeTotal((prev) => prev + 1);
        setLikedUsers([]);
        setLikesLoaded(false);

        onRankingChanged?.();
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

  async function handleToggleEventParticipation() {
    if (!event?.idEvento) return;

    if (isEventFinished) {
      setError("Este evento já foi finalizado.");
      return;
    }

    try {
      setIsEventActionLoading(true);
      setError("");

      if (isParticipatingEvent) {
        await sairEvento(event.idEvento);
        setIsParticipatingEvent(false);
      } else {
        await participarEvento(event.idEvento);
        setIsParticipatingEvent(true);
      }
    } catch (error) {
      setError(error.message || "Não foi possível atualizar sua participação.");
    } finally {
      setIsEventActionLoading(false);
    }
  }

  async function handleDoubleClick() {
    if (isEventPost) return;

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

  async function handleSaveEventEdit(payload) {
    if (!event?.idEvento) return;

    try {
      setIsSavingEventEdit(true);
      setError("");

      const response = await updateEvento(event.idEvento, payload);
      const updatedEvent = response?.dados || response;

      onPostUpdated({
        ...post,
        evento: {
          ...event,
          ...updatedEvent,
        },
        conteudo: updatedEvent?.descricaoEvento || post.conteudo,
      });

      setIsEventEditModalOpen(false);
    } catch (error) {
      setError(error.message || "Não foi possível atualizar o evento.");
    } finally {
      setIsSavingEventEdit(false);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setError("");

      if (isEventPost && event?.idEvento) {
        await deleteEvento(event.idEvento);
      } else {
        await deletePost(post.idPost);
      }

      onPostDeleted(post.idPost);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError(
        error.message ||
          (isEventPost
            ? "Não foi possível excluir o evento."
            : "Não foi possível excluir o post.")
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function getCommentButtonLabel() {
    const totalText =
      commentTotal === 1 ? "1 comentário" : `${commentTotal} comentários`;

    return showComments
      ? `(${totalText})`
      : `(${totalText})`;
  }

  function handleOpenPin(pin) {
    setSelectedPin(pin);
    setIsPinDetailsOpen(true);
  }

  const authorPins = Array.isArray(post?.usuario?.pins)
    ? post.usuario.pins
    : [];

  const visibleAuthorPins = authorPins.slice(0, 3);

  async function handleOpenLikesModal() {
    if (isEventPost) return;

    setIsLikesModalOpen(true);

    if (likesLoaded || isLoadingLikedUsers) return;

    try {
      setIsLoadingLikedUsers(true);

      const response = await getPostLikes(post.idPost);
      const dados = response?.dados || response;

      const usuarios = Array.isArray(dados?.usuarios) ? dados.usuarios : [];

      setLikedUsers(usuarios);
      setLikeTotal(Number(dados?.total ?? usuarios.length ?? 0));

      const userLiked = usuarios.some(
        (usuario) =>
          String(usuario?.idUsuario || "") ===
          String(currentUser?.idUsuario || "")
      );

      setLiked(userLiked);
      setLikesLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar curtidas:", error);
    } finally {
      setIsLoadingLikedUsers(false);
    }
  }

  return (
    <>
      <article
        onDoubleClick={handleDoubleClick}
        className={`w-full min-w-0 max-w-full overflow-hidden rounded-[24px] bg-white p-4 shadow-sm ${
          isEventPost ? "border border-[#d8f0e4]" : ""
        }`}
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

            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={handleGoToUserProfile}
                className="block max-w-[220px] truncate text-left text-sm font-bold text-[#202020] transition hover:underline"
              >
                {post?.usuario?.nomeUsuario || "Usuário"}
              </button>

              {authorPins.length > 0 && (
                <div className="mt-1 flex max-w-full items-center gap-1 overflow-x-auto pb-1">
                  {visibleAuthorPins.map((pin) => (
                    <PinBadge
                      key={pin.idPin}
                      pin={pin}
                      compact
                      onClick={handleOpenPin}
                    />
                  ))}

                  {authorPins.length > visibleAuthorPins.length && (
                    <button
                      type="button"
                      onClick={() => setIsUserPinsModalOpen(true)}
                      className="shrink-0 rounded-full bg-[#f1f1f1] px-2.5 py-1 text-[11px] font-extrabold text-[#555] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
                    >
                      +{authorPins.length - visibleAuthorPins.length}
                    </button>
                  )}

                  {authorPins.length <= visibleAuthorPins.length && (
                    <button
                      type="button"
                      onClick={() => setIsUserPinsModalOpen(true)}
                      className="shrink-0 rounded-full bg-[#f1f1f1] px-2.5 py-1 text-[11px] font-extrabold text-[#555] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
                    >
                      Ver pins
                    </button>
                  )}
                </div>
              )}

              <p className="mt-1 text-xs text-[#777]">
                Publicado em {getPostLocationLabel()}
              </p>

              <p className="text-xs text-[#777]">
                {formatDate(post.dataHoraPublicacao)}
              </p>
            </div>
          </div>

          {canManagePost && (
            <PostActionMenu
              onEdit={
                isOwner
                  ? () => {
                      if (isEventPost) {
                        setIsEventEditModalOpen(true);
                      } else {
                        setIsEditModalOpen(true);
                      }
                    }
                  : undefined
              }
              onDelete={() => setIsDeleteModalOpen(true)}
              canEdit={isOwner}
            />
          )}
        </header>
        <div className="mt-4 min-w-0 max-w-full">
          {isEventPost ? (
            <EventPostContent
              event={event}
              formatDate={formatDate}
            />
          ) : (
            <>
              {post.conteudo && (
                <p className="max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-[#343434] [overflow-wrap:anywhere]">
                  {post.conteudo}
                </p>
              )}

              <PostImages
                fotos={post.fotosPost || []}
                post={post}
                currentUser={currentUser}
                onRankingChanged={onRankingChanged}
              />
            </>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {isEventPost ? (
              <button
                type="button"
                onClick={handleToggleEventParticipation}
                disabled={isEventActionLoading || isEventFinished}
                className={`rounded-full px-4 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isEventFinished
                    ? "bg-[#c7eadc] text-[#089464]"
                    : isParticipatingEvent
                      ? "border border-red-200 text-red-500 hover:bg-red-50"
                      : "bg-[#089464] text-white hover:bg-[#067f57]"
                }`}
              >
                {isEventFinished
                  ? "Evento finalizado"
                  : isParticipatingEvent
                    ? "Sair do evento"
                    : "Participar"}
              </button>            
            ) : (
              <LikeButton
                liked={liked}
                total={likeTotal}
                onClick={handleToggleLike}
                onRankingChanged={onRankingChanged}
                onTotalClick={handleOpenLikesModal}
                disabled={isLikeLoading}
              />
            )}

            <button
              type="button"
              onClick={() => setShowComments((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-[#f1f1f1] px-4 py-2 text-sm font-medium text-[#343434] transition hover:bg-[#e5e5e5]"
            >
              <CommentIcon className="h-5 w-5" />
              <span>{getCommentButtonLabel()}</span>
            </button>
            
          </div>
          


        </footer>

        {showComments && (
          <CommentSection
            postId={post.idPost}
            currentUser={currentUser}
            onCountChange={setCommentTotal}
            onRankingChanged={onRankingChanged}
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

      {isEventEditModalOpen && (
        <EventFormModal
          key={event?.idEvento}
          isOpen={isEventEditModalOpen}
          event={event}
          communities={[]}
          isSaving={isSavingEventEdit}
          onClose={() => setIsEventEditModalOpen(false)}
          onSubmit={handleSaveEventEdit}
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
              {isEventPost ? "Excluir evento?" : "Excluir publicação?"}
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#666]">
              {isEventPost
                ? "Essa ação não poderá ser desfeita. O evento será removido do feed e da página de eventos."
                : "Essa ação não poderá ser desfeita. O post será removido."}
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
                {isDeleting ? "Excluindo..." : isEventPost ? "Excluir evento" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
      {!isEventPost && (
        <PostLikesModal
          isOpen={isLikesModalOpen}
          onClose={() => setIsLikesModalOpen(false)}
          users={likedUsers}
          isLoading={isLoadingLikedUsers}
        />
      )}
      <PinDetailsModal
        pin={selectedPin}
        isOpen={isPinDetailsOpen}
        onClose={() => setIsPinDetailsOpen(false)}
      />

      <UserPinsModal
        isOpen={isUserPinsModalOpen}
        onClose={() => setIsUserPinsModalOpen(false)}
        user={post?.usuario}
        pins={authorPins}
        onOpenPin={handleOpenPin}
      />
    </>
  );
}
