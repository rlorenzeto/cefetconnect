import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import { getImageUrl } from "../../services/postService";
import { getProfileImageUrl } from "../../services/authService";
import CommentSection from "./CommentSection";


export default function PostImages({ fotos = [], post, currentUser }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleGoToUserProfile() {
    const idAutor = post?.usuario?.idUsuario;

    if (!idAutor) return;

    setIsModalOpen(false);
    navigate(`/profile/${idAutor}`);
  }

  const images = useMemo(() => {
    return fotos.map((foto) => ({
      ...foto,
      src: getImageUrl(foto.url),
    }));
  }, [fotos]);

  const hasImages = images.length > 0;
  const hasMultipleImages = images.length > 1;
  useEffect(() => {
    if (activeIndex > images.length - 1) {
      setActiveIndex(0);
    }
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (!isModalOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, activeIndex, images.length]);

  if (!hasImages) return null;

  function goToPrevious(event) {
    event?.stopPropagation();

    setActiveIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function goToNext(event) {
    event?.stopPropagation();

    setActiveIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  function openModal(index) {
    setActiveIndex(index);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

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

  function getPostLocationLabel() {
    if (post?.comunidade?.nome) {
      return post.comunidade.nome;
    }

    if (post?.fk_Comunidade_idComunidade || post?.comunidade) {
      return "Comunidade";
    }

    return "Feed";
  }

  const currentImage = images[activeIndex] || images[0];

  return (
    <>
      <div className="mt-3 overflow-hidden rounded-2xl border border-[#ececec] bg-black">
        <div className="relative h-[280px] w-full sm:h-[340px] lg:h-[360px]">
          <button
            type="button"
            data-post-image-button={post?.idPost}
            onClick={() => openModal(activeIndex)}
            className="h-full w-full cursor-pointer"
            aria-label="Abrir imagem"
          >
            <img
              src={currentImage.src}
              alt={`Imagem ${activeIndex + 1} do post`}
              className="h-full w-full object-cover"
            />
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl font-bold text-white transition hover:bg-black/65"
                aria-label="Imagem anterior"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-xl font-bold text-white transition hover:bg-black/65"
                aria-label="Próxima imagem"
              >
                ›
              </button>

              <div className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white">
                {activeIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        {hasMultipleImages && (
          <div className="flex justify-center gap-1.5 bg-white py-2">
            {images.map((foto, index) => (
              <button
                key={foto.idFoto || foto.url || index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-5 bg-[#089464]"
                    : "w-2 bg-[#c9c9c9]"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[999] flex flex-col bg-black lg:flex-row"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeModal}
            className="fixed left-4 top-4 z-[1002] flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#202020] shadow-lg transition hover:bg-[#f1f1f1]"
            aria-label="Fechar imagem e voltar para o feed"
          >
            <span className="text-xl leading-none">×</span>
          </button>

          <div
            className="relative flex h-[54dvh] shrink-0 items-center justify-center bg-black px-0 pb-4 pt-16 lg:h-auto lg:min-h-0 lg:flex-1 lg:px-6 lg:py-10"
            onClick={closeModal}
          >
            <img
              src={currentImage.src}
              alt={`Imagem ${activeIndex + 1} ampliada`}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-full object-contain"
            />

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 z-[1001] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-3xl font-bold text-white shadow-lg transition hover:bg-black/90 lg:left-5"
                  aria-label="Imagem anterior"
                >
                  ‹
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 z-[1001] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-3xl font-bold text-white shadow-lg transition hover:bg-black/90 lg:right-5"
                  aria-label="Próxima imagem"
                >
                  ›
                </button>

                <div className="absolute bottom-4 left-1/2 z-[1001] flex -translate-x-1/2 gap-1.5 rounded-full bg-black/60 px-3 py-2 lg:bottom-5">
                  {images.map((foto, index) => (
                    <button
                      key={foto.idFoto || foto.url || index}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeIndex === index
                          ? "w-5 bg-white"
                          : "w-2 bg-white/45"
                      }`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="h-[46dvh] shrink-0 overflow-y-auto bg-white px-4 py-4 lg:h-auto lg:max-h-none lg:w-[360px] lg:max-w-[38vw] lg:px-5 lg:py-5">
            <div className="border-b border-[#eeeeee] pb-4">
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
                    size="composer"
                  />
                </button>

                <div className="min-w-0">
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
                </div>
              </div>
            </div>

            <div className="py-4">
              {post?.conteudo ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#343434]">
                  {post.conteudo}
                </p>
              ) : (
                <p className="text-sm text-[#777]">
                  Publicação sem descrição.
                </p>
              )}

              <p className="mt-4 text-xs text-[#888]">
                {formatDate(post?.dataHoraPublicacao)}
              </p>
            </div>
            <CommentSection postId={post.idPost} currentUser={currentUser} />
            
            {hasMultipleImages && (
              <div className="border-t border-[#eeeeee] pt-3 text-center text-xs font-semibold text-[#777]">
                Imagem {activeIndex + 1} de {images.length}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}