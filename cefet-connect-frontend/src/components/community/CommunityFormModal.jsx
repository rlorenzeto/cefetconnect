import { useState } from "react";

export default function CommunityFormModal({
  isOpen,
  community,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => ({
    nomeComunidade: community?.nomeComunidade || "",
    descricaoComunidade: community?.descricaoComunidade || "",
  }));

  const [capaComunidade, setCapaComunidade] = useState(null);
  const [fotoUrlComunidade, setFotoUrlComunidade] = useState(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.nomeComunidade.trim()) {
      setError("O nome da comunidade é obrigatório.");
      return;
    }

    onSubmit({
      nomeComunidade: form.nomeComunidade.trim(),
      descricaoComunidade: form.descricaoComunidade.trim(),
      capaComunidade,
      fotoUrlComunidade,
    });
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
              maxLength={100}
              className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 text-sm outline-none focus:border-[#089464]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#343434]">
              Descrição
            </label>

            <textarea
              name="descricaoComunidade"
              value={form.descricaoComunidade}
              onChange={handleChange}
              maxLength={500}
              rows={5}
              className="w-full resize-none rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-3 py-3 text-sm outline-none focus:border-[#089464]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#343434]">
              Capa da comunidade
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setCapaComunidade(event.target.files?.[0] || null)
              }
              className="block w-full text-sm text-[#343434]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#343434]">
              Foto da comunidade
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFotoUrlComunidade(event.target.files?.[0] || null)
              }
              className="block w-full text-sm text-[#343434]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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