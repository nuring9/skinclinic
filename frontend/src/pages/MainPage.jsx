import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function MainPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="landing-page">
      <div className="landing-hero">
        <p className="landing-eyebrow">Personalized Care Journey</p>
        <h1>로그인부터 피부 진단, 추천, 마이페이지까지 한 번에 연결했습니다.</h1>
        <p className="landing-copy">
          {isAuthenticated
            ? `${user.loginId}님, 지금 바로 마이페이지에서 내 기록을 확인해보세요.`
            : "계정을 만들고 로그인하면 개인화된 추천과 마이페이지 기능을 사용할 수 있어요."}
        </p>
        <div className="landing-actions">
          <Link to={isAuthenticated ? "/mypage" : "/login"}>
            <button>{isAuthenticated ? "마이페이지 열기" : "로그인하기"}</button>
          </Link>
          {!isAuthenticated ? (
            <Link to="/signup">
              <button>회원가입</button>
            </Link>
          ) : null}
        </div>
      </div>

      <div className="landing-links">
        <Link to="/skin-survey">
          <button>피부 설문 시작</button>
        </Link>
        <Link to="/mypage/recommendations">
          <button>내 맞춤 추천 보기</button>
        </Link>
        <Link to="/mypage/records">
          <button>시술 만족도 평가하러 가기</button>
        </Link>
        <Link to="/admin/notifications">
          <button>관리자 알림 관리 보기</button>
        </Link>
        <Link to="/admin/procedure-satisfaction">
          <button>관리자 만족도 통계 보기</button>
        </Link>
      </div>
    </section>
  );
}
