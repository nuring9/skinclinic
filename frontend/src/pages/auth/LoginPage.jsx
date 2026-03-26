import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { resolveApiBaseUrl } from "@/api/apiClient";
import "./auth.css";

function getErrorMessage(error) {
  if (error?.response?.status === 401) {
    return "아이디 또는 비밀번호가 올바르지 않습니다.";
  }

  return error?.response?.data?.message || "로그인 중 문제가 발생했습니다.";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/mypage";

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const currentUser = await login(form);
      navigate(currentUser?.role === "ROLE_ADMIN" ? "/admin/notifications" : redirectTo, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKakaoLogin() {
    window.location.href = `${resolveApiBaseUrl()}/oauth2/authorization/kakao`;
  }

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <p className="auth-eyebrow">Skin Clinic Access</p>
        <h1>로그인하고 마이페이지로 들어가세요</h1>
        <p className="auth-copy">
          일반 로그인과 카카오 로그인을 모두 지원합니다.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            아이디
            <input
              value={form.loginId}
              onChange={(event) =>
                setForm((current) => ({ ...current, loginId: event.target.value }))
              }
              placeholder="아이디를 입력하세요"
              autoComplete="username"
              required
            />
          </label>

          <label>
            비밀번호
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}

          <button type="submit" className="auth-primary" disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <button type="button" className="auth-kakao" onClick={handleKakaoLogin}>
          카카오로 로그인
        </button>

        <p className="auth-helper">
          아직 계정이 없다면 <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </div>
  );
}
