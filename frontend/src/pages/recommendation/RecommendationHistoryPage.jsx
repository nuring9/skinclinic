import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 특정 사용자 조회를 위해 API 추가
import {
  getAllRecommendations,
  getRecommendationHistoriesByUser,
} from "@/api/recommendationApi";
import { skinTypes, skinConcerns } from "@/constants/skinSurveyOptions";
import { formatDateTime } from "@/utils/date";
import "./recommendation.css";

export default function RecommendationHistoryPage() {
  const navigate = useNavigate();

  // 페이징 관련 상태 관리
  const [historyPage, setHistoryPage] = useState(null); // content, totalPages 등이 담긴 객체
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // 검색 관련 상태 추가
  const [searchUserId, setSearchUserId] = useState(""); // 입력창에 입력 중인 값
  const [appliedSearchId, setAppliedSearchId] = useState(""); // 실제 검색이 적용된 ID

  const PAGE_SIZE = 10; // 한 페이지에 보여줄 개수

  // 라벨 변환 헬퍼 함수 추가
  const getSkinTypeLabel = (value) => {
    return skinTypes.find((type) => type.value === value)?.label || value;
  };

  const getSkinConcernLabel = (value) => {
    return (
      skinConcerns.find((concern) => concern.value === value)?.label || value
    );
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        let data;

        // 적용된 검색 ID가 있으면 사용자별 조회, 없으면 전체 조회 호출
        if (appliedSearchId) {
          data = await getRecommendationHistoriesByUser(
            appliedSearchId,
            currentPage,
            PAGE_SIZE,
          );
        } else {
          data = await getAllRecommendations(currentPage, PAGE_SIZE);
        }

        setHistoryPage(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("추천 이력을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentPage, appliedSearchId]); // 페이지나 검색어가 변경될 때마다 재호출

  // 검색 실행 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // 검색 시에는 무조건 1페이지(0)부터 보여줌
    setAppliedSearchId(searchUserId);
  };

  // 검색 초기화 핸들러
  const handleReset = () => {
    setSearchUserId("");
    setAppliedSearchId("");
    setCurrentPage(0);
  };

  // 페이지 이동 핸들러
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < historyPage.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // 페이지 이동 시 상단으로 스크롤
    }
  };

  if (loading) {
    return (
      <div className="recommendation-page">
        <div className="recommendation-wrap">
          <div className="recommendation-header-card">
            <h1>추천 이력 불러오는 중...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="recommendation-page">
        <div className="recommendation-wrap">
          <div className="recommendation-header-card">
            <p>{errorMessage}</p>
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

  // 실제 리스트 데이터 추출
  const histories = historyPage?.content || [];

  return (
    <div className="recommendation-page">
      <div className="recommendation-wrap">
        <div className="recommendation-header-card">
          <p className="recommendation-kicker">ALL RECOMMENDATIONS</p>
          <h1>
            {appliedSearchId
              ? `사용자 #${appliedSearchId}의 추천 이력`
              : "전체 추천 이력"}
          </h1>
          <p className="recommendation-subtitle">
            {appliedSearchId
              ? "해당 사용자의 과거 맞춤 시술 추천 기록입니다."
              : "저장된 맞춤 시술 추천 이력을 최신순으로 확인할 수 있어요."}
          </p>
        </div>

        {/* 사용자 검색 영역 */}
        <div
          className="recommendation-meta-card"
          style={{ marginBottom: "20px" }}
        >
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: "10px" }}
          >
            <input
              type="number"
              placeholder="사용자 ID로 검색 (숫자 입력)"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
              }}
            />
            <button
              type="submit"
              style={{ padding: "0 20px", whiteSpace: "nowrap" }}
            >
              검색
            </button>
            {appliedSearchId && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  background: "#f4f4f4",
                  color: "#666",
                  padding: "0 20px",
                  whiteSpace: "nowrap",
                }}
              >
                초기화
              </button>
            )}
          </form>
        </div>

        <div className="recommendation-history-card">
          <h2>
            {appliedSearchId ? "검색 결과" : "추천 목록"}
            (총 {historyPage?.totalElements || 0}건)
          </h2>

          {histories.length > 0 ? (
            <>
              <div className="history-list">
                {histories.map((history) => (
                  <div
                    key={history.recommendationId}
                    className="history-item"
                    onClick={() =>
                      navigate(`/recommendations/${history.recommendationId}`)
                    }
                  >
                    <div>
                      <strong>추천 #{history.recommendationId}</strong>
                      <p>
                        설문 #{history.surveyId} / 사용자 #
                        {history.userId || "알수없음"}
                      </p>
                      <p>
                        {getSkinTypeLabel(history.skinTypeCode)} /{" "}
                        {history.concernCodes
                          ?.map((code) => getSkinConcernLabel(code))
                          .join(", ")}
                      </p>
                    </div>
                    <span>{formatDateTime(history.createdAt)}</span>
                  </div>
                ))}
              </div>

              {/* 페이징 컨트롤러 UI */}
              <div
                className="pagination-wrap"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "15px",
                  marginTop: "30px",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={historyPage?.first}
                  className="paging-btn"
                >
                  이전
                </button>

                <span className="page-indicator">
                  <strong>{currentPage + 1}</strong> /{" "}
                  {historyPage?.totalPages || 1} 페이지
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={historyPage?.last}
                  className="paging-btn"
                >
                  다음
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p>저장된 추천 이력이 없습니다.</p>
              {appliedSearchId && (
                <button onClick={handleReset} style={{ marginTop: "10px" }}>
                  전체 목록으로 돌아가기
                </button>
              )}
            </div>
          )}
        </div>

        <div className="recommendation-actions">
          <button onClick={() => navigate("/")}>메인으로 이동</button>
        </div>
      </div>
    </div>
  );
}
