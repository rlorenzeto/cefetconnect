import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";

export default function CreatePostCard({
  user,
  userImageUrl,
  onCreatePost,
  isCreating,
}) {
  const fileInputRef = useRef(null);

  const [conteudo, setConteudo] = useState("");
  const [fotos, setFotos] = useState([]);
  const [destino, setDestino] = useState("feed");
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [error, setError] = useState("");

  const hasContent = conteudo.trim().length > 0 || fotos.length > 0;

  useEffect(() => {
    return () => {
      fotos.forEach((foto) => {
        if (foto.previewUrl) {
          URL.revokeObjectURL(foto.previewUrl);
        }
      });
    };
  }, [fotos]);

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    const totalFotos = fotos.length + selectedFiles.length;

    if (totalFotos > 10) {
      setError("Você pode enviar no máximo 10 imagens.");
      return;
    }

    const formattedFiles = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setFotos((prev) => [...prev, ...formattedFiles]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemovePhoto(photoId) {
    setFotos((prev) => {
      const photoToRemove = prev.find((foto) => foto.id === photoId);

      if (photoToRemove?.previewUrl) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      return prev.filter((foto) => foto.id !== photoId);
    });
  }

  function handleMovePhoto(index, direction) {
    setFotos((prev) => {
      const nextFotos = [...prev];
      const newIndex = direction === "left" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= nextFotos.length) {
        return prev;
      }

      const currentPhoto = nextFotos[index];
      nextFotos[index] = nextFotos[newIndex];
      nextFotos[newIndex] = currentPhoto;

      return nextFotos;
    });
  }

  function handleSelectDestino(value) {
    setDestino(value);
    setIsDestinationOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!conteudo.trim() && fotos.length === 0) {
      setError("Escreva algo ou adicione pelo menos uma imagem.");
      return;
    }

    await onCreatePost({
      conteudo: conteudo.trim(),
      fotos: fotos.map((foto) => foto.file),
      destino,
    });

    fotos.forEach((foto) => {
      if (foto.previewUrl) {
        URL.revokeObjectURL(foto.previewUrl);
      }
    });

    setConteudo("");
    setFotos([]);
    setDestino("feed");
    setIsDestinationOpen(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <section className="rounded-[22px] bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="rounded-[18px] border border-[#d9d9d9] bg-white p-4 transition focus-within:border-[#089464]">
          <div className="mb-3 flex items-start gap-3">
            <ProfileAvatar
              src={userImageUrl}
              name={user?.nomeUsuario}
              size="composer"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#202020]">
                {user?.nomeUsuario || "Usuário"}
              </p>

              <div className="relative mt-1 inline-block">
                <button
                  type="button"
                  onClick={() => setIsDestinationOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e5e7eb] px-2.5 py-0.5 text-xs font-semibold text-[#343434] transition hover:bg-[#d9dce1]"
                >
                  {destino === "feed" ? "Feed" : "Comunidade"}

                  <svg
                    viewBox="0 0 24 24"
                    className={`h-3.5 w-3.5 transition ${
                      isDestinationOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                  >
                    <path
                      d="m6 9 6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {isDestinationOpen && (
                  <div className="absolute left-0 top-9 z-20 w-44 overflow-hidden rounded-2xl border border-[#e3e3e3] bg-white py-2 shadow-lg">
                    <button
                      type="button"
                      onClick={() => handleSelectDestino("feed")}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold transition hover:bg-[#f1f1f1] ${
                        destino === "feed"
                          ? "text-[#089464]"
                          : "text-[#343434]"
                      }`}
                    >
                      Feed

                      {destino === "feed" && (
                        <span className="text-[#089464]">✓</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDestino("comunidade")}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold transition hover:bg-[#f1f1f1] ${
                        destino === "comunidade"
                          ? "text-[#089464]"
                          : "text-[#343434]"
                      }`}
                    >
                      Comunidade

                      {destino === "comunidade" && (
                        <span className="text-[#089464]">✓</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <textarea
            value={conteudo}
            onChange={(event) => {
              setConteudo(event.target.value);
              setError("");
            }}
            maxLength={1000}
            placeholder={`No que você está pensando, ${
              user?.nomeUsuario?.split(" ")?.[0] || "fulano"
            }?`}
            className="min-h-[90px] w-full resize-none border-0 bg-transparent text-base font-medium text-[#202020] outline-none placeholder:text-[#8c8c8c]"
          />

          {fotos.length > 0 && (
            <div className="mt-3 rounded-2xl border border-[#e3e3e3] bg-[#f7f7f7] p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#343434]">
                  Fotos selecionadas
                </p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#089464] shadow-sm"
                >
                  Adicionar mais
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {fotos.map((foto, index) => (
                  <div
                    key={foto.id}
                    className="relative h-16 w-16 overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"
                  >
                    <img
                      src={foto.previewUrl}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(foto.id)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-white"
                      aria-label="Remover foto"
                      title="Remover foto"
                    >
                      ×
                    </button>

                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => handleMovePhoto(index, "left")}
                        disabled={index === 0}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[10px] font-bold text-[#343434] disabled:opacity-40"
                        aria-label="Mover foto para esquerda"
                        title="Mover para esquerda"
                      >
                        ‹
                      </button>

                      <span className="rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                        {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleMovePhoto(index, "right")}
                        disabled={index === fotos.length - 1}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#343434] disabled:opacity-40"
                        aria-label="Mover foto para direita"
                        title="Mover para direita"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e3e3e3] bg-white px-3 py-2">
            <p className="text-xs font-medium text-[#343434]">
              {hasContent
                ? "Adicione fotos ao seu post."
                : "Adicione uma foto ao post! Que tal?"}
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xl transition hover:bg-[#f1f1f1]"
              aria-label="Adicionar fotos"
              title="Adicionar fotos"
            >
              🖼️
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isCreating}
            className="h-9 rounded-full bg-[#089464] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#067f57] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Publicando..." : "Postar"}
          </button>
        </div>
      </form>
    </section>
  );
}