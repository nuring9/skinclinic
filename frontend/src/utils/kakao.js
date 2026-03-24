const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";

const resolveNotificationPageUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5173/mypage/notifications";
  }

  return `${window.location.origin}/mypage/notifications`;
};

const loadKakaoSdk = () =>
  new Promise((resolve, reject) => {
    if (window.Kakao) {
      resolve(window.Kakao);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-kakao-sdk="true"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Kakao));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.dataset.kakaoSdk = "true";
    script.onload = () => resolve(window.Kakao);
    script.onerror = reject;
    document.body.appendChild(script);
  });

export const ensureKakaoReady = async () => {
  const Kakao = await loadKakaoSdk();
  const javascriptKey = import.meta.env.VITE_KAKAO_JS_KEY;

  if (!javascriptKey) {
    throw new Error("VITE_KAKAO_JS_KEY가 설정되지 않았습니다.");
  }

  if (!Kakao.isInitialized()) {
    Kakao.init(javascriptKey);
  }

  return Kakao;
};

export const loginWithKakaoForMessage = async () => {
  const Kakao = await ensureKakaoReady();

  if (Kakao.Auth.getAccessToken()) {
    return Kakao;
  }

  await new Promise((resolve, reject) => {
    Kakao.Auth.login({
      scope: "talk_message,profile_nickname",
      success: () => resolve(),
      fail: (error) => reject(error),
    });
  });

  return Kakao;
};

export const sendNotificationToKakaoMemo = async ({
  title,
  message,
  typeLabel,
}) => {
  const Kakao = await loginWithKakaoForMessage();
  const notificationPageUrl = resolveNotificationPageUrl();

  await Kakao.API.request({
    url: "/v2/api/talk/memo/default/send",
    data: {
      template_object: {
        object_type: "text",
        text: `[${typeLabel}] ${title}\n${message}`,
        link: {
          web_url: notificationPageUrl,
          mobile_web_url: notificationPageUrl,
        },
        button_title: "알림 확인하기",
      },
    },
  });
};
