import { Link } from "react-router-dom";
import GlobalCreateMenu from "./GlobalCreateMenu";

export default function MobileBottomNav({
  activePage = "",
  onCreatePost,
  onCreateCommunity,
  onCreateEvent,
}) {
  function getItemClass(page) {
    return page === activePage
      ? "text-sm font-semibold text-[#089464]"
      : "text-sm text-[#777]";
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#e3e3e3] bg-white">
      <Link to="/home" className={getItemClass("home")}>
        Início
      </Link>

      <Link to="/comunidades" className={getItemClass("community")}>
        Comunidades
      </Link>

      <GlobalCreateMenu
        onCreatePost={onCreatePost}
        onCreateCommunity={onCreateCommunity}
        onCreateEvent={onCreateEvent}
      />

      <Link to="/eventos" className={getItemClass("events")}>
        Eventos
      </Link>

      <Link to="/profile" className={getItemClass("profile")}>
        Perfil
      </Link>
    </nav>
  );
}