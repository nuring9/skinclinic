import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SkinSurveyPage from "@/pages/skin-survey/SkinSurveyPage";
import SkinSurveyResultPage from "@/pages/skin-survey/SkinSurveryResultPage";
import RecommendationHistoryPage from "@/pages/recommendation/RecommendationHistoryPage";
import RecommendationResultPage from "@/pages/recommendation/RecommendationResultPage";
import MainLayout from "@/layouts/MainLayout";
import SkinDashboard from "@/pages/mypage/SkinDashboard";
import MyPageLayout from "@/pages/mypage/MyPageLayout";
import ReservationPage from "@/pages/mypage/ReservationPage";
import DiagnosisPage from "@/pages/mypage/DiagnosisPage";
import RecommendationPage from "@/pages/mypage/RecommendationPage";
import PaymentPage from "@/pages/mypage/PaymentPage";
import ConsultationPage from "@/pages/mypage/ConsultationPage";
import ProcedureRecordPage from "@/pages/mypage/ProcedureRecordPage";
import NotificationPage from "@/pages/mypage/NotificationPage";
import ProfileEditPage from "@/pages/mypage/ProfileEditPage";
import WithdrawPage from "@/pages/mypage/WithdrawPage";
import AdminNotificationPage from "@/pages/admin/AdminNotificationPage";

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
  {
    // 6. 관리자
    path: "/admin/notifications",
    element: <AdminNotificationPage />,
  },
  {
    // 7. 챗봇
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "skin-survey", element: <SkinSurveyPage /> },
    ],
  },
  {
    // 마이페이지
    path: "/mypage",
    element: <MyPageLayout />,
    children: [
      { index: true, element: <SkinDashboard /> },
      { path: "reservations", element: <ReservationPage /> },
      { path: "diagnosis", element: <DiagnosisPage /> },
      { path: "recommendations", element: <RecommendationPage /> },
      { path: "payments", element: <PaymentPage /> },
      { path: "consultations", element: <ConsultationPage /> },
      { path: "records", element: <ProcedureRecordPage /> },
      { path: "notifications", element: <NotificationPage /> },
      { path: "profile-edit", element: <ProfileEditPage /> },
      { path: "withdraw", element: <WithdrawPage /> },
    ],
  },
]);

export default router;
