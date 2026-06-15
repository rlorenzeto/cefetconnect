import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesktopProfile from "../../components/profile/DesktopProfile";
import MobileProfile from "../../components/profile/MobileProfile";
import {
  getCurrentUser,
  getProfileImageUrl,
  getUserProfile,
  logoutUser,
} from "../../services/authService";
import {
  listUserPosts,
} from "../../services/postService";
import { listMinhasComunidades } from "../../services/comunidadeService";
import {
  listUserPins,
  removePinFromProfile,
} from "../../services/pinService";
import {
  listMyIcons,
  listUserIcons,
  importarIconesDoGradment,
} from "../../services/iconeService";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { idUsuarioPerfil } = useParams();

  const savedUser = getCurrentUser();

  const loggedUserId = savedUser?.idUsuario;
  const profileId = idUsuarioPerfil || loggedUserId;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState("");
  const [communities, setCommunities] = useState([]);
  const [pins, setPins] = useState([]);
  const [icones, setIcones] = useState([]);
  const [isRefreshingIcones, setIsRefreshingIcones] = useState(false);
  const [showAllCommunities, setShowAllCommunities] = useState(false);

  const isOwnProfile =
    loggedUserId &&
    profileId &&
    String(loggedUserId) === String(profileId);

  const imageUrl = useMemo(() => {
    return getProfileImageUrl(user?.fotoUrl);
  }, [user?.fotoUrl]);

  useEffect(() => {
    async function loadProfile() {
      if (!loggedUserId) {
        navigate("/login");
        return;
      }

      if (!profileId) {
        navigate("/profile");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [
          profileResponse,
          postsResponse,
          communitiesResponse,
          pinsResponse,
          iconesResponse,
        ] = await Promise.all([
          getUserProfile(profileId),
          listUserPosts(profileId),
          listMinhasComunidades(),
          listUserPins(profileId),
          isOwnProfile ? listMyIcons() : listUserIcons(profileId),
        ]);
        const profile = profileResponse?.dados || profileResponse;
        const postsData = postsResponse?.dados || postsResponse;

        const communitiesData = communitiesResponse?.dados || communitiesResponse;
        setCommunities(Array.isArray(communitiesData) ? communitiesData : []);

        const pinsData = pinsResponse?.dados || pinsResponse;
        setPins(Array.isArray(pinsData) ? pinsData : []);

        const iconesData = iconesResponse?.dados || iconesResponse;
        setIcones(Array.isArray(iconesData) ? iconesData : []);

        setUser({
          ...profile,
          idUsuario: profile?.idUsuario || profileId,
          matricula: profile?.matricula,
        });

        const orderedPosts = Array.isArray(postsData)
          ? [...postsData].sort(
              (a, b) =>
                new Date(b.dataHoraPublicacao) -
                new Date(a.dataHoraPublicacao)
            )
          : [];

        setUserPosts(orderedPosts);
      } catch (error) {
        setError(error.message || "Não foi possível carregar este perfil.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [loggedUserId, profileId, navigate]);

  function handleLogout() {
    const confirmed = window.confirm("Tem certeza que deseja sair da sua conta?");

    if (!confirmed) return;

    logoutUser();
    navigate("/login");
  }

  function handleGoBackToFeed() {
    navigate("/home");
  }

  function handlePostDeleted(idPost) {
    setUserPosts((prev) => prev.filter((post) => post.idPost !== idPost));
  }

  function handlePostUpdated(updatedPost) {
    setUserPosts((prev) =>
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] text-[#343434]">
        Carregando perfil...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f1f1f1] px-4 text-center text-[#343434]">
        <p className="text-sm font-semibold text-red-500">{error}</p>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mt-4 rounded-full bg-[#089464] px-5 py-2 text-sm font-bold text-white"
        >
          Voltar para o feed
        </button>
      </div>
    );
  }

  async function refreshPins() {
    try {
      const response = await listUserPins(profileId);
      const pinsData = response?.dados || response;

      setPins(Array.isArray(pinsData) ? pinsData : []);
    } catch (error) {
      setError(error.message || "Não foi possível atualizar os pins.");
    }
  }

  async function handleRemovePin(pin) {
    if (!isOwnProfile) return;

    const confirmed = window.confirm(
      `Remover o pin "${pin.nomePin}" do seu perfil?`
    );

    if (!confirmed) return;

    try {
      await removePinFromProfile(pin.idPin);

      setPins((prev) =>
        prev.filter((item) => String(item.idPin) !== String(pin.idPin))
      );
    } catch (error) {
      setError(error.message || "Não foi possível remover o pin.");
    }
  }

  async function refreshIcones() {
    try {
      const response = isOwnProfile
        ? await listMyIcons()
        : await listUserIcons(profileId);

      const iconesData = response?.dados || response;
      setIcones(Array.isArray(iconesData) ? iconesData : []);
    } catch (error) {
      setError(error.message || "Não foi possível atualizar os ícones.");
    }
  }

  async function handleRefreshIconesFromGradment() {
    if (!isOwnProfile) return;

    try {
      setIsRefreshingIcones(true);

      const response = await importarIconesDoGradment();

      await refreshIcones();

      const adicionados = response?.adicionados?.length ?? response?.dados?.adicionados?.length ?? 0;
      const duplicados = response?.duplicados?.length ?? response?.dados?.duplicados?.length ?? 0;

      if (adicionados > 0) {
        alert(`${adicionados} ícone(s) adicionado(s) ao perfil.`);
        return;
      }

      if (duplicados > 0) {
        alert("Seus ícones já estavam atualizados.");
        return;
      }

      alert(response?.mensagem || "Nenhum novo ícone encontrado no Gradment.");
    } catch (error) {
      alert(error.message || "Não foi possível importar os ícones do Gradment.");
    } finally {
      setIsRefreshingIcones(false);
    }
  }

  return (
    <>
      <DesktopProfile
        user={user}
        currentUser={savedUser}
        imageUrl={imageUrl}
        userPosts={userPosts}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => navigate("/profile/edit")}
        onLogout={handleLogout}
        onGoBack={handleGoBackToFeed}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        communities={communities}
        showAllCommunities={showAllCommunities}
        onToggleCommunities={() => setShowAllCommunities((prev) => !prev)}
        onOpenCommunity={(idComunidade) => navigate(`/comunidades/${idComunidade}`)}
        pins={pins}
        onRefreshPins={refreshPins}
        onRemovePin={handleRemovePin}
        icones={icones}
        isRefreshingIcones={isRefreshingIcones}
        onRefreshIcones={handleRefreshIconesFromGradment}
      />

      <MobileProfile
        user={user}
        currentUser={savedUser}
        imageUrl={imageUrl}
        userPosts={userPosts}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => navigate("/profile/edit")}
        onLogout={handleLogout}
        onGoBack={handleGoBackToFeed}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        communities={communities}
        showAllCommunities={showAllCommunities}
        onToggleCommunities={() => setShowAllCommunities((prev) => !prev)}
        onOpenCommunity={(idComunidade) => navigate(`/comunidades/${idComunidade}`)}
        pins={pins}
        onRefreshPins={refreshPins}
        onRemovePin={handleRemovePin}
        icones={icones}
        isRefreshingIcones={isRefreshingIcones}
        onRefreshIcones={handleRefreshIconesFromGradment}
      />
    </>
  );
}