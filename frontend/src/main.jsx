import React from "react";
import ReactDOM from "react-dom/client"; // 프로젝트 전체에서 딱 한 번, **main.jsx에서만 쓰임.
import { RouterProvider } from "react-router-dom";
import router from "./router"; // 폴더까지만 경로를 적으면, 그 안의 index 파일을 기본값으로 찾는다.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
