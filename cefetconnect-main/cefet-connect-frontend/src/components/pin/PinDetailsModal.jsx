import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import { getProfileImageUrl } from "../../services/authService";
import { getCommunityImageUrl } from "../../services/comunidadeService";
import {
  getPinDetails,
  listPinCommunities,
  listPinUsers,
} from "../../services/pinService";

export default function PinDetailsModal({ pin, isOpen, onClose }) {
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [users, setUsers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !pin?.idPin) return;

    async function loadDetails() {
      try {
        setIsLoading(true);
        setError("");

        const [detailsData, usersData, communitiesData] = await Promise.all([
          getPinDetails(pin.idPin),
          listPinUsers(pin.idPin),
          listPinCommunities(pin.idPin),
        ]);

        setDetails(detailsData);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setCommunities(Array.isArray(communitiesData) ? communitiesData : []);
      } catch (error) {
        setError(error.message || "Não foi possível carregar os detalhes do pin.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDetails();
  }, [isOpen, pin?.idPin]);

  if (!isOpen || !pin) return null;

  function handleGoToProfile(idUsuario) {
    if (!idUsuario) return;

    onClose();
    navigate(`/profile/${idUsuario}`);
  }

  function handleGoToCommunity(idComunidade) {
    if (!idComunidade) return;

    onClose();
    navigate(`/comunidades/${idComunidade}`);
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-[520px] overflow-hidden rounded-[24px] bg-white shadow-xl">
        <header className="flex items-start justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-[#202020]">
                {details?.nomePin || pin.nomePin}
              </h2>

              {pin?.origem === "gradment" && (
                <span className="rounded-full bg-[#eaffdf] px-2 py-0.5 text-[10px] font-extrabold text-[#3dae21]">
                  Validado
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-[#777]">
              Veja pessoas e comunidades relacionadas a esse pin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f1f1] text-xl font-bold text-[#555] transition hover:bg-[#e5e5e5]"
            aria-label="Fechar detalhes do pin"
          >
            ×
          </button>
        </header>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
          {isLoading && (
            <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-sm text-[#777]">
              Carregando informações do pin...
            </p>
          )}

          {error && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </p>
          )}

          {!isLoading && !error && (
            <>
              <section className="rounded-2xl bg-[#e8f7ef] px-4 py-3">
                <p className="text-xs font-bold uppercase text-[#089464]">
                  Pessoas com esse pin
                </p>

                <p className="mt-1 text-2xl font-extrabold text-[#202020]">
                  {details?.totalUsuarios ?? users.length}
                </p>
              </section>

              <section className="mt-5">
                <h3 className="mb-3 text-sm font-extrabold text-[#202020]">
                  Quem também possui esse pin?
                </h3>

                {users.length > 0 ? (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <button
                        key={user.idUsuario}
                        type="button"
                        onClick={() => handleGoToProfile(user.idUsuario)}
                        className="flex w-full items-center gap-3 rounded-2xl bg-[#f7f7f7] px-3 py-2 text-left transition hover:bg-[#e8f7ef]"
                      >
                        <ProfileAvatar
                          src={getProfileImageUrl(user.fotoUrl)}
                          name={user.nomeUsuario}
                          size="post"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#202020]">
                            {user.nomeUsuario || "Usuário"}
                          </p>

                          <p className="text-xs text-[#777]">
                            {user.origem === "gradment"
                              ? "Pin validado pelo GradMent"
                              : "Pin manual"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-[#f7f7f7] px-4 py-3 text-sm text-[#777]">
                    Ainda não existem outros usuários relacionados a esse pin.
                  </p>
                )}
              </section>

              <section className="mt-6">
                <h3 className="mb-3 text-sm font-extrabold text-[#202020]">
                  Comunidades relacionadas
                </h3>

                {communities.length > 0 ? (
                  <div className="space-y-2">
                    {communities.map((community) => (
                      <button
                        key={community.idComunidade}
                        type="button"
                        onClick={() => handleGoToCommunity(community.idComunidade)}
                        className="flex w-full items-center gap-3 rounded-2xl bg-[#f7f7f7] px-3 py-2 text-left transition hover:bg-[#e8f7ef]"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#d9d9d9] text-sm font-bold text-[#777]">
                          {community.fotoUrlComunidade ? (
                            <img
                              src={getCommunityImageUrl(community.fotoUrlComunidade)}
                              alt={community.nomeComunidade}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            community.nomeComunidade?.charAt(0)?.toUpperCase() || "C"
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#202020]">
                            {community.nomeComunidade}
                          </p>

                          <p className="line-clamp-1 text-xs text-[#777]">
                            {community.descricaoComunidade || "Sem descrição."}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-[#f7f7f7] px-4 py-3 text-sm text-[#777]">
                    Nenhuma comunidade encontrada para esse pin.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}