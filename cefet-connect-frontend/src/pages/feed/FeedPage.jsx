import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function FeedPage() {
  const navigate = useNavigate();
  const savedUser = getCurrentUser();

  const [user, setUser] = useState(savedUser);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

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

  async function loadInitialData() {
    try {
      setIsLoading(true);
      setError("");

      const [profileResponse, postsResponse] = await Promise.all([
        getUserProfile(idUsuario),
        listPosts(),
      ]);

      const profile = profileResponse?.dados || profileResponse;
      const normalizedProfile = {
        ...savedUser,
        ...profile,
        idUsuario: profile?.idUsuario || savedUser?.idUsuario,
        matricula: profile?.matricula || savedUser?.matricula,
      };
      const postsData = postsResponse?.dados || postsResponse;

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

      setPosts(orderedPosts);
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

      const postWithAuthorPhoto = {
        ...newPost,
        usuario: {
          ...user,
          ...(newPost.usuario || {}),
          fotoUrl: newPost.usuario?.fotoUrl || user?.fotoUrl,
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
        isLoading={isLoading}
        error={error}
        isCreating={isCreating}
        onCreatePost={handleCreatePost}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        onLogout={handleLogout}
      />

      <MobileFeed
        user={user}
        userImageUrl={userImageUrl}
        posts={posts}
        isLoading={isLoading}
        error={error}
        isCreating={isCreating}
        onCreatePost={handleCreatePost}
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
        onGoToProfile={() => navigate("/profile")}
        onLogout={handleLogout}
      />
    </>
  );
}