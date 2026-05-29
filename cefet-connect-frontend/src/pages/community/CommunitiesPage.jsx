import { useEffect, useState } from "react";
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

      setCommunities(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setError(error.message || "Não foi possível carregar as comunidades.");
    } finally {
      setIsLoading(false);
    }
  }

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

  const sharedProps = {
    communities,
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
  };

  return (
    <>
      <DesktopCommunities {...sharedProps} />
      <MobileCommunities {...sharedProps} />

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