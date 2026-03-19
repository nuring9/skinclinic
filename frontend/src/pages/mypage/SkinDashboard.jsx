import { useEffect, useState } from "react";
import { getSkinSurvey } from "@/api/skinSurveyApi";
import { getRecommendationHistoriesByUser } from "@/api/recommendationApi";
import {
  getSkinConcernLabel,
  getSkinTypeLabel,
} from "@/constants/skinSurveyOptions";
import "./skindashboard.css";

// 사용자 기본 정보
const MOCK_USER = {
  id: 1,
  name: "박누리",
};

// 예약 현황
// 시술명(LDM 리프팅 등), 날짜, 시간, 현재 상태(확정/완료).
const mockReservations = [
  {
    id: 101,
    procedureName: "LDM 물방울 리프팅",
    date: "2026-03-25",
    time: "14:00",
    status: "예약 확정",
  },
  {
    id: 102,
    procedureName: "피코토닝",
    date: "2026-04-02",
    time: "11:30",
    status: "완료",
  },
];

// 결제 이력
// 결제 번호, 시술명, 결제 금액, 상태(PAID), 결제 일시.
const mockPayments = [
  {
    id: "P-20260319-001",
    procedureName: "LDM 물방울 리프팅",
    amount: 89000,
    status: "PAID",
    paidAt: "2026-03-19 10:12",
  },
];

// 상담 내역 (1:1 문의)
// 문의 제목, 마지막 답변 내용, 날짜.
const mockConsultations = [
  {
    id: 1,
    title: "시술 후 붉은기 문의",
    lastMessage: "관리자 답변이 등록되었습니다.",
    updatedAt: "2026-03-18 16:20",
  },
];

// 시술 전/후 기록 (비포 애프터)
// 시술명, 시술 날짜, 사진 파일 경로(또는 설명).
const mockRecords = [
  {
    id: 1,
    procedureName: "피코토닝",
    treatedAt: "2026-02-20",
    beforeImage: "시술 전 사진",
    afterImage: "시술 후 사진",
  },
];

// 알림 센터
// 알림 유형(예약/결제), 메시지 내용, 생성 시간.
const mockNotifications = [
  {
    id: 1,
    type: "예약",
    message: "3월 25일 예약이 확정되었습니다.",
    createdAt: "2026-03-19 09:00",
  },
  {
    id: 2,
    type: "결제",
    message: "결제가 정상적으로 완료되었습니다.",
    createdAt: "2026-03-19 10:12",
  },
];

export default function SkinDashboard() {
  const [survey, setSurvey] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPageData = async () => {
      setLoading(true);

      try {
        const surveyData = await getSkinSurvey(1).catch(() => {
          console.warn("피부 진단 API가 아직 준비되지 않았습니다.");
          return { skinType: "DRY", concerns: ["PORE"] };
        });
        setSurvey(surveyData);

        const recommendationPage = await getRecommendationHistoriesByUser(
          1,
          0,
          5,
        ).catch(() => {
          console.warn("추천 이력 API가 아직 준비되지 않았습니다.");
          return { content: [] };
        });
        setRecommendations(recommendationPage?.content || []);
      } catch (error) {
        console.error("데이터 로드 중 알 수 없는 에러 발생", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []);

  if (loading) {
    return <div className="skin-dashboard">마이페이지 불러오는 중...</div>;
  }

  return (
    <div className="skin-dashboard">
      <div className="skin-dashboard-wrap">
        <section className="skin-dashboard-hero">
          <p className="skin-dashboard-kicker">MY PAGE</p>
          <h1>{MOCK_USER.name}님의 통합 조회</h1>
          <p>
            피부 진단, 추천 시술, 예약, 결제, 상담, 시술 기록, 알림을 한 번에
            확인할 수 있어요.
          </p>
        </section>

        <section className="skin-dashboard-summary-grid">
          <div className="skin-dashboard-summary-card">
            <span>피부 타입</span>
            <strong>{survey ? getSkinTypeLabel(survey.skinType) : "-"}</strong>
          </div>
          <div className="skin-dashboard-summary-card">
            <span>추천 시술</span>
            <strong>{recommendations.length}건</strong>
          </div>
          <div className="skin-dashboard-summary-card">
            <span>예약 내역</span>
            <strong>{mockReservations.length}건</strong>
          </div>
          <div className="skin-dashboard-summary-card">
            <span>알림</span>
            <strong>{mockNotifications.length}건</strong>
          </div>
        </section>

        <section className="skin-dashboard-card">
          <h2>내 피부 진단 결과</h2>
          {survey ? (
            <>
              <p>
                <strong>피부 타입:</strong> {getSkinTypeLabel(survey.skinType)}
              </p>
              <p>
                <strong>주요 피부 고민:</strong>{" "}
                {survey.concerns?.map(getSkinConcernLabel).join(", ") || "없음"}
              </p>
            </>
          ) : (
            <p>피부 진단 결과가 없습니다.</p>
          )}
        </section>

        <section className="skin-dashboard-card">
          <h2>내 추천 시술</h2>
          {recommendations.length > 0 ? (
            <div className="skin-dashboard-list">
              {recommendations.map((item) => (
                <div
                  key={item.recommendationId}
                  className="skin-dashboard-list-item"
                >
                  <strong>추천 #{item.recommendationId}</strong>
                  <p>{getSkinTypeLabel(item.skinTypeCode)}</p>
                  <p>
                    {item.concernCodes?.map(getSkinConcernLabel).join(", ") ||
                      "고민 정보 없음"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>추천 시술 내역이 없습니다.</p>
          )}
        </section>

        <section className="skin-dashboard-card">
          <h2>내 예약 내역</h2>
          <div className="skin-dashboard-list">
            {mockReservations.map((item) => (
              <div key={item.id} className="skin-dashboard-list-item">
                <strong>{item.procedureName}</strong>
                <p>
                  {item.date} {item.time}
                </p>
                <p>{item.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="skin-dashboard-card">
          <h2>내 결제 내역</h2>
          <div className="skin-dashboard-list">
            {mockPayments.map((item) => (
              <div key={item.id} className="skin-dashboard-list-item">
                <strong>{item.procedureName}</strong>
                <p>{item.amount.toLocaleString()}원</p>
                <p>
                  {item.status} / {item.paidAt}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="skin-dashboard-card">
          <h2>내 상담 내역</h2>
          <div className="skin-dashboard-list">
            {mockConsultations.map((item) => (
              <div key={item.id} className="skin-dashboard-list-item">
                <strong>{item.title}</strong>
                <p>{item.lastMessage}</p>
                <p>{item.updatedAt}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="skin-dashboard-card">
          <h2>내 시술 기록</h2>
          <div className="skin-dashboard-list">
            {mockRecords.map((item) => (
              <div key={item.id} className="skin-dashboard-list-item">
                <strong>{item.procedureName}</strong>
                <p>시술일: {item.treatedAt}</p>
                <p>
                  {item.beforeImage} / {item.afterImage}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="skin-dashboard-card">
          <h2>내 알림 내역</h2>
          <div className="skin-dashboard-list">
            {mockNotifications.map((item) => (
              <div key={item.id} className="skin-dashboard-list-item">
                <strong>[{item.type}]</strong>
                <p>{item.message}</p>
                <p>{item.createdAt}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
