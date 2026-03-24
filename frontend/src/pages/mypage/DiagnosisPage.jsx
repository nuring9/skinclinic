import { useEffect, useState } from "react";
import { getMyMemberInfo } from "@/api/memberApi";
import { getSkinSurveysByUser } from "@/api/skinSurveyApi";
import {
  getAnswerLabel,
  getQuestionTitle,
  getSkinAreaLabel,
  getSkinConcernLabel,
  getSkinTypeLabel,
} from "@/constants/skinSurveyOptions";
import "./mypagesection.css";

export default function DiagnosisPage() {
  const [memberId, setMemberId] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDiagnosis() {
      try {
        const member = await getMyMemberInfo();
        setMemberId(member.id);
        const data = await getSkinSurveysByUser(member.id, page, 1);
        setSurvey(data.content?.[0] || null);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        console.error(error);
        setErrorMessage("피부 진단 결과를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDiagnosis();
  }, [page]);

  return (
    <section className="mypage-section-card">
      <div className="mypage-report-hero diagnosis-hero">
        <div>
          <p className="mypage-report-kicker">Skin Analysis Report</p>
          <h2>피부 진단 결과</h2>
          <p className="mypage-report-copy">
            최근 설문 응답을 바탕으로 현재 피부 타입과 주요 고민, 생활 패턴 신호를
            한눈에 정리했어요.
          </p>
        </div>
        {survey ? (
          <div className="mypage-report-badge-card">
            <span>{page === 0 ? "최신 진단" : `이전 진단 #${page + 1}`}</span>
            <strong>{getSkinTypeLabel(survey.skinType)}</strong>
          </div>
        ) : null}
      </div>

      {isLoading ? <p>피부 진단 결과를 불러오는 중입니다...</p> : null}
      {!isLoading && errorMessage ? <p>{errorMessage}</p> : null}
      {!isLoading && !errorMessage && !survey ? <p>저장된 피부 진단 결과가 없습니다.</p> : null}
      {!isLoading && survey ? (
        <div className="diagnosis-layout">
          <div className="diagnosis-summary-grid">
            <div className="diagnosis-highlight-card diagnosis-highlight-card-primary">
              <span className="diagnosis-card-label">피부 타입</span>
              <strong>{getSkinTypeLabel(survey.skinType)}</strong>
              <p>현재 피부 컨디션의 기본 축으로 반영되는 타입이에요.</p>
            </div>

            <div className="diagnosis-highlight-card">
              <span className="diagnosis-card-label">주요 피부 고민</span>
              <div className="diagnosis-chip-list">
                {survey.concerns?.length > 0 ? (
                  survey.concerns.map((concern) => (
                    <span key={concern} className="diagnosis-chip">
                      {getSkinConcernLabel(concern)}
                    </span>
                  ))
                ) : (
                  <span className="diagnosis-empty-chip">선택 없음</span>
                )}
              </div>
            </div>

            <div className="diagnosis-highlight-card">
              <span className="diagnosis-card-label">고민 부위</span>
              <div className="diagnosis-chip-list">
                {survey.skinAreas?.length > 0 ? (
                  survey.skinAreas.map((area) => (
                    <span key={area} className="diagnosis-chip diagnosis-chip-soft">
                      {getSkinAreaLabel(area)}
                    </span>
                  ))
                ) : (
                  <span className="diagnosis-empty-chip">선택 없음</span>
                )}
              </div>
            </div>
          </div>

          <div className="diagnosis-interview-card">
            <div className="diagnosis-interview-head">
              <div>
                <p className="mypage-report-kicker">Detailed Answers</p>
                <h3>추가 문진 답변</h3>
              </div>
              <span className="diagnosis-interview-count">
                {Object.entries(survey.questionAnswers || {}).length}개 응답
              </span>
            </div>

            {Object.entries(survey.questionAnswers || {}).length > 0 ? (
              <div className="diagnosis-answer-list">
                {Object.entries(survey.questionAnswers).map(([code, value], index) => (
                  <div key={code} className="diagnosis-answer-item">
                    <span className="diagnosis-answer-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="diagnosis-answer-content">
                      <strong>{getQuestionTitle(code)}</strong>
                      <p>{getAnswerLabel(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>저장된 추가 문진 답변이 없습니다.</p>
            )}
          </div>

          {totalPages > 1 ? (
            <div className="diagnosis-pagination">
              <p className="diagnosis-pagination-label">이전 진단 기록</p>
              <div className="diagnosis-pagination-list">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`diagnosis-page-button ${page === index ? "active" : ""}`}
                    onClick={() => setPage(index)}
                    disabled={isLoading || page === index}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
