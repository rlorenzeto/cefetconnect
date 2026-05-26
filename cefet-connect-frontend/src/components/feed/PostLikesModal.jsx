import { useNavigate } from "react-router-dom";
import ProfileAvatar from "../profile/ProfileAvatar";
import { getProfileImageUrl } from "../../services/authService";

export default function PostLikesModal({ isOpen, onClose, users = [] }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  function handleGoToProfile(idUsuario) {
    if (!idUsuario) return;

    onClose();
    navigate(`/profile/${idUsuario}`);
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#202020]">
            Pessoas que curtiram
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#555] transition hover:bg-[#f1f1f1]"
            aria-label="Fechar modal de curtidas"
          >
            ×
          </button>
        </div>

        <div className="mt-5 max-h-[360px] space-y-2 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-sm text-[#777]">
              Ninguém curtiu este post ainda.
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user.idUsuario}
                type="button"
                onClick={() => handleGoToProfile(user.idUsuario)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-[#f1f1f1]"
              >
                <ProfileAvatar
                  src={getProfileImageUrl(user.fotoUrl)}
                  name={user.nomeUsuario}
                  size="post"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#202020]">
                    {user.nomeUsuario || "Usuário"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}