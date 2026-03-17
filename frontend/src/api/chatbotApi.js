import api from "./apiClient";

export const getChatbotWelcome = async () => {
  const response = await api.get("/api/chatbot/welcome");
  return response.data;
};

export const sendChatbotMessage = async (optionCode) => {
  const response = await api.post("/api/chatbot/messages", { optionCode });
  return response.data;
};
