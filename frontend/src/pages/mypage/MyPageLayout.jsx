import { NavLink, Outlet } from "react-router-dom";
import "./mypagelayout.css";

const MENU_ITEMS = [
  { to: "/mypage", label: "통합조회", end: true },
  { to: "/mypage/reservations", label: "예약 내역" },
  { to: "/mypage/diagnosis", label: "피부 진단 결과" },
  { to: "/mypage/recommendations", label: "맞춤 추천" },
  { to: "/mypage/payments", label: "결제 내역" },
  { to: "/mypage/consultations", label: "상담 내역" },
  { to: "/mypage/records", label: "시술 기록" },
  { to: "/mypage/notifications", label: "알림 내역" },
  { to: "/mypage/profile-edit", label: "회원정보 수정" },
  { to: "/mypage/withdraw", label: "회원탈퇴" },
];

export default function MyPageLayout() {
  return (
    <div className="mypage-page">
      <div className="mypage-layout">
        <aside className="mypage-sidebar">
          <NavLink to="/mypage" end className="mypage-title-link">
            <h2>마이페이지</h2>
          </NavLink>

          <nav className="mypage-nav">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `mypage-nav-item ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="mypage-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
