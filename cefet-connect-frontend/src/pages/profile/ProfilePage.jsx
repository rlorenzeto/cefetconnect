import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DesktopProfile from "../../components/profile/DesktopProfile";
import MobileProfile from "../../components/profile/MobileProfile";
import {
  getCurrentUser,
  getProfileImageUrl,
  getUserProfile,
  logoutUser,
} from "../../services/authService";
import { listPosts } from "../../services/postService";

export default function ProfilePage() {
  const navigate = useNavigate();
  const savedUser = getCurrentUser();

  const [user, setUser] = useState(savedUser);
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);

  const matricula = savedUser?.matricula || user?.matricula;

  useEffect(() => {
    async function loadProfile() {
      if (!matricula) {
        navigate("/login");
        return;
      }

      try {
        const response = await getUserProfile(matricula);
        setUser(response?.dados || response);
        const postsResponse = await listPosts();
        const postsData = postsResponse?.dados || postsResponse;

        const filteredPosts = Array.isArray(postsData)
          ? postsData.filter(
              (post) => post?.usuario?.matricula === matricula
            )
          : [];

        setUserPosts(filteredPosts);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [matricula, navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] text-[#343434]">
        Carregando perfil...
      </div>
    );
  }

  const imageUrl = getProfileImageUrl(user?.fotoUrl);

  return (
    <>
      <DesktopProfile
        user={user}
        imageUrl={imageUrl}
        userPosts={userPosts}
        onEditProfile={() => navigate("/profile/edit")}
        onLogout={handleLogout}
      />

      <MobileProfile
        user={user}
        imageUrl={imageUrl}
        userPosts={userPosts}
        onEditProfile={() => navigate("/profile/edit")}
        onLogout={handleLogout}
      />
    </>
  );
}