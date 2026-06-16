import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopCommunities from "../../components/community/DesktopCommunities";
import MobileCommunities from "../../components/community/MobileCommunities";
import CommunityFormModal from "../../components/community/CommunityFormModal";
import {
  createComunidade,
  deleteComunidade,
  entrarComunidade,
  listComunidades,
  sairComunidade,
  updateComunidade,
} from "../../services/comunidadeService";
import { getCurrentUser } from "../../services/authService";
import { listCommunityPins } from "../../services/pinService";
import { itemMatchesSearch } from "../../utils/searchUtils";
import { getRankingCompleto } from "../../services/rankingService";
import RankingModal from "../../components/ranking/RankingModal";

export default function CommunitiesPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [communities, setCommunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState("");
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rankingCompleto, setRankingCompleto] = useState([]);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?.idUsuario) {
      navigate("/login");
      return;
    }

    loadCommunities();
  }, []);

  async function loadCommunities() {
    try {
      setIsLoading(true);
      setError("");

      const response = await listComunidades();
      const dados = response?.dados || response;

      const communitiesWithPins = await attachPinsToCommunities(
        Array.isArray(dados) ? dados : []
      );

      setCommunities(communitiesWithPins);
    } catch (error) {
      setError(error.message || "Não foi possível carregar as comunidades.");
    } finally {
      setIsLoading(false);
    }
  }

  async function attachPinsToCommunities(communitiesList = []) {
    return Promise.all(
      communitiesList.map(async (community) => {
        try {
          const response = await listCommunityPins(community.idComunidade);
          const pinsData = response?.dados || response;

          return {
            ...community,
            pins: Array.isArray(pinsData) ? pinsData.slice(0, 2) : [],
          };
        } catch {
          return {
            ...community,
            pins: [],
          };
        }
      })
    );
  }

  const filteredCommunities = useMemo(() => {
    return communities.filter((community) =>
      itemMatchesSearch(community, searchTerm, (currentCommunity) => [
        currentCommunity?.nomeComunidade,
        currentCommunity?.descricaoComunidade,
        currentCommunity?.usuario?.nomeUsuario,
        currentCommunity?.criador?.nomeUsuario,
        ...(Array.isArray(currentCommunity?.pins)
          ? currentCommunity.pins.map((pin) => pin.nomePin)
          : []),
      ])
    );
  }, [communities, searchTerm]);

  function handleOpenCreate() {
    setEditingCommunity(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(community) {
    setEditingCommunity(community);
    setIsFormOpen(true);
  }

  async function handleSubmitCommunity(payload) {
    try {
      setIsSaving(true);
      setError("");

      if (editingCommunity) {
        await updateComunidade(editingCommunity.idComunidade, payload);
      } else {
        await createComunidade(payload);
      }

      setIsFormOpen(false);
      setEditingCommunity(null);
      await loadCommunities();
    } catch (error) {
      setError(error.message || "Não foi possível salvar a comunidade.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleJoin(community) {
    try {
      setLoadingActionId(community.idComunidade);
      setError("");

      await entrarComunidade(community.idComunidade);
      await loadCommunities();
    } catch (error) {
      setError(error.message || "Não foi possível entrar na comunidade.");
    } finally {
      setLoadingActionId("");
    }
  }

  async function handleLeave(community) {
    const confirmed = window.confirm(
      `Tem certeza que deseja sair da comunidade "${community.nomeComunidade}"?`
    );

    if (!confirmed) return;

    try {
      setLoadingActionId(community.idComunidade);
      setError("");

      await sairComunidade(community.idComunidade);
      await loadCommunities();
    } catch (error) {
      setError(error.message || "Não foi possível sair da comunidade.");
    } finally {
      setLoadingActionId("");
    }
  }

  async function handleDelete(community) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a comunidade "${community.nomeComunidade}"?`
    );

    if (!confirmed) return;

    try {
      setLoadingActionId(community.idComunidade);
      setError("");

      await deleteComunidade(community.idComunidade);
      await loadCommunities();
    } catch (error) {
      setError(error.message || "Não foi possível excluir a comunidade.");
    } finally {
      setLoadingActionId("");
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
    communities: filteredCommunities,
    searchTerm,
    onSearchChange: setSearchTerm,
    currentUser,
    isLoading,
    error,
    loadingActionId,
    onOpenCreate: handleOpenCreate,
    onOpenCommunity: (idComunidade) => navigate(`/comunidades/${idComunidade}`),
    onJoin: handleJoin,
    onLeave: handleLeave,
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
    onOpenFullRanking: handleOpenFullRanking,
  };

  return (
    <>
      <DesktopCommunities {...sharedProps} />
      <MobileCommunities {...sharedProps} />

      <RankingModal
        isOpen={isRankingModalOpen}
        ranking={rankingCompleto}
        isLoading={isRankingLoading}
        onClose={() => setIsRankingModalOpen(false)}
      />

      <CommunityFormModal
        key={editingCommunity?.idComunidade || "new-community"}
        isOpen={isFormOpen}
        community={editingCommunity}
        isSaving={isSaving}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCommunity(null);
        }}
        onSubmit={handleSubmitCommunity}
      />
    </>
  );
}