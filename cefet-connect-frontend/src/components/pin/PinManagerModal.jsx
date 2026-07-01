import { useEffect, useMemo, useState } from "react";
import {
  addManualPin,
  listAvailablePins,
} from "../../services/pinService";
import PinBadge from "./PinBadge";

function normalizeText(value = "") {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default function PinManagerModal({
  isOpen,
  onClose,
  userPins = [],
  onPinAdded,
}) {
  const [availablePins, setAvailablePins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("disciplina");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingKey, setSavingKey] = useState("");

  const PIN_NAME_MAX = 80;

  const userPinNames = useMemo(() => {
    return new Set(userPins.map((pin) => normalizeText(pin.nomePin)));
  }, [userPins]);

  const normalizedSearch = normalizeText(search);

  const pinAlreadyExistsInList = availablePins.some(
    (pin) => normalizeText(pin.nomePin) === normalizedSearch
  );

  const searchAlreadyInProfile = userPinNames.has(normalizedSearch);

  const canCreateFromSearch =
    normalizedSearch && !pinAlreadyExistsInList && !searchAlreadyInProfile;

  useEffect(() => {
    if (!isOpen) return;

    async function loadPins() {
      try {
        setIsLoading(true);
        setError("");

        const data = await listAvailablePins(search);
        setAvailablePins(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Não foi possível carregar os pins disponíveis.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPins();
  }, [isOpen, search]);

  if (!isOpen) return null;

  function resetAndClose() {
    setSearch("");
    setSelectedCategory("disciplina");
    setMessage("");
    setError("");
    setSavingKey("");
    onClose();
  }

  async function handleAddPin(nomePin, categoriaPin = selectedCategory) {
    const finalName = nomePin.trim().slice(0, PIN_NAME_MAX);

    if (!finalName) {
      setError("Digite ou escolha um pin para adicionar.");
      return;
    }

    if (userPinNames.has(normalizeText(finalName))) {
      setError("Esse pin já está no seu perfil.");
      return;
    }

    try {
      setSavingKey(finalName);
      setError("");
      setMessage("");

      await addManualPin(finalName, categoriaPin);

      setMessage("Pin adicionado ao perfil.");
      await onPinAdded?.();
      resetAndClose();
    } catch (error) {
      setError(error.message || "Não foi possível adicionar o pin.");
    } finally {
      setSavingKey("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-xl">
        <header className="flex min-w-0 items-center justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-extrabold text-[#202020]">
              Adicionar pin
            </h2>

            <p className="mt-1 text-xs text-[#777]">
              Pesquise pins existentes ou crie um novo pin manual.
            </p>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f1f1] text-xl font-bold text-[#555]"
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value.slice(0, PIN_NAME_MAX));
              setError("");
              setMessage("");
            }}
            maxLength={PIN_NAME_MAX}
            placeholder="Buscar pin. Ex: Cálculo I, PET, Encautech..."
            className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm outline-none focus:border-[#089464]"
          />

          <div className="mt-3">
            <label className="mb-1 block text-xs font-bold text-[#343434]">
              Tipo do pin novo
            </label>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm font-semibold text-[#343434] outline-none focus:border-[#089464]"
            >
              <option value="disciplina">Matéria / Disciplina</option>
              <option value="ic">Iniciação Científica</option>
              <option value="projeto">Projeto</option>
              <option value="monitoria">Monitoria</option>
              <option value="evento">Evento</option>
              <option value="experiencia">Experiência acadêmica</option>
              <option value="outro">Outro</option>
            </select>

            <p className="mt-1 text-xs text-[#777]">
              Esse tipo só será usado quando você criar um pin novo.
            </p>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500 break-words [overflow-wrap:anywhere]">
              {error}
            </p>
          )}

          {message && (
            <p className="mt-4 rounded-2xl bg-[#e8f7ef] px-4 py-3 text-sm text-[#089464] break-words [overflow-wrap:anywhere]">
              {message}
            </p>
          )}

          {canCreateFromSearch && (
            <button
              type="button"
              onClick={() => handleAddPin(search, selectedCategory)}
              disabled={savingKey === search.trim()}
              className="mt-4 flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#c7eadc] bg-[#e8f7ef] px-4 py-3 text-left transition hover:bg-[#d8f0e4] disabled:opacity-60"
            >
              <div className="min-w-0">
                <p className="break-words text-sm font-extrabold text-[#089464] [overflow-wrap:anywhere]">
                  Criar “{search.trim()}”
                </p>

                <p className="mt-1 text-xs text-[#343434]">
                  Esse pin ainda não existe. Ele será criado manualmente.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-[#089464] px-3 py-1 text-xs font-bold text-white">
                Criar
              </span>
            </button>
          )}

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#777]">
              Pins encontrados
            </p>

            <div className="max-h-[280px] space-y-2 overflow-y-auto">
              {isLoading ? (
                <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-sm text-[#777]">
                  Carregando pins...
                </p>
              ) : availablePins.length > 0 ? (
                availablePins.map((pin) => {
                  const alreadyAdded = userPinNames.has(normalizeText(pin.nomePin));
                  const isSaving = savingKey === pin.nomePin;

                  return (
                    <div
                      key={pin.idPin}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#eeeeee] bg-white px-4 py-3"
                    >
                      <PinBadge pin={pin} />

                      {alreadyAdded ? (
                        <span className="shrink-0 rounded-full bg-[#f1f1f1] px-3 py-1 text-xs font-bold text-[#777]">
                          Já adicionado
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddPin(pin.nomePin, pin.categoriaPin)}
                          disabled={isSaving}
                          className="shrink-0 rounded-full bg-[#089464] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                        >
                          {isSaving ? "Adicionando..." : "Adicionar"}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-sm text-[#777]">
                  Nenhum pin encontrado. Digite o nome acima para criar um novo.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}