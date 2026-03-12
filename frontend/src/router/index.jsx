import { createBrowserRouter } from "react-router-dom";
import SkinSurveyPage from "../pages/SkinSurveyPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SkinSurveyPage />,
  },
]);

export default router;
