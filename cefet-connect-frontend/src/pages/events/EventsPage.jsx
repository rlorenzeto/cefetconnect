import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DesktopEvents from "../../components/event/DesktopEvents";
import MobileEvents from "../../components/event/MobileEvents";
import EventFormModal from "../../components/event/EventFormModal";
import EventDetailsModal from "../../components/event/EventDetailsModal";
import {
  createEvento,
  deleteEvento,
  getEvento,
  listEventos,
  listMeusEventos,
  participarEvento,
  sairEvento,
  updateEvento,
} from "../../services/eventoService";
import { getCurrentUser } from "../../services/authService";
import { listMinhasComunidades } from "../../services/comunidadeService";
import {
  filterVisibleEvents,
  isEventFinished,
  sortEventsWithFinishedLast,
} from "../../utils/eventFilters";
import { itemMatchesSearch } from "../../utils/searchUtils";
import { getRankingCompleto } from "../../services/rankingService";
import RankingModal from "../../components/ranking/RankingModal";

export default function EventsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rankingCompleto, setRankingCompleto] = useState([]);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);

  const myEventIds = useMemo(() => {
    return new Set(myEvents.map((event) => String(event.idEvento)));
  }, [myEvents]);

  const visibleEvents = useMemo(() => {
    return filterVisibleEvents(events, communities);
  }, [events, communities]);

  const normalizedEvents = useMemo(() => {
    const normalized = visibleEvents.map((event) => ({
      ...event,
      isFinalizado: isEventFinished(event),
      isParticipando: myEventIds.has(String(event.idEvento)),
    }));

    return sortEventsWithFinishedLast(normalized);
  }, [visibleEvents, myEventIds]);

  const filteredEvents = useMemo(() => {
    return normalizedEvents.filter((event) =>
      itemMatchesSearch(event, searchTerm, (currentEvent) => [
        currentEvent?.titulo,
        currentEvent?.descricaoEvento,
        currentEvent?.localEvento,
        currentEvent?.usuario?.nomeUsuario,
        currentEvent?.comunidade?.nomeComunidade,
      ])
    );
  }, [normalizedEvents, searchTerm]);

  useEffect(() => {
    if (!currentUser?.idUsuario) {
      navigate("/login");
      return;
    }

    loadInitialData();
  }, []);

  function checkUserParticipating(eventData) {
    const participantes = Array.isArray(eventData?.participantes)
      ? eventData.participantes
      : [];

    return participantes.some(
      (participante) =>
        String(participante?.idUsuario || "") ===
        String(currentUser?.idUsuario || "")
    );
  }

  useEffect(() => {
    if (isLoading) return;

    const params = new URLSearchParams(location.search);
    const action = params.get("action");
    const eventId = params.get("eventId");

    if (!action || !eventId) return;

    const targetEvent = normalizedEvents.find(
      (event) => String(event.idEvento) === String(eventId)
    );

    if (!targetEvent) return;

    navigate("/eventos", { replace: true });

    if (action === "edit") {
      setEditingEvent(targetEvent);
      setIsFormOpen(true);
    }

    if (action === "delete") {
      handleDeleteEvent(targetEvent);
    }
  }, [location.search, isLoading, normalizedEvents, navigate]);

  async function loadInitialData() {
    try {
      setIsLoading(true);
      setError("");

      const [eventsResponse, myEventsResponse, communitiesResponse] =
        await Promise.all([
          listEventos(),
          listMeusEventos(),
          listMinhasComunidades(),
        ]);

      const eventsData = eventsResponse?.dados || eventsResponse;
      const myEventsData = myEventsResponse?.dados || myEventsResponse;
      const communitiesData = communitiesResponse?.dados || communitiesResponse;

      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setMyEvents(Array.isArray(myEventsData) ? myEventsData : []);
      setCommunities(Array.isArray(communitiesData) ? communitiesData : []);
    } catch (error) {
      setError(error.message || "Não foi possível carregar os eventos.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingEvent(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(event) {
    setEditingEvent(event);
    setIsFormOpen(true);
  }

  async function handleOpenDetails(event) {
    try {
      setSelectedEvent(event);
      setIsDetailsOpen(true);

      const response = await getEvento(event.idEvento);
      const detailedEvent = response?.dados || response;

      const isParticipando = checkUserParticipating(detailedEvent);

      setSelectedEvent({
        ...event,
        ...detailedEvent,
        isParticipando,
        isFinalizado: event.isFinalizado,
      });
    } catch (error) {
      setError(error.message || "Não foi possível carregar os detalhes do evento.");
    }
  }

  async function handleSubmitEvent(payload) {
    try {
      setIsSaving(true);
      setError("");

      if (editingEvent?.idEvento) {
        await updateEvento(editingEvent.idEvento, payload);
      } else {
        await createEvento(payload);
      }

      setIsFormOpen(false);
      setEditingEvent(null);
      await loadInitialData();
    } 
    catch (error) {
      const message = error.message || "Não foi possível salvar o evento.";

      setError(message);

      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteEvent(event) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o evento "${event.titulo}"?`
    );

    if (!confirmed) return;

    try {
      setLoadingActionId(event.idEvento);
      setError("");

      await deleteEvento(event.idEvento);

      setIsDetailsOpen(false);
      setSelectedEvent(null);

      await loadInitialData();
    } catch (error) {
      setError(error.message || "Não foi possível excluir o evento.");
    } finally {
      setLoadingActionId(null);
    }
  }
  
  async function handleToggleParticipation(event) {
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
        isFinalizado: event.isFinalizado,
      });

      await loadInitialData();
    } catch (error) {
      setError(error.message || "Não foi possível atualizar sua participação.");
    } finally {
      setLoadingActionId(null);
    }
  }

  async function handleOpenFullRanking() {
    try {
      setIsRankingModalOpen(true);
      setIsRankingLoading(true);

      const response = await getRankingCompleto();
      const dados = response?.dados || response;

      setRankingCompleto(Array.isArray(dados) ? dados : []);
    } catch {
      setRankingCompleto([]);
    } finally {
      setIsRankingLoading(false);
    }
  }

  const sharedProps = {
    events: filteredEvents,
    searchTerm,
    onSearchChange: setSearchTerm,
    currentUser,
    isLoading,
    error,
    loadingActionId,
    onOpenCreate: handleOpenCreate,
    onOpenDetails: handleOpenDetails,
    onEdit: handleOpenEdit,
    onDelete: handleDeleteEvent,
    onToggleParticipation: handleToggleParticipation,
    onOpenFullRanking: handleOpenFullRanking,
  };

  return (
    <>
      <DesktopEvents {...sharedProps} />
      <MobileEvents {...sharedProps} />

      <EventFormModal
        isOpen={isFormOpen}
        event={editingEvent}
        communities={communities}
        isSaving={isSaving}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSubmitEvent}
      />

      <RankingModal
        isOpen={isRankingModalOpen}
        ranking={rankingCompleto}
        isLoading={isRankingLoading}
        onClose={() => setIsRankingModalOpen(false)}
      />

      <EventDetailsModal
        isOpen={isDetailsOpen}
        event={selectedEvent}
        currentUser={currentUser}
        loadingActionId={loadingActionId}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteEvent}
        onToggleParticipation={handleToggleParticipation}
      />
    </>
  );
}