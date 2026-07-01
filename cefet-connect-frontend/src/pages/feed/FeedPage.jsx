import { useEffect, useMemo, useRef, useState } from "react";
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
import { itemMatchesSearch } from "../../utils/searchUtils";
import {
  getRankingPreview,
  getRankingCompleto,
} from "../../services/rankingService";

import RankingModal from "../../components/ranking/RankingModal";

export default function FeedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedUser = getCurrentUser();

  const [user, setUser] = useState(savedUser);
  const [posts, setPosts] = useState([]);
  const [postPagination, setPostPagination] = useState({
    pagina: 1,
    limite: 10,
    total: 0,
    totalPaginas: 1,
  });

  const [nextPostsPage, setNextPostsPage] = useState(2);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [rankingPreview, setRankingPreview] = useState([]);
  const [rankingCompleto, setRankingCompleto] = useState([]);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const pinsCacheRef = useRef({});

  const visibleEvents = useMemo(() => {
    return filterVisibleEvents(events, myCommunities);
  }, [events, myCommunities]);

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(visibleEvents);
  }, [visibleEvents]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      itemMatchesSearch(post, searchTerm, (currentPost) => [
        currentPost?.conteudo,
        currentPost?.usuario?.nomeUsuario,
        currentPost?.comunidade?.nomeComunidade,
        currentPost?.evento?.titulo,
        currentPost?.evento?.descricaoEvento,
        currentPost?.evento?.comunidade?.nomeComunidade,
      ])
    );
  }, [posts, searchTerm]);

  const idUsuario = savedUser?.idUsuario || user?.idUsuario;

  const userImageUrl = useMemo(() => {
    return getProfileImageUrl(user?.fotoUrl);
  }, [user?.fotoUrl]);

  function normalizeRankingResponse(response) {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.dados)) return response.dados;

    if (Array.isArray(response?.dados?.dados)) return response.dados.dados;

    if (Array.isArray(response?.ranking)) return response.ranking;

    if (Array.isArray(response?.dados?.ranking)) return response.dados.ranking;

    if (Array.isArray(response?.usuarios)) return response.usuarios;

    if (Array.isArray(response?.dados?.usuarios)) return response.dados.usuarios;

    return [];
  }

  function normalizePostsResponse(response, fallbackPage = 1) {
    return {
      dados: Array.isArray(response?.dados)
        ? response.dados
        : Array.isArray(response)
          ? response
          : [],

      paginacao: response?.paginacao || {
        pagina: fallbackPage,
        limite: 10,
        total: 0,
        totalPaginas: 1,
      },
    };
  }

  function formatPostsForFeed(postsData = [], normalizedProfile = user) {
    return Array.isArray(postsData)
      ? [...postsData]
          .map((post) => {
            const isCurrentUserPost =
              String(post?.usuario?.idUsuario || "") ===
                String(normalizedProfile?.idUsuario || "") ||
              String(post?.usuario?.idUsuario || "") ===
                String(savedUser?.idUsuario || "");

            return {
              ...post,
              usuario: {
                ...(post.usuario || {}),
                fotoUrl:
                  post.usuario?.fotoUrl ||
                  (isCurrentUserPost
                    ? user?.fotoUrl || savedUser?.fotoUrl
                    : ""),
              },
            };
          })
          .sort(
            (a, b) =>
              new Date(b.dataHoraPublicacao) -
              new Date(a.dataHoraPublicacao)
          )
      : [];
  }

  function mergePostsWithoutDuplicates(currentPosts, newPosts) {
    const postsMap = new Map();

    [...currentPosts, ...newPosts].forEach((post) => {
      postsMap.set(post.idPost, post);
    });

    return Array.from(postsMap.values()).sort(
      (a, b) =>
        new Date(b.dataHoraPublicacao) - new Date(a.dataHoraPublicacao)
    );
  }

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
    const searchParam = params.get("search");

    if (searchParam) {
      setSearchTerm(searchParam);
      params.delete("search");
    }

    if (createType === "post") {
      handleOpenPostComposer();
    } else if (createType === "community") {
      setIsCommunityFormOpen(true);
    } else if (createType === "event") {
      setIsEventFormOpen(true);
    }

    if (createType || searchParam) {
      params.delete("create");
      const qs = params.toString();
      navigate(qs ? `/home?${qs}` : "/home", { replace: true });
    }
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

    const idsToFetch = authorIds.filter(
      (idUsuario) =>
        !Object.prototype.hasOwnProperty.call(pinsCacheRef.current, idUsuario)
    );

    await Promise.all(
      idsToFetch.map(async (idUsuario) => {
        try {
          const response = await listUserPins(idUsuario);
          const pinsData = response?.dados || response;

          pinsCacheRef.current[idUsuario] = Array.isArray(pinsData)
            ? pinsData
            : [];
        } catch {
          pinsCacheRef.current[idUsuario] = [];
        }
      })
    );

    return postsList.map((post) => {
      const authorId = String(post?.usuario?.idUsuario || "");

      return {
        ...post,
        usuario: {
          ...(post.usuario || {}),
          pins: pinsCacheRef.current[authorId] || [],
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
        rankingResponse,
      ] = await Promise.all([
        getUserProfile(idUsuario),
        listPosts(),
        listMinhasComunidades(),
        listEventos(),
        getRankingPreview(),
      ]);

      const profile = profileResponse?.dados || profileResponse;
      const normalizedProfile = {
        ...savedUser,
        ...profile,
        idUsuario: profile?.idUsuario || savedUser?.idUsuario,
        matricula: profile?.matricula || savedUser?.matricula,
      };
      const { dados: postsData, paginacao } = normalizePostsResponse(
        postsResponse,
        1
      );

      setPostPagination({
        ...paginacao,
        pagina: 1,
      });

      setNextPostsPage(2);
      setHasMorePosts(postsData.length > 0);

      const communitiesData = communitiesResponse?.dados || communitiesResponse;
      setMyCommunities(Array.isArray(communitiesData) ? communitiesData : []);

      const eventsData = eventsResponse?.dados || eventsResponse;
      setEvents(Array.isArray(eventsData) ? eventsData : []);

      const rankingData = normalizeRankingResponse(rankingResponse);
      setRankingPreview(rankingData.slice(0, 3));

      setUser(normalizedProfile);

      const orderedPosts = formatPostsForFeed(postsData, normalizedProfile);

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
        const updatedRanking = await getRankingPreview();
        const updatedRankingData = normalizeRankingResponse(updatedRanking);

        setRankingPreview(updatedRankingData.slice(0, 3));
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
      const message =
        error.message || "Não foi possível criar a comunidade.";

      setError(message);

      throw new Error(message);
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

  async function handleOpenFullRanking() {
    try {
      setIsRankingModalOpen(true);
      setIsRankingLoading(true);
      const rankingResponse = await getRankingCompleto();
      const rankingData = normalizeRankingResponse(rankingResponse);

      setRankingCompleto(rankingData);
    } catch (error) {
      setRankingCompleto([]);
    } finally {
      setIsRankingLoading(false);
    }
  }

  async function refreshRankingPreview() {
    try {
      const rankingResponse = await getRankingPreview();
      const rankingData = normalizeRankingResponse(rankingResponse);

      setRankingPreview(rankingData.slice(0, 3));
    } catch {
      setRankingPreview([]);
    }
  }

  async function handleLoadMorePosts() {
    if (isLoadingMorePosts || !hasMorePosts) return;

    const pageToLoad = nextPostsPage;

    try {
      setIsLoadingMorePosts(true);
      setError("");

      const response = await listPosts(pageToLoad);

      const { dados: postsData, paginacao } = normalizePostsResponse(
        response,
        pageToLoad
      );

      // Se a próxima página veio vazia, aí sim acabou.
      if (!postsData.length) {
        setHasMorePosts(false);
        return;
      }

      const orderedPosts = formatPostsForFeed(postsData, user);
      const postsWithPins = await attachPinsToPosts(orderedPosts);

      const nextPosts = mergePostsWithoutDuplicates(posts, postsWithPins);

      setPosts(nextPosts);

      setPostPagination({
        ...paginacao,
        pagina: pageToLoad,
      });

      setNextPostsPage(pageToLoad + 1);

      // Mantém o botão aparecendo enquanto a API ainda trouxer posts.
      setHasMorePosts(true);
    } catch (error) {
      setError(error.message || "Não foi possível carregar mais posts.");
    } finally {
      setIsLoadingMorePosts(false);
    }
  }

  return (
    <>
      <DesktopFeed
        user={user}
        userImageUrl={userImageUrl}
        posts={filteredPosts}
        communities={myCommunities}
        events={upcomingEvents}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isLoading={isLoading}
        error={error}
        isCreating={isCreating}
        onCreatePost={handleCreatePost}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        onLogout={handleLogout}
        rankingPreview={rankingPreview}
        onOpenFullRanking={handleOpenFullRanking}
        onRankingChanged={refreshRankingPreview}
        hasMorePosts={hasMorePosts}
        isLoadingMorePosts={isLoadingMorePosts}
        onLoadMorePosts={handleLoadMorePosts}
      />

      <MobileFeed
        user={user}
        userImageUrl={userImageUrl}
        posts={filteredPosts}
        isLoading={isLoading}
        error={error}
        isCreating={isCreating}
        onCreatePost={handleCreatePost}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        communities={myCommunities}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onLogout={handleLogout}
        onCreatePostShortcut={handleOpenPostComposer}
        onCreateCommunityShortcut={() => setIsCommunityFormOpen(true)}
        onCreateEventShortcut={() => setIsEventFormOpen(true)}
        rankingPreview={rankingPreview}
        onOpenFullRanking={handleOpenFullRanking}
        onRankingChanged={refreshRankingPreview}
        hasMorePosts={hasMorePosts}
        isLoadingMorePosts={isLoadingMorePosts}
        onLoadMorePosts={handleLoadMorePosts}
      />
      <RankingModal
        isOpen={isRankingModalOpen}
        ranking={rankingCompleto}
        isLoading={isRankingLoading}
        onClose={() => setIsRankingModalOpen(false)}
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