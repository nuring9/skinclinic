import { Outlet } from "react-router-dom";
import ChatbotPage from "@/pages/chatbot/ChatbotPage";

export default function MainLayout() {
  return (
    <div>
      <header>공통 헤더</header>
      <main>
        <Outlet />
      </main>
      <ChatbotPage />
    </div>
  );
}
