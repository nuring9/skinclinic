import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SkinSurveyPage from "@/pages/skin-survey/SkinSurveyPage";
import SkinSurveyResultPage from "@/pages/skin-survey/SkinSurveryResultPage";
import RecommendationHistoryPage from "@/pages/recommendation/RecommendationHistoryPage";
import RecommendationResultPage from "@/pages/recommendation/RecommendationResultPage";

const router = createBrowserRouter([
  // 1. 홈/랜딩 페이지
  {
    path: "/",
    element: <MainPage />,
  },
  {
    // 2. 피부 설문 작성 페이지 (질문지 답변하는 곳)
    path: "/skin-survey",
    element: <SkinSurveyPage />,
  },
  {
    // 3. 설문 완료 직후 결과 페이지 (내 피부 타입/고민 분석 결과)
    path: "/result/:id",
    element: <SkinSurveyResultPage />,
  },
  {
    // 4. 전체 추천 이력 목록 페이지 (지금까지 받은 모든 추천 리스트)
    path: "/recommendations",
    element: <RecommendationHistoryPage />,
  },
  {
    // 5. 맞춤 시술 추천 상세 페이지 (특정 추천 결과의 점수와 사유 확인)
    // :recommendationId는 추천 이력의 고유 ID를 의미함
    path: "/recommendations/:recommendationId",
    element: <RecommendationResultPage />,
  },
]);

export default router;
