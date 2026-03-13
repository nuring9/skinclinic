import api from "./apiClient";

// 전체 추천 이력 조회
export const getAllRecommendations = async () => {
  const response = await api.get("/api/recommendations");
  return response.data;
};

// 맞춤 시술 추천 저장
export const createRecommendation = async (surveyId) => {
  const response = await api.post("/api/recommendations", { surveyId });
  return response.data;
};

// 맞춤 시술 추천 단건 조회
export const getRecommendation = async (recommendationId) => {
  const response = await api.get(`/api/recommendations/${recommendationId}`);
  return response.data;
};

// 특정 설문 기준 추천 이력 조회
export const getRecommendationHistories = async (surveyId) => {
  const response = await api.get(`/api/recommendations/survey/${surveyId}`);
  return response.data;
};
