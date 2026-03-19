import "./mypagesection.css";

const mockPayments = [
  {
    id: 1,
    procedureName: "LDM 물방울 리프팅",
    amount: "89,000원",
    paidAt: "2026-03-19 10:12",
    status: "결제 완료",
  },
  {
    id: 2,
    procedureName: "피코토닝",
    amount: "120,000원",
    paidAt: "2026-03-02 15:40",
    status: "결제 완료",
  },
];

export default function PaymentPage() {
  return (
    <section className="mypage-section-card">
      <h2>결제 내역</h2>
      <div className="mypage-section-list">
        {mockPayments.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>{item.procedureName}</strong>
            <p>결제 금액: {item.amount}</p>
            <p>결제일: {item.paidAt}</p>
            <p>상태: {item.status}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
