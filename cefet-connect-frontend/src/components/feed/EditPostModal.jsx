import { useEffect, useRef, useState } from "react";
import ProfileAvatar from "../profile/ProfileAvatar";
import { getImageUrl } from "../../services/postService";
import { getProfileImageUrl } from "../../services/authService";

export default function EditPostModal({
  post,
  currentUser,
  onClose,
  onSave,
  isSaving,
}) {
  const fileInputRef = useRef(null);

  const [conteudo, setConteudo] = useState(() => post?.conteudo || "");

  const [destino, setDestino] = useState(() =>
    post?.fk_Comunidade_idComunidade || post?.comunidade
      ? "comunidade"
      : "feed"
  );

  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  const [existingPhotos, setExistingPhotos] = useState(
    () => post?.fotosPost || []
  );

  const [removedPhotoIds, setRemovedPhotoIds] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    return () => {
      newPhotos.forEach((foto) => {
        if (foto.previewUrl) {
          URL.revokeObjectURL(foto.previewUrl);
        }
      });
    };
  }, [newPhotos]);

  const totalPhotos = existingPhotos.length + newPhotos.length;
  const hasContent = conteudo.trim().length > 0 || totalPhotos > 0;

  function handleSelectDestino(value) {
    setDestino(value);
    setIsDestinationOpen(false);
  }

  function handleRemoveExistingPhoto(photo) {
    setExistingPhotos((prev) =>
      prev.filter((foto) => foto.idFoto !== photo.idFoto)
    );

    setRemovedPhotoIds((prev) => [...prev, photo.idFoto]);
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    if (totalPhotos + selectedFiles.length > 10) {
      setError("Você pode manter no máximo 10 imagens no post.");
      return;
    }

    const formattedFiles = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewPhotos((prev) => [...prev, ...formattedFiles]);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveNewPhoto(photoId) {
    setNewPhotos((prev) => {
      const photoToRemove = prev.find((foto) => foto.id === photoId);

      if (photoToRemove?.previewUrl) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      return prev.filter((foto) => foto.id !== photoId);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!hasContent) {
      setError("O post precisa ter texto ou pelo menos uma imagem.");
      return;
    }

    await onSave({
      conteudo: conteudo.trim(),
      destino,
      idsFotosRemover: removedPhotoIds,
      novasFotos: newPhotos.map((foto) => foto.file),
    });
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-3 py-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-[24px] bg-white shadow-xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eeeeee] bg-white px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-sm font-semibold text-[#555] transition hover:bg-[#f1f1f1]"
          >
            Cancelar
          </button>

          <h2 className="text-base font-bold text-[#202020]">
            Editar publicação
          </h2>

          <button
            type="submit"
            form="edit-post-form"
            disabled={isSaving}
            className="rounded-full bg-[#089464] px-4 py-1.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        </header>

        <form id="edit-post-form" onSubmit={handleSubmit} className="p-5">
          <div className="mb-4 flex items-start gap-3">
            <ProfileAvatar
              src={getProfileImageUrl(currentUser?.fotoUrl)}
              name={currentUser?.nomeUsuario}
              size="composer"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#202020]">
                {currentUser?.nomeUsuario || "Usuário"}
              </p>

              <div className="relative mt-1 inline-block">
                <button
                  type="button"
                  onClick={() => setIsDestinationOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#e5e7eb] px-2.5 py-0.5 text-xs font-semibold text-[#343434] transition hover:bg-[#d9dce1]"
                >
                  {destino === "feed" ? "Feed" : "Comunidade"}

                  <span className={isDestinationOpen ? "rotate-180" : ""}>
                    ▾
                  </span>
                </button>

                {isDestinationOpen && (
                  <div className="absolute left-0 top-8 z-20 w-44 overflow-hidden rounded-2xl border border-[#e3e3e3] bg-white py-2 shadow-lg">
                    <button
                      type="button"
                      onClick={() => handleSelectDestino("feed")}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold hover:bg-[#f1f1f1] ${
                        destino === "feed" ? "text-[#089464]" : "text-[#343434]"
                      }`}
                    >
                      Feed
                      {destino === "feed" && <span>✓</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectDestino("comunidade")}
                      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold hover:bg-[#f1f1f1] ${
                        destino === "comunidade" ? "text-[#089464]" : "text-[#343434]"
                      }`}
                    >
                      Comunidade
                      {destino === "comunidade" && <span>✓</span>}
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
            placeholder="Edite o texto da publicação..."
            className="min-h-[130px] w-full resize-none rounded-2xl border border-[#d9d9d9] bg-[#f7f7f7] px-4 py-3 text-sm text-[#202020] outline-none focus:border-[#089464]"
          />

          {(existingPhotos.length > 0 || newPhotos.length > 0) && (
            <div className="mt-4 rounded-2xl border border-[#e3e3e3] bg-[#f7f7f7] p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-[#343434]">
                  Imagens do post
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
                {existingPhotos.map((foto) => (
                  <div
                    key={foto.idFoto || foto.url}
                    className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"
                  >
                    <img
                      src={getImageUrl(foto.url)}
                      alt="Foto existente do post"
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveExistingPhoto(foto)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-xs font-bold text-white"
                      aria-label="Remover foto"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {newPhotos.map((foto) => (
                  <div
                    key={foto.id}
                    className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"
                  >
                    <img
                      src={foto.previewUrl}
                      alt={foto.name}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveNewPhoto(foto.id)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-xs font-bold text-white"
                      aria-label="Remover foto nova"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#e3e3e3] bg-white px-3 py-2">
            <p className="text-xs font-medium text-[#343434]">
              Adicione ou remova imagens da publicação.
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
        </form>
      </div>
    </div>
  );
}