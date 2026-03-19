import "./mypagesection.css";

const mockDiagnosis = [
  {
    id: 1,
    title: "피부 타입",
    description: "건성 피부",
  },
  {
    id: 2,
    title: "주요 피부 고민",
    description: "모공, 잔주름",
  },
  {
    id: 3,
    title: "진단 메모",
    description: "수분 관리와 피부결 개선 중심의 관리가 필요합니다.",
  },
];

export default function DiagnosisPage() {
  return (
    <section className="mypage-section-card">
      <h2>피부 진단 결과</h2>
      <div className="mypage-section-list">
        {mockDiagnosis.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
