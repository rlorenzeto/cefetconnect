import { useNavigate } from "react-router-dom";
import BrandLogo from "../auth/BrandLogo";
import {
  CommunityIcon,
  HeartOutlineIcon,
  HomeIcon,
  PartyIcon,
  PlusCircleIcon,
  TrophyIcon,
  UserCircleIcon,
} from "../icons/AppIcons";

function NavButton({ children, active = false, onClick, label }) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
          active
            ? "bg-[#089464] text-white"
            : "text-[#0f1830] hover:bg-[#f1f1f1] hover:text-[#089464]"
        }`}
      >
        {children}
      </button>

      {label && (
        <div className="pointer-events-none absolute left-[58px] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202020] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          {label}
          <span className="absolute left-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-[#202020]" />
        </div>
      )}
    </div>
  );
}

export default function ProfileSidebar({
  activePage = "profile",
  onOpenFullRanking,
  onOpenNotifications,
}) {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[112px] flex-col items-center rounded-r-[42px] bg-white py-10 lg:flex">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="mb-28 rounded-3xl transition hover:scale-105"
        aria-label="Ir para o início"
        title="Ir para o início"
      >
        <BrandLogo variant="icon" className="h-14 w-14 object-contain" />
      </button>

      <nav className="flex flex-1 flex-col items-center gap-5">
        <NavButton
          label="Início"
          active={activePage === "home"}
          onClick={() => navigate("/home")}
        >
          <HomeIcon active={activePage === "home"} />
        </NavButton>

        <NavButton
          label="Comunidades"
          active={activePage === "community"}
          onClick={() => navigate("/comunidades")}
        >
          <CommunityIcon active={activePage === "community"} />
        </NavButton>

        <NavButton
          label="Eventos"
          active={activePage === "events"}
          onClick={() => navigate("/eventos")}
        >
          <PartyIcon />
        </NavButton>

        <NavButton
          label="Ranking"
          active={activePage === "ranking"}
          onClick={onOpenFullRanking}
        >
          <TrophyIcon active={activePage === "ranking"} />
        </NavButton>

        <NavButton
          label="Notificações"
          active={activePage === "notifications"}
          onClick={onOpenNotifications}
        >
          <HeartOutlineIcon active={activePage === "notifications"} />
        </NavButton>

        <NavButton
          label="Criar"
          onClick={() => navigate("/home?create=post")}
        >
          <PlusCircleIcon />
        </NavButton>
      </nav>

      <button
        type="button"
        onClick={() => navigate("/profile")}
        aria-label="Perfil"
        title="Perfil"
        className={`mt-10 flex h-11 w-11 items-center justify-center rounded-full transition ${
          activePage === "profile"
            ? "bg-[#089464] text-white"
            : "bg-[#d9d9d9] text-[#0f1830] hover:bg-[#e8f7ef] hover:text-[#089464]"
        }`}
      >
        <UserCircleIcon active={activePage === "profile"} className="h-7 w-7" />
      </button>
    </aside>
  );
}