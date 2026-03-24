import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SkinSurveyPage from "@/pages/skin-survey/SkinSurveyPage";
import SkinSurveyResultPage from "@/pages/skin-survey/SkinSurveryResultPage";
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
import AdminProcedureSatisfactionPage from "@/pages/admin/AdminProcedureSatisfactionPage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "skin-survey", element: <SkinSurveyPage /> },
      { path: "result/:id", element: <SkinSurveyResultPage /> },
      {
        path: "recommendations/:recommendationId",
        element: <RecommendationResultPage />,
      },
      {
        path: "admin/notifications",
        element: (
          <ProtectedRoute>
            <AdminNotificationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/procedure-satisfaction",
        element: (
          <ProtectedRoute>
            <AdminProcedureSatisfactionPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/mypage",
    element: (
      <ProtectedRoute>
        <MyPageLayout />
      </ProtectedRoute>
    ),
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
