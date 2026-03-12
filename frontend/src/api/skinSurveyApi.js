import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const createSkinSurvey = async (surveyData) => {
  const response = await api.post("/api/skin-surveys", surveyData); // POST 요청 전송("주소", 바디 데이터)
  return response.data;
  // axios 응답 전체 중 실제 바디 데이터만 반환.
};

// 이 파일은 백엔드 API 호출 전용 파일임.
