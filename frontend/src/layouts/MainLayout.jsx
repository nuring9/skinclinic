import { Link, Outlet, useNavigate } from "react-router-dom";
import ChatbotPage from "@/pages/chatbot/ChatbotPage";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div>
      <header className="main-header">
        <div className="main-header-inner">
          <Link to="/" className="main-header-brand">
            Skin Clinic
          </Link>
          <div className="main-header-auth">
            {isAuthenticated ? (
              <>
                <span>{user.loginId}님</span>
                <button type="button" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <ChatbotPage />
    </div>
  );
}
