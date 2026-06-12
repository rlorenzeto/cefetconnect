import { useEffect, useMemo, useState } from "react";
import {
  addPinToCommunity,
  listAvailablePins,
  removePinFromCommunity,
} from "../../services/pinService";
import PinBadge from "./PinBadge";

export default function CommunityPinsManagerModal({
  isOpen,
  onClose,
  community,
  currentPins = [],
  onUpdated,
}) {
  const [availablePins, setAvailablePins] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");

  const currentPinIds = useMemo(() => {
    return new Set(currentPins.map((pin) => String(pin.idPin)));
  }, [currentPins]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadPins() {
      try {
        setIsLoading(true);
        setError("");

        const response = await listAvailablePins(search);
        setAvailablePins(Array.isArray(response) ? response : []);
      } catch (error) {
        setError(error.message || "Não foi possível carregar os pins.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPins();
  }, [isOpen, search]);

  if (!isOpen) return null;

  async function handleAdd(pin) {
    if (!community?.idComunidade || !pin?.idPin) return;

    try {
      setSavingId(pin.idPin);
      setError("");

      await addPinToCommunity(pin.idPin, community.idComunidade);
      await onUpdated?.();
    } catch (error) {
      setError(error.message || "Não foi possível adicionar o pin.");
    } finally {
      setSavingId("");
    }
  }

  async function handleRemove(pin) {
    if (!community?.idComunidade || !pin?.idPin) return;

    try {
      setSavingId(pin.idPin);
      setError("");

      await removePinFromCommunity(pin.idPin, community.idComunidade);
      await onUpdated?.();
    } catch (error) {
      setError(error.message || "Não foi possível remover o pin.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#202020]">
              Pins da comunidade
            </h2>

            <p className="mt-1 text-xs text-[#777]">
              Adicione pins que combinam com {community?.nomeComunidade}.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f1f1] text-xl font-bold text-[#555]"
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="max-h-[72vh] overflow-y-auto px-5 py-5">
          <div className="mb-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#777]">
              Pins já relacionados
            </p>

            {currentPins.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentPins.map((pin) => (
                  <span key={pin.idPin} className="inline-flex items-center gap-1">
                    <PinBadge pin={pin} />

                    <button
                      type="button"
                      onClick={() => handleRemove(pin)}
                      disabled={savingId === pin.idPin}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500 hover:bg-red-100 disabled:opacity-60"
                      title="Remover pin da comunidade"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-[#f7f7f7] px-4 py-3 text-sm text-[#777]">
                Nenhum pin relacionado ainda.
              </p>
            )}
          </div>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar pin. Ex: Cálculo I, IC, Projeto..."
            className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm outline-none focus:border-[#089464]"
          />

          {error && (
            <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="mt-4 space-y-2">
            {isLoading ? (
              <p className="rounded-2xl bg-[#f7f7f7] px-4 py-3 text-sm text-[#777]">
                Carregando pins...
              </p>
            ) : availablePins.length > 0 ? (
              availablePins.map((pin) => {
                const alreadyAdded = currentPinIds.has(String(pin.idPin));

                return (
                  <div
                    key={pin.idPin}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#eeeeee] bg-white px-4 py-3"
                  >
                    <PinBadge pin={pin} />

                    {alreadyAdded ? (
                      <span className="rounded-full bg-[#e8f7ef] px-3 py-1 text-xs font-bold text-[#089464]">
                        Adicionado
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(pin)}
                        disabled={savingId === pin.idPin}
                        className="rounded-full bg-[#089464] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
                      >
                        {savingId === pin.idPin ? "Adicionando..." : "Adicionar"}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="rounded-2xl bg-[#f7f7f7] px-4 py-3 text-sm text-[#777]">
                Nenhum pin encontrado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}