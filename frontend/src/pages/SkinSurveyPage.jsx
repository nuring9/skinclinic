import { useState } from "react";
import { createSkinSurvey } from "../api/skinSurveyApi";

const skinTypes = [
  { value: "DRY", label: "건성" },
  { value: "OILY", label: "지성" },
  { value: "COMBINATION", label: "복합성" },
  { value: "SENSITIVE", label: "민감성" },
  { value: "NORMAL", label: "중성" },
];

const skinConcerns = [
  { value: "ACNE", label: "여드름" },
  { value: "PORES", label: "모공" },
  { value: "REDNESS", label: "홍조" },
  { value: "WRINKLES", label: "주름" },
  { value: "PIGMENTATION", label: "색소침착" },
  { value: "DRYNESS", label: "건조함" },
  { value: "SEBUM", label: "피지과다" },
];

export default function SkinSurveyPage() {
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState([]);
  const [message, setMessage] = useState("");

  const handleConcernChange = (concernValue) => {
    setConcerns((prev) =>
      prev.includes(concernValue)
        ? prev.filter((item) => item !== concernValue)
        : [...prev, concernValue],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skinType) {
      setMessage("피부 타입을 선택해주세요.");
      return;
    }

    try {
      const result = await createSkinSurvey({ skinType, concerns });
      console.log(result);
      setMessage("설문이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage("설문 저장에 실패했습니다.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h1>피부 설문</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <h3>피부 타입 선택</h3>
          {skinTypes.map((type) => (
            <label
              key={type.value}
              style={{ display: "block", marginBottom: "8px" }}
            >
              <input
                type="radio"
                name="skinType"
                value={type.value}
                checked={skinType === type.value}
                onChange={(e) => setSkinType(e.target.value)}
              />{" "}
              {type.label}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>피부 고민 선택</h3>
          {skinConcerns.map((concern) => (
            <label
              key={concern.value}
              style={{ display: "block", marginBottom: "8px" }}
            >
              <input
                type="checkbox"
                checked={concerns.includes(concern.value)}
                onChange={() => handleConcernChange(concern.value)}
              />{" "}
              {concern.label}
            </label>
          ))}
        </div>

        <button type="submit">저장</button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
}
