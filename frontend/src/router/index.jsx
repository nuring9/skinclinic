import { createBrowserRouter } from "react-router-dom";
import MainPage from "@/pages/MainPage";
import SkinSurveyPage from "@/pages/skin-survey/SkinSurveyPage";
import SkinSurveyResultPage from "@/pages/skin-survey/SkinSurveryResultPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/skin-survey",
    element: <SkinSurveyPage />,
  },
  {
    path: "/result/:id",
    element: <SkinSurveyResultPage />,
  },
]);

export default router;
