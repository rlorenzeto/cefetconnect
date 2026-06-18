import { useEffect, useMemo, useState } from "react";
import {
  addManualPin,
  importPinsFromGradment,
  listAvailablePins,
  suggestPinsFromGradment,
} from "../../services/pinService";
import PinBadge from "./PinBadge";

export default function PinManagerModal({
  isOpen,
  onClose,
  userPins = [],
  onPinAdded,
}) {
  const [mode, setMode] = useState("choice");
  const [availablePins, setAvailablePins] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedManualPin, setSelectedManualPin] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("disciplina");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [duplicatedPins, setDuplicatedPins] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const userPinNames = useMemo(() => {
    return new Set(userPins.map((pin) => pin.nomePin?.toLowerCase()));
  }, [userPins]);

  useEffect(() => {
    if (!isOpen || mode !== "manual") return;

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
  }, [isOpen, mode, search]);

  if (!isOpen) return null;

  function resetAndClose() {
    setMode("choice");
    setSearch("");
    setSelectedManualPin(null);
    setSelectedCategory("disciplina");
    setSuggestions([]);
    setSelectedSuggestions([]);
    setDuplicatedPins([]);
    setMessage("");
    setError("");
    onClose();
  }

  async function handleAddManualPin() {
    const nomePin = selectedManualPin?.nomePin || search.trim();

    if (!nomePin) {
      setError("Escolha ou digite um pin para adicionar.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      await addManualPin(nomePin, selectedManualPin?.categoriaPin || selectedCategory);

      setMessage("Pin adicionado ao perfil.");
      onPinAdded?.();
      resetAndClose();
    } catch (error) {
      setError(error.message || "Não foi possível adicionar o pin.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConnectGradment() {
    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      const data = await suggestPinsFromGradment();

      setSuggestions(Array.isArray(data?.sugestoes) ? data.sugestoes : []);
      setDuplicatedPins(Array.isArray(data?.jaAdicionados) ? data.jaAdicionados : []);
      setSelectedSuggestions(Array.isArray(data?.sugestoes) ? data.sugestoes : []);
      setMode("gradment");
    } catch (error) {
      setError(error.message || "Não foi possível carregar sugestões do GradMent.");
    } finally {
      setIsLoading(false);
    }
  }

  function toggleSuggestion(nomePin) {
    setSelectedSuggestions((prev) =>
      prev.includes(nomePin)
        ? prev.filter((item) => item !== nomePin)
        : [...prev, nomePin]
    );
  }

  async function handleImportGradmentPins() {
    if (selectedSuggestions.length === 0) {
      setError("Selecione pelo menos um pin para importar.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await importPinsFromGradment(selectedSuggestions);

      setMessage("Pins importados do GradMent.");
      onPinAdded?.();
      resetAndClose();
    } catch (error) {
      setError(error.message || "Não foi possível importar os pins.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-[#eeeeee] px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#202020]">
              Adicionar pin
            </h2>

            <p className="mt-1 text-xs text-[#777]">
              Escolha pins acadêmicos para exibir no seu perfil.
            </p>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f1f1] text-xl font-bold text-[#555]"
          >
            ×
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {mode === "choice" && (
            <div className="grid gap-3">
              <button
                type="button"
                onClick={handleConnectGradment}
                disabled={isLoading}
                className="rounded-2xl border border-[#c7eadc] bg-[#e8f7ef] px-5 py-4 text-left transition hover:bg-[#d8f0e4] disabled:opacity-60"
              >
                <p className="text-sm font-extrabold text-[#089464]">
                  Conectar ao GradMent
                </p>

                <p className="mt-1 text-xs text-[#343434]">
                  Importar pins validados pela sua trajetória acadêmica.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("manual")}
                className="rounded-2xl border border-[#eeeeee] bg-[#f7f7f7] px-5 py-4 text-left transition hover:bg-[#eeeeee]"
              >
                <p className="text-sm font-extrabold text-[#202020]">
                  Inserir pin manualmente
                </p>

                <p className="mt-1 text-xs text-[#777]">
                  Pesquise ou digite um pin acadêmico.
                </p>
              </button>
            </div>
          )}

          {mode === "manual" && (
            <>
              <button
                type="button"
                onClick={() => setMode("choice")}
                className="mb-4 text-sm font-bold text-[#089464]"
              >
                ‹ Voltar
              </button>

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedManualPin(null);
                  setError("");
                }}
                placeholder="Pesquisar pin. Ex: Cálculo I"
                className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm outline-none focus:border-[#089464]"
                
              />

              <div className="mt-3">
                <label className="mb-1 block text-xs font-bold text-[#343434]">
                  Tipo do pin
                </label>

                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  disabled={Boolean(selectedManualPin)}
                  className="h-11 w-full rounded-xl border border-[#d9d9d9] bg-[#f7f7f7] px-4 text-sm font-semibold text-[#343434] outline-none focus:border-[#089464] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="disciplina">Matéria / Disciplina</option>
                  <option value="ic">Iniciação Científica</option>
                  <option value="projeto">Projeto</option>
                  <option value="monitoria">Monitoria</option>
                  <option value="evento">Evento</option>
                  <option value="experiencia">Experiência acadêmica</option>
                  <option value="outro">Outro</option>
                </select>

                {selectedManualPin && (
                  <p className="mt-1 text-xs text-[#777]">
                    Pins já cadastrados usam a categoria salva no sistema.
                  </p>
                )}
              </div>

              <div className="mt-4 max-h-[260px] space-y-2 overflow-y-auto">
                {isLoading ? (
                  <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-sm text-[#777]">
                    Carregando pins...
                  </p>
                ) : availablePins.length > 0 ? (
                  availablePins.map((pin) => {
                    const alreadyAdded = userPinNames.has(pin.nomePin?.toLowerCase());
                    const isSelected = selectedManualPin?.idPin === pin.idPin;

                    return (
                      <button
                        key={pin.idPin}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => setSelectedManualPin(pin)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
                          isSelected
                            ? "border-[#089464] bg-[#e8f7ef]"
                            : "border-[#eeeeee] bg-white hover:bg-[#f7f7f7]"
                        }`}
                      >
                        <span className="text-sm font-bold text-[#202020]">
                          {pin.nomePin}
                        </span>

                        {alreadyAdded && (
                          <span className="text-xs font-bold text-[#777]">
                            Já adicionado
                          </span>
                        )}

                        {isSelected && (
                          <span className="text-sm font-bold text-[#089464]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-sm text-[#777]">
                    Nenhum pin encontrado. Você pode adicionar usando o texto digitado.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddManualPin}
                disabled={isLoading}
                className="mt-5 h-11 w-full rounded-full bg-[#089464] text-sm font-bold text-white disabled:opacity-60"
              >
                {isLoading ? "Adicionando..." : "Adicionar pin"}
              </button>
            </>
          )}

          {mode === "gradment" && (
            <>
              <button
                type="button"
                onClick={() => setMode("choice")}
                className="mb-4 text-sm font-bold text-[#089464]"
              >
                ‹ Voltar
              </button>

              <div className="rounded-2xl bg-[#e8f7ef] px-4 py-3">
                <p className="text-sm font-extrabold text-[#089464]">
                  Sugestões do GradMent
                </p>

                <p className="mt-1 text-xs text-[#343434]">
                  Selecione os pins que deseja exibir no seu perfil.
                </p>
              </div>

              {duplicatedPins.length > 0 && (
                <p className="mt-3 rounded-2xl bg-[#f1f1f1] px-4 py-3 text-xs text-[#777]">
                  Já estavam no seu perfil: {duplicatedPins.join(", ")}.
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.length > 0 ? (
                  suggestions.map((nomePin) => {
                    const checked = selectedSuggestions.includes(nomePin);

                    return (
                      <button
                        key={nomePin}
                        type="button"
                        onClick={() => toggleSuggestion(nomePin)}
                        className={`rounded-full border px-3 py-1 text-xs font-extrabold transition ${
                          checked
                            ? "border-[#8bd85f] bg-[#eaffdf] text-[#3dae21]"
                            : "border-[#d9d9d9] bg-[#f1f1f1] text-[#555]"
                        }`}
                      >
                        {nomePin} {checked ? "✓" : ""}
                      </button>
                    );
                  })
                ) : (
                  <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-sm text-[#777]">
                    Nenhuma nova sugestão encontrada.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleImportGradmentPins}
                disabled={isLoading || selectedSuggestions.length === 0}
                className="mt-5 h-11 w-full rounded-full bg-[#089464] text-sm font-bold text-white disabled:opacity-60"
              >
                {isLoading ? "Importando..." : "Importar pins selecionados"}
              </button>
            </>
          )}

          {error && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </p>
          )}

          {message && (
            <p className="mt-4 rounded-2xl bg-[#e8f7ef] px-4 py-3 text-sm text-[#089464]">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}