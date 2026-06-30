import { useEffect, useState } from "react";
import CommunitySelectorModal from "../community/CommunitySelectorModal";
import { ImageIcon } from "../icons/AppIcons";

const EVENT_TITLE_MAX = 255;
const EVENT_DESCRIPTION_MAX = 1000;
const EVENT_LOCATION_MAX = 255;

function getEventFormErrorMessage(error) {
  const message = String(error?.message || "");

  if (
    message.includes("Data too long") &&
    (message.includes("titulo") || message.includes("tituloEvento"))
  ) {
    return `O nome do evento pode ter no máximo ${EVENT_TITLE_MAX} caracteres.`;
  }

  if (
    message.includes("Data too long") &&
    (message.includes("descricaoEvento") || message.includes("conteudo"))
  ) {
    return `A descrição do evento pode ter no máximo ${EVENT_DESCRIPTION_MAX} caracteres.`;
  }

  if (
    message.includes("Data too long") &&
    message.includes("localEvento")
  ) {
    return `O local do evento pode ter no máximo ${EVENT_LOCATION_MAX} caracteres.`;
  }

  if (message.includes("A data do evento precisa ser futura")) {
    return "A data do evento precisa ser futura.";
  }

  return message || "Não foi possível salvar o evento.";
}

function PhotoUploadField({ id, label, placeholder, file, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-[#343434]">
        {label}
      </label>

      <label
        htmlFor={id}
        className="flex h-14 w-full cursor-pointer items-center justify-between rounded-xl border border-[#d9d9d9] bg-white px-4 text-sm text-[#343434] transition hover:border-[#089464]"
      >
        <span className="min-w-0 truncate">
          {file ? file.name : placeholder}
        </span>

        <span className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8f7ef] text-[#089464]">
          <ImageIcon className="h-5 w-5" />
        </span>
      </label>

      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}

export default function EventFormModal({
  isOpen,
  event,
  communities = [],
  isSaving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    titulo: "",
    descricaoEvento: "",
    localEvento: "",
    dataEvento: "",
    tipo: "publico",
    comunidadeId: "",
  });

  const [capaEvento, setCapaEvento] = useState(null);
  const [fotoUrlEvento, setFotoUrlEvento] = useState(null);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const communityId = event?.comunidade?.idComunidade || "";

    setForm({
      titulo: (event?.titulo || "").slice(0, EVENT_TITLE_MAX),
      descricaoEvento: (event?.descricaoEvento || "").slice(0, EVENT_DESCRIPTION_MAX),
      localEvento: (event?.localEvento || "").slice(0, EVENT_LOCATION_MAX),
      dataEvento: event?.dataEvento
        ? new Date(event.dataEvento).toISOString().slice(0, 16)
        : "",
      tipo: communityId ? "comunidade" : "publico",
      comunidadeId: communityId,
    });

    setCapaEvento(null);
    setFotoUrlEvento(null);
    setError("");
  }, [isOpen, event]);

  if (!isOpen) return null;

  const selectedCommunity = communities.find(
    (community) => String(community.idComunidade) === String(form.comunidadeId)
  );

  function handleChange(event) {
    const { name, value } = event.target;

    const limits = {
      titulo: EVENT_TITLE_MAX,
      descricaoEvento: EVENT_DESCRIPTION_MAX,
      localEvento: EVENT_LOCATION_MAX,
    };

    const limit = limits[name];
    const limitedValue = limit ? value.slice(0, limit) : value;

    setForm((prev) => ({
      ...prev,
      [name]: limitedValue,
    }));

    setError("");
  }

  function handleSelectTipo(tipo) {
    if (tipo === "publico") {
      setForm((prev) => ({
        ...prev,
        tipo: "publico",
        comunidadeId: "",
      }));
      return;
    }

    if (communities.length === 0) {
      setError("Você precisa participar de uma comunidade para vincular o evento.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      tipo: "comunidade",
    }));

    setIsCommunityModalOpen(true);
  }

  function handleSelectCommunity(community) {
    setForm((prev) => ({
      ...prev,
      tipo: "comunidade",
      comunidadeId: community.idComunidade,
    }));

    setIsCommunityModalOpen(false);
    setError("");
  }

  function getLocalDatetimeNow() {
    const now = new Date();
    now.setSeconds(0, 0);

    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60000);

    return localDate.toISOString().slice(0, 16);
  }

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

    const titulo = form.titulo.trim();
    const descricaoEvento = form.descricaoEvento.trim();
    const localEvento = form.localEvento.trim();

    if (!titulo) {
      setError("O nome do evento é obrigatório.");
      return;
    }

    if (titulo.length > EVENT_TITLE_MAX) {
      setError(`O nome do evento pode ter no máximo ${EVENT_TITLE_MAX} caracteres.`);
      return;
    }

    if (!descricaoEvento) {
      setError("A descrição do evento é obrigatória.");
      return;
    }

    if (descricaoEvento.length > EVENT_DESCRIPTION_MAX) {
      setError(
        `A descrição do evento pode ter no máximo ${EVENT_DESCRIPTION_MAX} caracteres.`
      );
      return;
    }

    if (!localEvento) {
      setError("O local do evento é obrigatório.");
      return;
    }

    if (localEvento.length > EVENT_LOCATION_MAX) {
      setError(`O local do evento pode ter no máximo ${EVENT_LOCATION_MAX} caracteres.`);
      return;
    }

    if (!form.dataEvento) {
      setError("A data do evento é obrigatória.");
      return;
    }

    const selectedDate = new Date(form.dataEvento);
    const now = new Date();

    if (selectedDate <= now) {
      setError("A data do evento precisa ser futura.");
      return;
    }

    if (form.tipo === "comunidade" && !form.comunidadeId) {
      setError("Selecione uma comunidade para o evento.");
      setIsCommunityModalOpen(true);
      return;
    }

    try {
      await onSubmit({
        titulo,
        descricaoEvento,
        localEvento,
        dataEvento: new Date(form.dataEvento).toISOString(),
        status: true,
        comunidadeId: form.tipo === "comunidade" ? form.comunidadeId : "",
        capaEvento,
        fotoUrlEvento,
      });
    } catch (error) {
      setError(getEventFormErrorMessage(error));
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
        <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[28px] bg-white p-6 shadow-xl">
          <header className="mb-5 flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-[#202020]">
                {event ? "Editar evento" : "Novo evento"}
              </h2>

              <p className="mt-1 text-sm text-[#777]">
                Conte-nos mais sobre o seu evento.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f1f1] text-xl text-[#343434]"
            >
              ×
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-semibold text-[#343434]">
                Quem pode ver o seu evento?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectTipo("publico")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                    form.tipo === "publico"
                      ? "border-[#089464] bg-[#e8f7ef] text-[#089464]"
                      : "border-[#d9d9d9] bg-white text-[#343434]"
                  }`}
                >
                  Público
                  <span className="mt-1 block text-xs font-normal text-[#777]">
                    Aparece no feed principal.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTipo("comunidade")}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${
                    form.tipo === "comunidade"
                      ? "border-[#089464] bg-[#e8f7ef] text-[#089464]"
                      : "border-[#d9d9d9] bg-white text-[#343434]"
                  }`}
                >
                  Comunidade
                  <span className="mt-1 block text-xs font-normal text-[#777]">
                    Aparece nos posts da comunidade.
                  </span>
                </button>
              </div>

              {form.tipo === "comunidade" && (
                <button
                  type="button"
                  onClick={() => setIsCommunityModalOpen(true)}
                  className="mt-3 w-full max-w-full overflow-hidden break-words rounded-2xl bg-[#f1f1f1] px-4 py-3 text-left text-sm font-bold text-[#343434] [overflow-wrap:anywhere]"
                >
                  {selectedCommunity
                    ? selectedCommunity.nomeComunidade
                    : "Selecionar comunidade"}
                </button>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#343434]">
                Nome do evento
              </label>

              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                maxLength={EVENT_TITLE_MAX}
                className="h-11 w-full max-w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 text-sm outline-none focus:border-[#089464]"
              />

              <p className="mt-1 text-right text-xs text-[#777]">
                {form.titulo.length}/{EVENT_TITLE_MAX}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#343434]">
                Descrição
              </label>
              <textarea
                name="descricaoEvento"
                value={form.descricaoEvento}
                onChange={handleChange}
                maxLength={EVENT_DESCRIPTION_MAX}
                rows={5}
                className="w-full max-w-full resize-none rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 py-3 text-sm outline-none focus:border-[#089464] whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
              />

              <p className="mt-1 text-right text-xs text-[#777]">
                {form.descricaoEvento.length}/{EVENT_DESCRIPTION_MAX}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#343434]">
                Data e horário
              </label>

              <input
                type="datetime-local"
                name="dataEvento"
                value={form.dataEvento}
                min={getLocalDatetimeNow()}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 text-sm outline-none focus:border-[#089464]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-[#343434]">
                Local
              </label>

              <input
                type="text"
                name="localEvento"
                value={form.localEvento}
                onChange={handleChange}
                maxLength={EVENT_LOCATION_MAX}
                className="h-11 w-full max-w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 text-sm outline-none focus:border-[#089464]"
              />

              <p className="mt-1 text-right text-xs text-[#777]">
                {form.localEvento.length}/{EVENT_LOCATION_MAX}
              </p>
            </div>

            <PhotoUploadField
              id="capa-evento-input"
              label="Foto de capa do evento"
              placeholder="Adicione uma capa para o evento!"
              file={capaEvento}
              onChange={(event) =>
                setCapaEvento(event.target.files?.[0] || null)
              }
            />

            {error && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500 break-words [overflow-wrap:anywhere]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="h-11 w-full rounded-full bg-[#089464] text-sm font-bold text-white disabled:opacity-60"
            >
              {isSaving ? "Salvando..." : "Avançar"}
            </button>
          </form>
        </div>
      </div>

      <CommunitySelectorModal
        isOpen={isCommunityModalOpen}
        communities={communities}
        selectedCommunityId={form.comunidadeId}
        onSelect={handleSelectCommunity}
        onClose={() => setIsCommunityModalOpen(false)}
      />
    </>
  );
}