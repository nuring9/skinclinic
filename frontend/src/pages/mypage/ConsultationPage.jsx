import "./mypagesection.css";

const mockConsultations = [
  {
    id: 1,
    title: "시술 후 붉은기 문의",
    message: "관리자 답변이 등록되었습니다.",
    updatedAt: "2026-03-18 16:20",
  },
  {
    id: 2,
    title: "다음 예약 가능 일정 문의",
    message: "3월 마지막 주 평일 오전 예약이 가능합니다.",
    updatedAt: "2026-03-15 11:05",
  },
];

export default function ConsultationPage() {
  return (
    <section className="mypage-section-card">
      <h2>상담 내역</h2>
      <div className="mypage-section-list">
        {mockConsultations.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>{item.title}</strong>
            <p>{item.message}</p>
            <p>최근 업데이트: {item.updatedAt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
