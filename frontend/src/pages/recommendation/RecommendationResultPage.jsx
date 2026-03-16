import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecommendation,
  getRecommendationHistoriesBySurvey,
} from "@/api/recommendationApi";
import { skinTypes, skinConcerns } from "@/constants/skinSurveyOptions";
import "./recommendation.css";

export default function RecommendationResultPage() {
  const { recommendationId } = useParams(); // 백엔드 @PathVariable 의 /api/recommendations/10 변수로 받아서 10가져옴
  const navigate = useNavigate();

  const [recommendation, setRecommendation] = useState(null);
  // 페이징 객체 전체를 담기 위해 초기값을 null로 설정
  const [historyPage, setHistoryPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. 상세 추천 데이터 조회
        const recommendationData = await getRecommendation(recommendationId);
        setRecommendation(recommendationData);

        // 2. 같은 설문의 이전 이력들 조회 (페이징: 0페이지에서 5개)
        if (recommendationData?.surveyId) {
          setHistoryLoading(true);
          const pageData = await getRecommendationHistoriesBySurvey(
            recommendationData.surveyId,
            0,
            5,
          );
          setHistoryPage(pageData);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("추천 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
        setHistoryLoading(false);
      }
    };

    fetchData();
  }, [recommendationId]);

  const getSkinTypeLabel = (value) => {
    return skinTypes.find((type) => type.value === value)?.label || value;
  };

  const getSkinConcernLabel = (value) => {
    return (
      skinConcerns.find((concern) => concern.value === value)?.label || value
    );
  };

  // 메인 로딩 화면
  if (loading) {
    return (
      <div className="recommendation-page">
        <div className="recommendation-wrap">
          <div className="recommendation-header-card">
            <h1>추천 결과 불러오는 중...</h1>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생 시 화면
  if (errorMessage || !recommendation) {
    return (
      <div className="recommendation-page">
        <div className="recommendation-wrap">
          <div className="recommendation-header-card">
            <p>{errorMessage || "추천 결과가 없습니다."}</p>
            <div
              className="recommendation-actions"
              style={{ marginTop: "20px" }}
            >
              <button onClick={() => navigate("/")}>메인으로 이동</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-page">
      <div className="recommendation-wrap">
        {/* 헤더 영역 */}
        <div className="recommendation-header-card">
          <p className="recommendation-kicker">CUSTOM PROCEDURE</p>
          <h1>맞춤 시술 추천 결과</h1>
          <p className="recommendation-subtitle">
            피부 타입과 고민을 바탕으로 저장된 추천 결과입니다.
          </p>
        </div>

        {/* 요약 정보 영역 */}
        <div className="recommendation-summary-grid">
          <div className="recommendation-summary-card">
            <span>추천 번호</span>
            <strong>{recommendation.recommendationId}</strong>
          </div>
          <div className="recommendation-summary-card">
            <span>설문 번호</span>
            <strong>{recommendation.surveyId}</strong>
          </div>
          <div className="recommendation-summary-card">
            <span>피부 타입</span>
            <strong>{getSkinTypeLabel(recommendation.skinTypeCode)}</strong>
          </div>
        </div>

        {/* 피부 고민 칩 영역 */}
        <div className="recommendation-meta-card">
          <h3>피부 고민</h3>
          <div className="chip-wrap">
            {recommendation.concernCodes?.map((code) => (
              <span key={code} className="chip">
                {getSkinConcernLabel(code)}
              </span>
            ))}
          </div>
        </div>

        {/* 추천 시술 상세 목록 */}
        <div className="recommendation-list-card">
          <h2>추천 시술 목록</h2>
          {recommendation.recommendations?.length > 0 ? (
            <div className="procedure-list">
              {recommendation.recommendations.map((item) => (
                <div className="procedure-card" key={item.procedureCode}>
                  <div className="procedure-card-top">
                    <div>
                      <p className="procedure-code">{item.procedureCode}</p>
                      <h3>{item.procedureName}</h3>
                    </div>
                    <div className="procedure-score">점수 {item.score}</div>
                  </div>

                  <p className="procedure-description">{item.description}</p>

                  <div className="procedure-reasons">
                    <strong>추천 이유</strong>
                    <ul>
                      {item.reasons?.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>추천 시술이 없습니다.</p>
          )}
        </div>

        {/* 하단 페이징 이력 영역 */}
        <div className="recommendation-history-card">
          <h2>같은 설문 기준 추천 이력</h2>
          {historyLoading ? (
            <p>추천 이력을 불러오는 중...</p>
          ) : historyPage?.content?.length > 0 ? (
            <div className="history-list">
              {/* historyPage.content 배열을 순회하도록 수정 */}
              {historyPage.content.map((history) => (
                <div
                  key={history.recommendationId}
                  className={`history-item ${
                    Number(history.recommendationId) ===
                    Number(recommendationId)
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    navigate(`/recommendations/${history.recommendationId}`)
                  }
                >
                  <div>
                    <strong>추천 #{history.recommendationId}</strong>
                    <p>
                      {getSkinTypeLabel(history.skinTypeCode)} /{" "}
                      {history.concernCodes
                        ?.map((code) => getSkinConcernLabel(code))
                        .join(", ")}
                    </p>
                  </div>
                  <span>
                    {history.createdAt
                      ? new Date(history.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
              ))}

              {/* 페이징 안내 문구 (선택 사항) */}
              {historyPage.totalElements > 5 && (
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  최근 5개의 이력만 표시됩니다. (총 {historyPage.totalElements}
                  개)
                </div>
              )}
            </div>
          ) : (
            <p>저장된 추천 이력이 없습니다.</p>
          )}
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="recommendation-actions">
          <button
            onClick={() => navigate(`/result/${recommendation.surveyId}`)}
          >
            설문 결과로 돌아가기
          </button>
          <button onClick={() => navigate("/recommendations")}>
            전체 추천 이력 보기
          </button>
          <button onClick={() => navigate("/")}>메인으로 이동</button>
        </div>
      </div>
    </div>
  );
}
