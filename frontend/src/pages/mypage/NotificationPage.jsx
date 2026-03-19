import "./mypagesection.css";

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
  {
    id: 3,
    type: "안내",
    message: "시술 후 주의사항이 도착했습니다.",
    createdAt: "2026-03-19 10:30",
  },
];

export default function NotificationPage() {
  return (
    <section className="mypage-section-card">
      <h2>알림 내역</h2>
      <div className="mypage-section-list">
        {mockNotifications.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>[{item.type}]</strong>
            <p>{item.message}</p>
            <p>{item.createdAt}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
