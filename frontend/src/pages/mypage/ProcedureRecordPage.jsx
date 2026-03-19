import "./mypagesection.css";

const mockRecords = [
  {
    id: 1,
    procedureName: "피코토닝",
    treatedAt: "2026-02-20",
    before: "시술 전 사진 등록 완료",
    after: "시술 후 사진 등록 완료",
  },
  {
    id: 2,
    procedureName: "LDM 물방울 리프팅",
    treatedAt: "2026-01-11",
    before: "시술 전 사진 등록 완료",
    after: "시술 후 사진 등록 완료",
  },
];

export default function ProcedureRecordPage() {
  return (
    <section className="mypage-section-card">
      <h2>시술 기록</h2>
      <div className="mypage-section-list">
        {mockRecords.map((item) => (
          <div key={item.id} className="mypage-section-item">
            <strong>{item.procedureName}</strong>
            <p>시술일: {item.treatedAt}</p>
            <p>{item.before}</p>
            <p>{item.after}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
