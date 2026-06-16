import { Link } from "react-router-dom";
import { TrophyIcon } from "../icons/AppIcons";
import { getProfileImageUrl } from "../../services/authService";

const POSITION_STYLES = [
  "bg-[#f2d94e] text-white",
  "bg-[#d9d9d9] text-white",
  "bg-[#ff7a3c] text-white",
];

function getPositionClass(index) {
  if (index < 3) return POSITION_STYLES[index];

  return "bg-[#13a8e8] text-white";
}

function getPoints(user) {
  return Number(user?.contadorInteracaoUsuario || 0);
}

export default function RankingCard({
  ranking = [],
  variant = "preview",
  onOpenFullRanking,
}) {
  const isFull = variant === "full";
  const visibleRanking = isFull ? ranking.slice(0, 10) : ranking.slice(0, 3);

  return (
    <section className="overflow-hidden rounded-[8px] bg-white shadow-sm">
      <header className="flex items-start gap-3 border-b border-[#d9d9d9] px-3 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#089464] text-white">
          <TrophyIcon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <h2 className="text-[20px] font-bold leading-tight text-[#202020]">
            Ranking
          </h2>

          <p className="text-[13px] font-normal leading-tight text-[#343434]">
            membros mais ativos
          </p>
        </div>
      </header>

      <div>
        {visibleRanking.map((user, index) => {
          const imageUrl = getProfileImageUrl(user?.fotoUrl);
          const position = index + 1;
          const profileUrl = user?.idUsuario
            ? `/profile/${user.idUsuario}`
            : "#";

          return (
            <div
              key={user?.idUsuario || position}
              className="grid grid-cols-[42px_44px_minmax(0,1fr)_44px] items-center gap-3 border-b border-[#d9d9d9] px-4 py-3 last:border-b-0"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-extrabold ${getPositionClass(
                  index
                )}`}
              >
                {position}º
              </span>

              <Link
                to={profileUrl}
                className="block h-10 w-10 rounded-full transition hover:opacity-85"
                aria-label={`Abrir perfil de ${user?.nomeUsuario || "usuário"}`}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={user?.nomeUsuario || "Usuário"}
                      className="h-10 w-10 rounded-full bg-[#d9d9d9] object-cover text-transparent"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />

                    <div className="hidden h-10 w-10 rounded-full bg-[#d9d9d9]" />
                  </>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#d9d9d9]" />
                )}
              </Link>

              <Link
                to={profileUrl}
                title={user?.nomeUsuario || "Usuário"}
                className="min-w-0 truncate text-[16px] font-normal text-[#202020] transition hover:underline"
              >
                {user?.nomeUsuario || "Usuário"}
              </Link>

              <span className="pl-2 text-[17px] font-extrabold text-[#202020]">
                {getPoints(user)}
              </span>
            </div>
          );
        })}

        {visibleRanking.length === 0 && (
          <p className="m-3 rounded-[12px] bg-[#f1f1f1] px-3 py-3 text-sm text-[#777]">
            Ainda não há pontuação no ranking.
          </p>
        )}
      </div>

      {!isFull && (
        <div className="border-t border-[#d9d9d9] px-3 py-2">
          <button
            type="button"
            onClick={onOpenFullRanking}
            className="flex h-7 w-full items-center justify-center rounded-[6px] bg-[#089464] text-[13px] font-bold text-white transition hover:bg-[#067a53]"
          >
            Ver ranking completo
          </button>
        </div>
      )}
    </section>
  );
}