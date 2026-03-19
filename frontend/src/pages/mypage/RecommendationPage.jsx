import "./mypagesection.css";

const mockRecommendations = [
  {
    id: 1,
    name: "LDM 물방울 리프팅",
    reason: "피부 진정과 수분 공급에 적합합니다.",
  },
  {
    id: 2,
    name: "피코토닝",
    reason: "칙칙한 피부톤과 색소 개선에 도움이 됩니다.",
  },
];

export default function RecommendationPage() {
  return (
    <section className="mypage-section-card">
      <h2>맞춤 추천</h2>
      <div className="mypage-section-list">
        {mockRecommendations.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>{item.name}</strong>
            <p>추천 사유: {item.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
