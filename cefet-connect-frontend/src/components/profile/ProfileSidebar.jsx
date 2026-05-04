import { useNavigate } from "react-router-dom";
import BrandLogo from "../auth/BrandLogo";

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

function NavButton({ children, active = false, onClick, label }) {
  return (
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
  );
}

export default function ProfileSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden min-h-screen w-[132px] shrink-0 flex-col items-center border-r border-[#e3e3e3] bg-white py-10 lg:flex">
      <BrandLogo
        variant="icon"
        className="mb-20 h-16 w-16 object-contain"
      />

      <nav className="flex flex-1 flex-col items-center gap-7">
        <NavButton label="Início" onClick={() => navigate("/home")}>
          <HomeIcon />
        </NavButton>

        <NavButton label="Pesquisar">
          <SearchIcon />
        </NavButton>

        <NavButton label="Notificações">
          <BellIcon />
        </NavButton>

        <NavButton label="Perfil" active onClick={() => navigate("/profile")}>
          <UserIcon active />
        </NavButton>
      </nav>
    </aside>
  );
}