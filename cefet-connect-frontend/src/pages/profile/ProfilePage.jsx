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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { matriculaPerfil } = useParams();

  const savedUser = getCurrentUser();

  const loggedUserMatricula = savedUser?.matricula;
  const profileMatricula = matriculaPerfil || loggedUserMatricula;

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState("");

  const isOwnProfile =
    loggedUserMatricula &&
    profileMatricula &&
    String(loggedUserMatricula) === String(profileMatricula);

  const imageUrl = useMemo(() => {
    return getProfileImageUrl(user?.fotoUrl);
  }, [user?.fotoUrl]);

  useEffect(() => {
    async function loadProfile() {
      if (!loggedUserMatricula) {
        navigate("/login");
        return;
      }

      if (!profileMatricula) {
        navigate("/profile");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [profileResponse, postsResponse, likesResponse] =
          await Promise.all([
            getUserProfile(profileMatricula),
            listUserPosts(profileMatricula),
          ]);

        const profile = profileResponse?.dados || profileResponse;
        const postsData = postsResponse?.dados || postsResponse;

        setUser({
          ...profile,
          matricula: profile?.matricula || profileMatricula,
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
  }, [loggedUserMatricula, profileMatricula, navigate]);

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
      />
    </>
  );
}