import React from "react";
import ReactDOM from "react-dom/client"; // 프로젝트 전체에서 딱 한 번, **main.jsx에서만 쓰임.
import { RouterProvider } from "react-router-dom";
import router from "./router"; // 폴더까지만 경로를 적으면, 그 안의 index 파일을 기본값으로 찾는다.
import { AuthProvider } from "@/context/AuthContext";

// 1. 카카오 SDK 초기화 로직 호출 (다른파일에 이미 SDK 초기화 로직 추가했음)
// 사용자가 '나에게 보내기' 버튼을 누르는 시점은 언제일지 모름. 하지만 버튼을 누르기 전에 이미 카카오 SDK는 초기화(init)가 완료되어 있어야 함.
// main.jsx에서 호출을 안 하면 카카오 SDK는 "준비 상태"가 되지 않기 때문에 호출해줘야 함.
//initKakao();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
