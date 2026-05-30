import { useNavigate } from "react-router-dom";
import BrandLogo from "../auth/BrandLogo";
import { CommunityIcon } from "../icons/AppIcons";

function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <path
        d="M18 9.5A6 6 0 0 0 6 9.5c0 7-3 7.5-3 7.5h18s-3-.5-3-7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9.5 20a2.6 2.6 0 0 0 5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
        fill={active ? "currentColor" : "none"}
      />
      <path
        d="M4.5 21c1.5-4.2 4-6.2 7.5-6.2s6 2 7.5 6.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill={active ? "currentColor" : "none"}
      />
      <path
        d="M8 3v4M16 3v4M4 10h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NavButton({ children, active = false, onClick, label }) {
  return (
    <div className="group relative">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
          active
            ? "bg-[#089464] text-white"
            : "text-[#343434] hover:bg-[#f1f1f1]"
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

export default function ProfileSidebar({ activePage = "profile" }) {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[132px] flex-col items-center border-r border-[#e3e3e3] bg-white py-10 lg:flex">
      <div className="group relative mb-20">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="rounded-3xl transition hover:scale-105"
          aria-label="Ir para o início"
        >
          <BrandLogo
            variant="icon"
            className="h-16 w-16 object-contain"
          />
        </button>

        <div className="pointer-events-none absolute left-[74px] top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202020] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          Início

          <span className="absolute left-[-5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-[#202020]" />
        </div>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-7">
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
          <CalendarIcon active={activePage === "events"} />
        </NavButton>

        <NavButton label="Pesquisar">
          <SearchIcon />
        </NavButton>

        <NavButton label="Notificações">
          <BellIcon />
        </NavButton>

        <NavButton
          label="Perfil"
          active={activePage === "profile"}
          onClick={() => navigate("/profile")}
        >
          <UserIcon active={activePage === "profile"} />
        </NavButton>
      </nav>
    </aside>
  );
}