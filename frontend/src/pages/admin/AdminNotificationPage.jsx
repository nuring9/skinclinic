import { useEffect, useMemo, useState } from "react";
import { createNotification, getAllNotifications } from "@/api/notificationApi";
import "@/pages/mypage/mypagesection.css";

const initialForm = {
  userId: 1,
  type: "RESERVATION",
  title: "",
  message: "",
  kakaoShareAvailable: true,
};

const TYPE_LABEL = {
  RESERVATION: "예약",
  PAYMENT: "결제",
  CONSULTATION: "상담",
};

export default function AdminNotificationPage() {
  const [form, setForm] = useState(initialForm);
  const [notifications, setNotifications] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");

  const loadNotifications = async () => {
    try {
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("전체 알림 조회 실패", error);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "userId"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createNotification(form);
      setForm(initialForm);
      await loadNotifications();
      alert("알림 생성이 완료되었습니다.");
    } catch (error) {
      console.error("알림 생성 실패", error);
      alert("알림 생성에 실패했습니다.");
    }
  };

  const filteredNotifications = useMemo(() => {
    const trimmed = searchUserId.trim();

    if (!trimmed) {
      return notifications;
    }

    return notifications.filter((item) => String(item.userId) === trimmed);
  }, [notifications, searchUserId]);

  return (
    <section className="mypage-section-card admin-notification-page">
      <div className="notification-header">
        <div>
          <h2>개별 알림 발송</h2>
          <p className="notification-subtitle">
            예약 변경, 준비사항, 기타 안내가 필요할 때 고객에게 직접 알림을 보낼
            수 있습니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mypage-section-list admin-form">
        <div className="mypage-section-item">
          <p>대상 사용자 ID</p>
          <input name="userId" value={form.userId} onChange={handleChange} />
        </div>

        <div className="mypage-section-item">
          <p>알림 유형</p>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="RESERVATION">예약</option>
            <option value="PAYMENT">결제</option>
            <option value="CONSULTATION">상담</option>
          </select>
        </div>

        <div className="mypage-section-item">
          <p>제목</p>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="예: 예약 일정 변경 안내"
          />
        </div>

        <div className="mypage-section-item">
          <p>내용</p>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder="고객에게 전달할 안내 내용을 입력하세요."
          />
        </div>

        <div className="admin-form-actions">
          <label className="notification-checkbox">
            <input
              type="checkbox"
              name="kakaoShareAvailable"
              checked={form.kakaoShareAvailable}
              onChange={handleChange}
            />
            <span>카카오 나에게 보내기 허용</span>
          </label>

          <button
            type="submit"
            className="notification-read-button admin-submit-button"
          >
            알림 생성
          </button>
        </div>
      </form>

      <div className="admin-notification-history">
        <div className="admin-history-header">
          <div>
            <h3>전체 알림 내역</h3>
            <p className="admin-history-count">
              {searchUserId.trim()
                ? `${searchUserId}번 사용자 알림 ${filteredNotifications.length}건`
                : `전체 알림 ${filteredNotifications.length}건`}
            </p>
          </div>

          <div className="admin-history-filter">
            <label htmlFor="searchUserId">사용자 ID 조회</label>
            <div className="admin-history-filter-row">
              <input
                id="searchUserId"
                type="text"
                value={searchUserId}
                onChange={(event) => setSearchUserId(event.target.value)}
                placeholder="예: 1"
              />
              <button
                type="button"
                className="admin-filter-reset-button"
                onClick={() => setSearchUserId("")}
              >
                전체 보기
              </button>
            </div>
          </div>
        </div>

        <div className="mypage-section-list">
          {filteredNotifications.length === 0 ? (
            <div className="mypage-section-item">
              <p>해당 사용자에게 보낸 알림이 없습니다.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div key={item.id} className="mypage-section-item">
                <strong>
                  [{TYPE_LABEL[item.type]}] {item.title}
                </strong>
                <p>{item.message}</p>
                <p>대상 사용자: {item.userId}</p>
                <p>읽음 여부: {item.read ? "읽음" : "안 읽음"}</p>
                <p>
                  카카오 전송 가능: {item.kakaoShareAvailable ? "예" : "아니오"}
                </p>
                <p>카카오 전송 여부: {item.kakaoSent ? "전송됨" : "미전송"}</p>
                <p>생성일: {item.createdAt.replace("T", " ")}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
