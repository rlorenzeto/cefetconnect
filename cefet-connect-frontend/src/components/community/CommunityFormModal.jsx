import { useState } from "react";
import { ImageIcon } from "../icons/AppIcons";

const COMMUNITY_NAME_MAX = 100;
const COMMUNITY_DESCRIPTION_MAX = 255;

function getCommunityFormErrorMessage(error) {
  const message = String(error?.message || "");

  if (
    message.includes("descricaoComunidade") ||
    message.includes("Data too long")
  ) {
    return `A descrição da comunidade pode ter no máximo ${COMMUNITY_DESCRIPTION_MAX} caracteres.`;
  }

  if (message.includes("nomeComunidade")) {
    return `O nome da comunidade pode ter no máximo ${COMMUNITY_NAME_MAX} caracteres.`;
  }

  return message || "Não foi possível salvar a comunidade.";
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

export default function CommunityFormModal({
  isOpen,
  community,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => ({
    nomeComunidade: (community?.nomeComunidade || "").slice(
      0,
      COMMUNITY_NAME_MAX
    ),
    descricaoComunidade: (community?.descricaoComunidade || "").slice(
      0,
      COMMUNITY_DESCRIPTION_MAX
    ),
  }));

  const [capaComunidade, setCapaComunidade] = useState(null);
  const [fotoUrlComunidade, setFotoUrlComunidade] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;

    const limits = {
      nomeComunidade: COMMUNITY_NAME_MAX,
      descricaoComunidade: COMMUNITY_DESCRIPTION_MAX,
    };

    const limit = limits[name];
    const limitedValue = limit ? value.slice(0, limit) : value;

    setForm((prev) => ({
      ...prev,
      [name]: limitedValue,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nomeComunidade = form.nomeComunidade.trim();
    const descricaoComunidade = form.descricaoComunidade.trim();

    if (!nomeComunidade) {
      setError("O nome da comunidade é obrigatório.");
      return;
    }

    if (nomeComunidade.length > COMMUNITY_NAME_MAX) {
      setError(`O nome da comunidade pode ter no máximo ${COMMUNITY_NAME_MAX} caracteres.`);
      return;
    }

    if (descricaoComunidade.length > COMMUNITY_DESCRIPTION_MAX) {
      setError(
        `A descrição da comunidade pode ter no máximo ${COMMUNITY_DESCRIPTION_MAX} caracteres.`
      );
      return;
    }

    try {
      await onSubmit({
        nomeComunidade,
        descricaoComunidade,
        capaComunidade,
        fotoUrlComunidade,
      });
    } catch (error) {
      setError(getCommunityFormErrorMessage(error));
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-[28px] bg-white p-6 shadow-xl">
        <header className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#202020]">
            {community ? "Editar comunidade" : "Nova comunidade"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f1f1] text-xl text-[#343434]"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#343434]">
              Nome da comunidade
            </label>

            <input
              type="text"
              name="nomeComunidade"
              value={form.nomeComunidade}
              onChange={handleChange}
              maxLength={COMMUNITY_NAME_MAX}
              className="h-11 w-full max-w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 text-sm outline-none focus:border-[#089464]"
            />

            <p className="mt-1 text-right text-xs text-[#777]">
              {form.nomeComunidade.length}/{COMMUNITY_NAME_MAX}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#343434]">
              Descrição
            </label>

            <textarea
              name="descricaoComunidade"
              value={form.descricaoComunidade}
              onChange={handleChange}
              maxLength={COMMUNITY_DESCRIPTION_MAX}
              rows={5}
              className="w-full max-w-full resize-none rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 py-3 text-sm outline-none focus:border-[#089464] whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
            />

            <p className="mt-1 text-right text-xs text-[#777]">
              {form.descricaoComunidade.length}/{COMMUNITY_DESCRIPTION_MAX}
            </p>
          </div>

          <PhotoUploadField
            id="capa-comunidade-input"
            label="Capa da comunidade"
            placeholder="Adicione uma capa para a comunidade!"
            file={capaComunidade}
            onChange={(event) =>
              setCapaComunidade(event.target.files?.[0] || null)
            }
          />

          <PhotoUploadField
            id="foto-comunidade-input"
            label="Foto da comunidade"
            placeholder="Adicione uma foto para a comunidade!"
            file={fotoUrlComunidade}
            onChange={(event) =>
              setFotoUrlComunidade(event.target.files?.[0] || null)
            }
          />

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500 break-words [overflow-wrap:anywhere]">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full bg-[#f1f1f1] px-5 py-2 text-sm font-semibold text-[#343434]"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-[#089464] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}