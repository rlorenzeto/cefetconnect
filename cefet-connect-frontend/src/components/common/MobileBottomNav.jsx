import { Link } from "react-router-dom";
import GlobalCreateMenu from "./GlobalCreateMenu";
import {
  CommunityIcon,
  HomeIcon,
  PartyIcon,
  UserCircleIcon,
} from "../icons/AppIcons";

export default function MobileBottomNav({
  activePage = "",
  onCreatePost,
  onCreateCommunity,
  onCreateEvent,
}) {
  function isActive(page) {
    return page === activePage;
  }

  function getItemClass(page) {
    return isActive(page)
      ? "text-[#089464]"
      : "text-[#707070]";
  }

  function getLabelClass(page) {
    return isActive(page)
      ? "text-[11px] font-bold text-[#089464]"
      : "text-[11px] font-medium text-[#707070]";
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid h-[76px] grid-cols-5 items-center border-t border-[#e3e3e3] bg-white px-1 pb-2 pt-1 shadow-[0_-4px_18px_rgba(0,0,0,0.06)]">
      <Link
        to="/home"
        aria-label="Início"
        className={`flex flex-col items-center justify-center gap-1 ${getItemClass(
          "home"
        )}`}
      >
        <HomeIcon active={isActive("home")} className="h-7 w-7" />
        <span className={getLabelClass("home")}>Início</span>
      </Link>

      <Link
        to="/comunidades"
        aria-label="Comunidades"
        className={`flex flex-col items-center justify-center gap-1 ${getItemClass(
          "community"
        )}`}
      >
        <CommunityIcon active={isActive("community")} className="h-7 w-7" />
        <span className={getLabelClass("community")}>Comunidades</span>
      </Link>

      <div className="flex items-center justify-center">
        <GlobalCreateMenu
          onCreatePost={onCreatePost}
          onCreateCommunity={onCreateCommunity}
          onCreateEvent={onCreateEvent}
        />
      </div>

      <Link
        to="/eventos"
        aria-label="Eventos"
        className={`flex flex-col items-center justify-center gap-1 ${getItemClass(
          "events"
        )}`}
      >
        <PartyIcon className="h-7 w-7" />
        <span className={getLabelClass("events")}>Eventos</span>
      </Link>

      <Link
        to="/profile"
        aria-label="Perfil"
        className={`flex flex-col items-center justify-center gap-1 ${getItemClass(
          "profile"
        )}`}
      >
        <UserCircleIcon active={isActive("profile")} className="h-7 w-7" />
        <span className={getLabelClass("profile")}>Perfil</span>
      </Link>
    </nav>
  );
}