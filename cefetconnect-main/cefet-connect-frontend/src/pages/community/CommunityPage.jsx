import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesktopCommunity from "../../components/community/DesktopCommunity";
import MobileCommunity from "../../components/community/MobileCommunity";
import {
  getComunidade,
  listPostsComunidade,
  sairComunidade,
  entrarComunidade,
} from "../../services/comunidadeService";
import { createPost } from "../../services/postService";
import {
  getCurrentUser,
  getProfileImageUrl,
} from "../../services/authService";
import { listCommunityPins } from "../../services/pinService";


export default function CommunityPage() {
  const navigate = useNavigate();
  const { idComunidade } = useParams();

  const currentUser = getCurrentUser();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [communityPins, setCommunityPins] = useState([]);
  const [error, setError] = useState("");

  const userImageUrl = useMemo(() => {
    return getProfileImageUrl(currentUser?.fotoUrl);
  }, [currentUser?.fotoUrl]);

  useEffect(() => {
    if (!currentUser?.idUsuario) {
      navigate("/login");
      return;
    }

    loadCommunityPage();
  }, [idComunidade]);

  async function loadCommunityPage() {
    try {
      setIsLoading(true);
      setError("");

      const communityResponse = await getComunidade(idComunidade);
      const communityData = communityResponse?.dados || communityResponse;

      setCommunity(communityData);

      const pinsData = await listCommunityPins(idComunidade);

      setCommunityPins(Array.isArray(pinsData) ? pinsData : []);

      if (!communityData?.isMembro) {
        setPosts([]);
        return;
      }

      const postsResponse = await listPostsComunidade(idComunidade);
      const postsData = postsResponse?.dados || postsResponse;

      setPosts(Array.isArray(postsData) ? postsData : []);
    } catch (error) {
      setError(error.message || "Não foi possível carregar a comunidade.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreatePost(payload) {
    try {
      setIsCreating(true);
      setError("");

      const response = await createPost({
        ...payload,
        idComunidade,
      });

      const newPost = response?.dados || response;

      const normalizedPost = {
        ...newPost,
        fk_Comunidade_idComunidade:
          newPost?.fk_Comunidade_idComunidade || idComunidade,
        comunidade: newPost?.comunidade || community,
        usuario: newPost?.usuario || currentUser,
      };

      setPosts((prev) => [normalizedPost, ...prev]);
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
    setPosts((prev) =>
      prev.map((post) =>
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
      )
    );
  }

  async function handleLeaveCommunity() {
    const confirmed = window.confirm(
      `Tem certeza que deseja sair da comunidade "${community?.nomeComunidade}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await sairComunidade(idComunidade);
      navigate("/comunidades");
    } catch (error) {
      setError(error.message || "Não foi possível sair da comunidade.");
    }
  }

  async function handleJoinCommunity() {
    try {
      setError("");

      await entrarComunidade(idComunidade);
      await loadCommunityPage();
    } catch (error) {
      setError(error.message || "Não foi possível entrar na comunidade.");
    }
  }

  const currentCommunityAsOption = community
    ? [
        {
          ...community,
          idComunidade,
          nomeComunidade: community.nomeComunidade,
        },
      ]
    : [];

  const sharedProps = {
    community,
    posts,
    pins: communityPins,
    currentUser,
    userImageUrl,
    isLoading,
    isCreating,
    error,
    currentCommunityAsOption,
    onBack: () => navigate("/comunidades"),
    onLeaveCommunity: handleLeaveCommunity,
    onJoinCommunity: handleJoinCommunity,
    onCreatePost: handleCreatePost,
    onPostDeleted: handlePostDeleted,
    onPostUpdated: handlePostUpdated,
    onRefreshCommunityPins: async () => {
      const pinsResponse = await listCommunityPins(idComunidade);
      const pinsData = pinsResponse?.dados || pinsResponse;

      setCommunityPins(Array.isArray(pinsData) ? pinsData : []);
    },
  };

  return (
    <>
      <DesktopCommunity {...sharedProps} />
      <MobileCommunity {...sharedProps} />
    </>
  );
}