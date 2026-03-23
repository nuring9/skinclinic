import { formatDateTime } from "@/utils/date";
import "./mypagesection.css";

const mockReservations = [
  {
    id: 1,
    procedureName: "LDM 물방울 리프팅",
    date: "2026-03-25",
    time: "14:00",
    status: "예약 확정",
  },
  {
    id: 2,
    procedureName: "피코토닝",
    date: "2026-04-02",
    time: "11:30",
    status: "방문 예정",
  },
];

export default function ReservationPage() {
  return (
    <section className="mypage-section-card">
      <h2>예약 내역</h2>
      <div className="mypage-section-list">
        {mockReservations.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>{item.procedureName}</strong>
            <p>
              예약 일시: {formatDateTime(`${item.date} ${item.time}`)}
            </p>
            <p>상태: {item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
