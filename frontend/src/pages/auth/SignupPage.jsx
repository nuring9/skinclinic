import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  sendSignupEmailCode,
  signUp,
  verifySignupEmailCode,
} from "@/api/authApi";
import "./auth.css";

function getMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSocialSignup = searchParams.get("social") === "true";

  const initialForm = useMemo(
    () => ({
      loginId: "",
      name: searchParams.get("name") || "",
      email: searchParams.get("email") || "",
      password: "",
      confirmPassword: "",
      phone: "",
      socialProvider: searchParams.get("provider") || "",
      socialId: searchParams.get("socialId") || "",
    }),
    [searchParams],
  );

  const [form, setForm] = useState(initialForm);
  const [emailCode, setEmailCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(isSocialSignup);
  const [emailNotice, setEmailNotice] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [remainingSeconds]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSendCode() {
    setEmailNotice("");
    setEmailErrorMessage("");
    setSubmitErrorMessage("");
    setIsSendingCode(true);

    try {
      await sendSignupEmailCode(form.email);
      setEmailVerified(false);
      setRemainingSeconds(5 * 60);
      setEmailNotice("인증번호를 보냈어요. 메일함을 확인해주세요.");
    } catch (error) {
      setEmailErrorMessage(getMessage(error, "인증번호 전송에 실패했습니다."));
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleVerifyCode() {
    setEmailNotice("");
    setEmailErrorMessage("");
    setSubmitErrorMessage("");
    setIsVerifyingCode(true);

    try {
      await verifySignupEmailCode({ email: form.email, code: emailCode });
      setEmailVerified(true);
      setRemainingSeconds(0);
      setEmailNotice("");
    } catch (error) {
      setEmailVerified(false);
      setEmailErrorMessage(getMessage(error, "인증번호 확인에 실패했습니다."));
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPasswordErrorMessage("");
    setSubmitErrorMessage("");

    if (!isSocialSignup && form.password !== form.confirmPassword) {
      setPasswordErrorMessage("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({
        loginId: form.loginId,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        emailVerified,
        socialSignup: isSocialSignup,
        socialProvider: form.socialProvider,
        socialId: form.socialId,
      });
      navigate("/login", { replace: true });
    } catch (error) {
      setSubmitErrorMessage(getMessage(error, "회원가입 중 문제가 발생했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatRemainingTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  return (
    <div className="auth-page">
      <section className="auth-panel">
        <p className="auth-eyebrow">New Account</p>
        <h1>{isSocialSignup ? "소셜 회원가입 마무리" : "회원가입"}</h1>
        <p className="auth-copy">
          {isSocialSignup
            ? "카카오에서 받은 정보를 확인하고 가입을 완료하세요."
            : "이메일 인증 후 계정을 만들 수 있어요."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isSocialSignup ? (
            <label>
              아이디
              <input
                value={form.loginId}
                onChange={(event) => updateField("loginId", event.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </label>
          ) : null}

          <label>
            이름
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="이름을 입력하세요"
              required
            />
          </label>

          <label>
            이메일
            <input
              type="email"
              value={form.email}
              onChange={(event) => {
                updateField("email", event.target.value);
                setEmailVerified(false);
                setEmailNotice("");
                setEmailErrorMessage("");
                setRemainingSeconds(0);
              }}
              placeholder="you@example.com"
              required
              disabled={isSocialSignup}
            />
          </label>
          {!isSocialSignup && emailNotice ? (
            <p className="auth-notice auth-field-feedback">{emailNotice}</p>
          ) : null}

          {!isSocialSignup ? (
            <>
              <div className="auth-inline-group auth-action-group">
                <button
                  type="button"
                  className="auth-secondary"
                  onClick={handleSendCode}
                  disabled={isSendingCode || !form.email}
                >
                  {isSendingCode ? "전송 중..." : "인증번호 보내기"}
                </button>
              </div>

              <div className="auth-inline-group">
                <input
                  value={emailCode}
                  onChange={(event) => setEmailCode(event.target.value)}
                  placeholder="인증번호 6자리"
                />
              </div>
              {remainingSeconds > 0 ? (
                <p className="auth-timer auth-field-feedback">
                  인증번호 남은시간 {formatRemainingTime(remainingSeconds)}
                </p>
              ) : null}

              <div className="auth-inline-group auth-action-group">
                <button
                  type="button"
                  className="auth-secondary"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode || !emailCode}
                >
                  {isVerifyingCode ? "확인 중..." : "인증 확인"}
                </button>
              </div>

              {emailErrorMessage ? (
                <p className="auth-error auth-field-feedback">{emailErrorMessage}</p>
              ) : null}

              {emailVerified ? (
                <p className="auth-success auth-field-feedback">
                  이메일 인증이 완료되었습니다.
                </p>
              ) : null}
            </>
          ) : null}

          {!isSocialSignup ? (
            <>
              <label>
                비밀번호
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => {
                    updateField("password", event.target.value);
                    setPasswordErrorMessage("");
                  }}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </label>

              <label>
                비밀번호 확인
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => {
                    updateField("confirmPassword", event.target.value);
                    setPasswordErrorMessage("");
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </label>
              {passwordErrorMessage ? (
                <p className="auth-error auth-field-feedback">{passwordErrorMessage}</p>
              ) : null}
            </>
          ) : null}

          <label>
            전화번호
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="01012345678"
              required
            />
          </label>

          {submitErrorMessage ? <p className="auth-error">{submitErrorMessage}</p> : null}

          <button
            type="submit"
            className="auth-primary"
            disabled={isSubmitting || (!isSocialSignup && !emailVerified)}
          >
            {isSubmitting ? "가입 중..." : "회원가입 완료"}
          </button>
        </form>

        <p className="auth-helper">
          이미 계정이 있다면 <Link to="/login">로그인</Link>
        </p>
      </section>
    </div>
  );
}
