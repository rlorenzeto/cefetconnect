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
import { itemMatchesSearch } from "../../utils/searchUtils";
import { getRankingCompleto } from "../../services/rankingService";
import RankingModal from "../../components/ranking/RankingModal";


export default function CommunityPage() {
  const navigate = useNavigate();
  const { idComunidade } = useParams();

  const currentUser = getCurrentUser();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(2);
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const [isLoadingMorePosts, setIsLoadingMorePosts] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [communityPins, setCommunityPins] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [rankingCompleto, setRankingCompleto] = useState([]);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);;

  const userImageUrl = useMemo(() => {
    return getProfileImageUrl(currentUser?.fotoUrl);
  }, [currentUser?.fotoUrl]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      itemMatchesSearch(post, searchTerm, (currentPost) => [
        currentPost?.conteudo,
        currentPost?.usuario?.nomeUsuario,
        currentPost?.comunidade?.nomeComunidade,
      ])
    );
  }, [posts, searchTerm]);

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
        setPostsPage(2);
        setHasMorePosts(false);
        return;
      }

      const postsResponse = await listPostsComunidade(idComunidade, 1);
      const postsData = postsResponse?.dados || [];
      const paginacao = postsResponse?.paginacao;

      setPosts(Array.isArray(postsData) ? postsData : []);
      setPostsPage(2);

      setHasMorePosts(
        paginacao
          ? Number(paginacao.pagina) < Number(paginacao.totalPaginas)
          : false
      );
    } catch (error) {
      setError(error.message || "Não foi possível carregar a comunidade.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoadMorePosts() {
    if (isLoadingMorePosts || !hasMorePosts) return;

    try {
      setIsLoadingMorePosts(true);
      setError("");

      const response = await listPostsComunidade(idComunidade, postsPage);
      const novosPosts = response?.dados || [];
      const paginacao = response?.paginacao;

      setPosts((prevPosts) => {
        const postsMap = new Map();

        [...prevPosts, ...novosPosts].forEach((post) => {
          if (post?.idPost) {
            postsMap.set(post.idPost, post);
          }
        });

        return Array.from(postsMap.values());
      });

      setPostsPage((prev) => prev + 1);

      setHasMorePosts(
        paginacao
          ? Number(paginacao.pagina) < Number(paginacao.totalPaginas)
          : false
      );
    } catch (error) {
      setError(error.message || "Não foi possível carregar mais posts.");
    } finally {
      setIsLoadingMorePosts(false);
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
    community,
    posts: filteredPosts,
    searchTerm,
    onSearchChange: setSearchTerm,
    pins: communityPins,
    currentUser,
    userImageUrl,
    isLoading,
    isCreating,
    error,
    hasMorePosts,
    isLoadingMorePosts,
    onLoadMorePosts: handleLoadMorePosts,
    currentCommunityAsOption,
    onBack: () => navigate("/comunidades"),
    onLeaveCommunity: handleLeaveCommunity,
    onJoinCommunity: handleJoinCommunity,
    onCreatePost: handleCreatePost,
    onPostDeleted: handlePostDeleted,
    onPostUpdated: handlePostUpdated,
    onOpenFullRanking: handleOpenFullRanking,
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
      <RankingModal
        isOpen={isRankingModalOpen}
        ranking={rankingCompleto}
        isLoading={isRankingLoading}
        onClose={() => setIsRankingModalOpen(false)}
      />
    </>
  );
}