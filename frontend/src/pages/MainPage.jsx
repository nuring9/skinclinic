import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <p>나중에 팀원 메인 채워넣기</p>
      <Link to="/skin-survey">피부 설문 시작</Link>
    </div>
  );
}
