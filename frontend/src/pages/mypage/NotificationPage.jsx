import { useEffect, useState } from "react";
import {
  getUnreadNotificationCount,
  getUserNotifications,
  markNotificationAsKakaoSent,
  markNotificationAsRead,
} from "@/api/notificationApi";
import { sendNotificationToKakaoMemo } from "@/utils/kakao";
import "./mypagesection.css";

const USER_ID = 1;

const TYPE_LABEL = {
  RESERVATION: "예약",
  PAYMENT: "결제",
  CONSULTATION: "상담",
};

const FILTERS = [
  { label: "전체", value: "ALL" },
  { label: "예약", value: "RESERVATION" },
  { label: "결제", value: "PAYMENT" },
  { label: "상담", value: "CONSULTATION" },
];

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const [notificationData, unreadData] = await Promise.all([
        getUserNotifications(USER_ID, filter),
        getUnreadNotificationCount(USER_ID),
      ]);

      setNotifications(notificationData);
      setUnreadCount(unreadData.unreadCount);
    } catch (error) {
      console.error("알림 데이터를 불러오지 못했습니다.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const handleRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error("읽음 처리 실패", error);
    }
  };

  const handleSendToKakao = async (item) => {
    try {
      setSendingId(item.id);

      await sendNotificationToKakaoMemo({
        title: item.title,
        message: item.message,
        typeLabel: TYPE_LABEL[item.type],
      });

      await markNotificationAsKakaoSent(item.id);
      await loadNotifications();

      alert("카카오톡 나와의 채팅으로 전송되었습니다.");
    } catch (error) {
      console.error("카카오 전송 실패", error);
      alert(
        "카카오 전송에 실패했습니다. 카카오 로그인/동의 여부를 확인해주세요.",
      );
    } finally {
      setSendingId(null);
    }
  };

  if (loading) {
    return (
      <section className="mypage-section-card">
        <h2>알림 내역</h2>
        <p>알림을 불러오는 중입니다...</p>
      </section>
    );
  }

  return (
    <section className="mypage-section-card">
      <div className="notification-header">
        <div>
          <h2>알림 내역</h2>
          <p className="notification-subtitle">안 읽은 알림 {unreadCount}건</p>
        </div>
      </div>

      <div className="notification-filter-row">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`notification-filter-button ${filter === item.value ? "active" : ""}`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mypage-section-list">
        {notifications.length === 0 ? (
          <div className="mypage-section-item">
            <p>표시할 알림이 없습니다.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`mypage-section-item notification-item ${item.read ? "read" : "unread"}`}
            >
              <div className="notification-item-top">
                <strong>
                  [{TYPE_LABEL[item.type]}] {item.title}
                </strong>
                {item.kakaoShareAvailable && (
                  <span className="notification-channel">
                    {item.kakaoSent ? "카카오 전송 완료" : "카카오 전송 가능"}
                  </span>
                )}
              </div>

              <p>{item.message}</p>

              <div className="notification-item-bottom">
                <span>{item.createdAt.replace("T", " ")}</span>

                <div className="notification-action-row">
                  {!item.read && (
                    <button
                      type="button"
                      className="notification-read-button"
                      onClick={() => handleRead(item.id)}
                    >
                      읽음 처리
                    </button>
                  )}

                  {item.kakaoShareAvailable && (
                    <button
                      type="button"
                      className="notification-kakao-button"
                      disabled={sendingId === item.id}
                      onClick={() => handleSendToKakao(item)}
                    >
                      {sendingId === item.id
                        ? "전송 중..."
                        : item.kakaoSent
                          ? "카카오 다시 보내기"
                          : "카카오로 받기"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
