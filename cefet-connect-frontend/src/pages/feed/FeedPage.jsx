import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DesktopFeed from "../../components/feed/DesktopFeed";
import MobileFeed from "../../components/feed/MobileFeed";
import {
  createPost,
  listPosts,
} from "../../services/postService";
import {
  getCurrentUser,
  getProfileImageUrl,
  getUserProfile,
  logoutUser,
} from "../../services/authService";
import {
  createEvento,
  getEvento,
  listEventos,
  participarEvento,
  sairEvento,
} from "../../services/eventoService";
import CommunityFormModal from "../../components/community/CommunityFormModal";
import EventFormModal from "../../components/event/EventFormModal";
import {
  createComunidade,
  listMinhasComunidades,
} from "../../services/comunidadeService";
import {
  filterVisibleEvents,
  getUpcomingEvents,
  isEventFinished,
} from "../../utils/eventFilters";
import EventDetailsModal from "../../components/event/EventDetailsModal";
import { listUserPins } from "../../services/pinService";

export default function FeedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedUser = getCurrentUser();

  const [user, setUser] = useState(savedUser);
  const [posts, setPosts] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isCommunityFormOpen, setIsCommunityFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isSavingCommunity, setIsSavingCommunity] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [error, setError] = useState("");

  const visibleEvents = useMemo(() => {
    return filterVisibleEvents(events, myCommunities);
  }, [events, myCommunities]);

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(visibleEvents);
  }, [visibleEvents]);

  const idUsuario = savedUser?.idUsuario || user?.idUsuario;

  const userImageUrl = useMemo(() => {
    return getProfileImageUrl(user?.fotoUrl);
  }, [user?.fotoUrl]);

  useEffect(() => {
    if (!idUsuario) {
      navigate("/login");
      return;
    }

    loadInitialData();
  }, [idUsuario]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const createType = params.get("create");

    if (!createType) return;

    if (createType === "post") {
      handleOpenPostComposer();
    }

    if (createType === "community") {
      setIsCommunityFormOpen(true);
    }

    if (createType === "event") {
      setIsEventFormOpen(true);
    }

    navigate("/home", { replace: true });
  }, [location.search]);

  function checkUserParticipating(eventData) {
    const participantes = Array.isArray(eventData?.participantes)
      ? eventData.participantes
      : [];

    return participantes.some(
      (participante) =>
        String(participante?.idUsuario || "") === String(user?.idUsuario || "")
    );
  }

  async function handleOpenEventDetails(event) {
    try {
      setSelectedEvent(event);
      setIsEventDetailsOpen(true);

      const response = await getEvento(event.idEvento);
      const detailedEvent = response?.dados || response;

      const isParticipando = checkUserParticipating(detailedEvent);

      setSelectedEvent({
        ...event,
        ...detailedEvent,
        isParticipando,
        isFinalizado: event?.isFinalizado,
      });
    } catch (error) {
      setError(error.message || "Não foi possível carregar os detalhes do evento.");
    }
  }

  async function handleToggleEventParticipation(event) {
    if (event?.isFinalizado || isEventFinished(event)) {
      setError("Este evento já foi finalizado.");
      return;
    }

    try {
      setLoadingActionId(event.idEvento);
      setError("");

      if (event.isParticipando) {
        await sairEvento(event.idEvento);
      } else {
        await participarEvento(event.idEvento);
      }

      const response = await getEvento(event.idEvento);
      const detailedEvent = response?.dados || response;

      const isParticipando = checkUserParticipating(detailedEvent);

      setSelectedEvent({
        ...event,
        ...detailedEvent,
        isParticipando,
        isFinalizado: event?.isFinalizado,
      });

      await loadInitialData();
    } catch (error) {
      setError(error.message || "Não foi possível atualizar sua participação.");
    } finally {
      setLoadingActionId(null);
    }
  }

  async function attachPinsToPosts(postsList = []) {
    const authorIds = [
      ...new Set(
        postsList
          .map((post) => post?.usuario?.idUsuario)
          .filter(Boolean)
          .map(String)
      ),
    ];

    const pinsByUser = {};

    await Promise.all(
      authorIds.map(async (idUsuario) => {
        try {
          const response = await listUserPins(idUsuario);
          const pinsData = response?.dados || response;

          pinsByUser[idUsuario] = Array.isArray(pinsData) ? pinsData : [];
        } catch {
          pinsByUser[idUsuario] = [];
        }
      })
    );

    return postsList.map((post) => {
      const authorId = String(post?.usuario?.idUsuario || "");

      return {
        ...post,
        usuario: {
          ...(post.usuario || {}),
          pins: pinsByUser[authorId] || [],
        },
      };
    });
  }

  async function loadInitialData() {
    try {
      setIsLoading(true);
      setError("");

      const [
        profileResponse,
        postsResponse,
        communitiesResponse,
        eventsResponse,
      ] = await Promise.all([
        getUserProfile(idUsuario),
        listPosts(),
        listMinhasComunidades(),
        listEventos(),
      ]);

      const profile = profileResponse?.dados || profileResponse;
      const normalizedProfile = {
        ...savedUser,
        ...profile,
        idUsuario: profile?.idUsuario || savedUser?.idUsuario,
        matricula: profile?.matricula || savedUser?.matricula,
      };
      const postsData = postsResponse?.dados || postsResponse;

      const communitiesData = communitiesResponse?.dados || communitiesResponse;
      setMyCommunities(Array.isArray(communitiesData) ? communitiesData : []);

      const eventsData = eventsResponse?.dados || eventsResponse;
      setEvents(Array.isArray(eventsData) ? eventsData : []);

      setUser(normalizedProfile);

      const orderedPosts = Array.isArray(postsData)
        ? [...postsData]
            .map((post) => {
              const isCurrentUserPost =
                String(post?.usuario?.idUsuario || "") === String(normalizedProfile?.idUsuario || "") ||
                String(post?.usuario?.idUsuario || "") === String(savedUser?.idUsuario || "");

              return {
                ...post,
                usuario: {
                  ...(post.usuario || {}),
                  fotoUrl:
                    post.usuario?.fotoUrl ||
                    (isCurrentUserPost ? user?.fotoUrl || savedUser?.fotoUrl : ""),
                },
              };
            })
            .sort(
              (a, b) =>
                new Date(b.dataHoraPublicacao) - new Date(a.dataHoraPublicacao)
            )
        : [];

      const postsWithPins = await attachPinsToPosts(orderedPosts);

      setPosts(postsWithPins);
    } catch (error) {
      setError(error.message || "Não foi possível carregar o feed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreatePost(payload) {
    try {
      setIsCreating(true);
      setError("");

      const response = await createPost(payload);
      const newPost = response?.dados || response;

      const userPinsResponse = await listUserPins(idUsuario);
      const userPinsData = userPinsResponse?.dados || userPinsResponse;

      const postWithAuthorPhoto = {
        ...newPost,
        usuario: {
          ...user,
          ...(newPost.usuario || {}),
          fotoUrl: newPost.usuario?.fotoUrl || user?.fotoUrl,
          pins: Array.isArray(userPinsData) ? userPinsData : [],
        },
      };

      setPosts((prev) => [postWithAuthorPhoto, ...prev]);
    } catch (error) {
      setError(error.message || "Não foi possível criar o post.");
    } finally {
      setIsCreating(false);
    }
  }

  function handlePostDeleted(idPost) {
    setPosts((prev) => prev.filter((post) => post.idPost !== idPost));
  }

  function handlePostUpdated(updatedPost) {
    setPosts((prev) => {
      const nextPosts = prev.map((post) =>
        post.idPost === updatedPost.idPost
          ? {
              ...post,
              ...updatedPost,
              usuario: updatedPost.usuario || post.usuario,
              fotosPost:
                updatedPost.fotosPost !== undefined
                  ? updatedPost.fotosPost
                  : post.fotosPost,
            }
          : post
      );

      return nextPosts.sort(
        (a, b) =>
          new Date(b.dataHoraPublicacao) - new Date(a.dataHoraPublicacao)
      );
    });
  }

  function handleOpenPostComposer() {
    setTimeout(() => {
      const composer = document.getElementById("post-composer");

      if (composer) {
        composer.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  }

  async function handleSubmitCommunity(payload) {
    try {
      setIsSavingCommunity(true);
      setError("");

      await createComunidade(payload);

      setIsCommunityFormOpen(false);
      await loadInitialData();
    } catch (error) {
      setError(error.message || "Não foi possível criar a comunidade.");
    } finally {
      setIsSavingCommunity(false);
    }
  }

  async function handleSubmitEvent(payload) {
    try {
      setIsSavingEvent(true);
      setError("");

      await createEvento(payload);

      setIsEventFormOpen(false);
      await loadInitialData();
    } catch (error) {
      setError(error.message || "Não foi possível criar o evento.");
    } finally {
      setIsSavingEvent(false);
    }
  }
  function handleLogout() {
    const confirmed = window.confirm("Tem certeza que deseja sair da sua conta?");

    if (!confirmed) return;

    logoutUser();
    navigate("/login");
  }

  return (
    <>
      <DesktopFeed
        user={user}
        userImageUrl={userImageUrl}
        posts={posts}
        communities={myCommunities}
        events={upcomingEvents}
        isLoading={isLoading}
        error={error}
        isCreating={isCreating}
        onCreatePost={handleCreatePost}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        onLogout={handleLogout}
        onOpenEvents={() => navigate("/eventos")}
        onOpenEventDetails={handleOpenEventDetails}
      />

      <MobileFeed
        user={user}
        userImageUrl={userImageUrl}
        posts={posts}
        communities={myCommunities}
        isLoading={isLoading}
        error={error}
        isCreating={isCreating}
        onCreatePost={handleCreatePost}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        onGoToProfile={() => navigate("/profile")}
        onLogout={handleLogout}
        onCreatePostShortcut={handleOpenPostComposer}
        onCreateCommunityShortcut={() => setIsCommunityFormOpen(true)}
        onCreateEventShortcut={() => setIsEventFormOpen(true)}
      />

      <CommunityFormModal
        key="new-community-from-global-menu"
        isOpen={isCommunityFormOpen}
        community={null}
        isSaving={isSavingCommunity}
        onClose={() => setIsCommunityFormOpen(false)}
        onSubmit={handleSubmitCommunity}
      />

      <EventFormModal
        key="new-event-from-global-menu"
        isOpen={isEventFormOpen}
        event={null}
        communities={myCommunities}
        isSaving={isSavingEvent}
        onClose={() => setIsEventFormOpen(false)}
        onSubmit={handleSubmitEvent}
      />
      <EventDetailsModal
        isOpen={isEventDetailsOpen}
        event={selectedEvent}
        currentUser={user}
        loadingActionId={loadingActionId}
        onClose={() => setIsEventDetailsOpen(false)}
        onEdit={(event) =>
          navigate(`/eventos?action=edit&eventId=${event.idEvento}`)
        }
        onDelete={(event) =>
          navigate(`/eventos?action=delete&eventId=${event.idEvento}`)
        }
        onToggleParticipation={handleToggleEventParticipation}
      />
    </>
  );
}