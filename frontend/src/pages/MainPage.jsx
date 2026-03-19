import { Link } from "react-router-dom";

export default function MainPage() {
  // 보통은 로그인을 하거나 조회를 해서 ID를 가져오지만,
  // 지금은 테스트를 위해 가장 최근 ID가 1번이라고 가정해볼게요.
  const sampleId = 1;

  return (
    <div>
      <h1>메인 페이지</h1>
      <p>나중에 팀원 메인 채워넣기</p>

      {/* 1. 설문 시작 */}
      <Link to="/skin-survey">
        <button>피부 설문 시작</button>
      </Link>
      <br />
      <br />

      {/* 2. 전체 목록 */}
      <Link to="/recommendations">
        <button>전체 추천 이력 목록 보기</button>
      </Link>
      <br />
      <br />

      {/* 3. 특정 상세 페이지 (변수를 넣어서 동적으로 만들기) */}
      <Link to={`/recommendations/${sampleId}`}>
        <button>최근 맞춤 시술 추천 상세 보기</button>
      </Link>
      <br />
      <br />

      {/* 마이페이지 */}
      <Link to="/mypage">
        <button>마이페이지 보기</button>
      </Link>
    </div>
  );
}
