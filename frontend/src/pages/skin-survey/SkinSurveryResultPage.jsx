import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSkinSurvey } from "@/api/skinSurveyApi";
import { skinTypes, skinConcerns } from "@/constants/skinSurveyOptions";
import "./skin-survey.css";

export default function SkinSurveyResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSurveyResult = async () => {
      try {
        const data = await getSkinSurvey(id);
        setResult(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("설문 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResult();
  }, [id]);

  const getSkinTypeLabel = (value) => {
    return skinTypes.find((type) => type.value === value)?.label || value;
  };

  const getSkinConcernLabel = (value) => {
    return (
      skinConcerns.find((concern) => concern.value === value)?.label || value
    );
  };

  if (loading) {
    return (
      <div className="survey-page">
        <section className="result-page">
          <div className="result-wrap">
            <div className="result-skeleton skeleton-lg"></div>
            <div className="result-skeleton skeleton-md"></div>
            <div className="result-card">
              <div className="result-skeleton skeleton-sm"></div>
              <div className="result-skeleton skeleton-line"></div>
              <div className="result-skeleton skeleton-line"></div>
              <div className="result-skeleton skeleton-line short"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (errorMessage || !result) {
    return (
      <div className="survey-page">
        <section className="result-page">
          <div className="result-wrap">
            <div className="result-card center">
              <p className="result-error">
                {errorMessage || "결과를 찾을 수 없습니다."}
              </p>
              <button
                className="survey-submit-btn"
                onClick={() => navigate("/")}
              >
                설문하러 가기
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <section className="result-page">
        <div className="result-wrap">
          <div className="result-hero">
            <div>
              <span className="survey-badge">RESULT REPORT</span>
              <h1>피부 진단 결과</h1>
              <p>입력한 피부 타입과 고민을 바탕으로 현재 상태를 정리했어요.</p>
            </div>
            <div className="result-hero__number">
              <span>Survey No.</span>
              <strong>#{result.id}</strong>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-card main">
              <p className="result-card__label">피부 타입</p>
              <h2>{getSkinTypeLabel(result.skinType)}</h2>
              <p className="result-card__desc">
                선택한 피부 타입을 기준으로 관리 방향을 설정할 수 있어요.
              </p>
            </div>

            <div className="result-card side">
              <p className="result-card__label">주요 피부 고민</p>
              <div className="result-chip-list">
                {result.concerns?.length > 0 ? (
                  result.concerns.map((concern) => (
                    <span className="result-chip" key={concern}>
                      {getSkinConcernLabel(concern)}
                    </span>
                  ))
                ) : (
                  <p className="result-empty">선택한 고민이 없습니다.</p>
                )}
              </div>
            </div>
          </div>

          <div className="result-card">
            <p className="result-card__label">요약</p>
            <div className="result-summary">
              <div className="summary-box">
                <span>피부 타입</span>
                <strong>{getSkinTypeLabel(result.skinType)}</strong>
              </div>
              <div className="summary-box">
                <span>고민 개수</span>
                <strong>{result.concerns?.length || 0}개</strong>
              </div>
              <div className="summary-box">
                <span>설문 번호</span>
                <strong>{result.id}</strong>
              </div>
            </div>
          </div>

          <div className="survey-actions result-actions">
            <button
              className="survey-outline-btn"
              onClick={() => navigate("/skin-survey")}
            >
              다시 설문하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
