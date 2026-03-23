import { useEffect, useState } from "react";
import {
  getUnreadNotificationCount,
  getUserNotifications,
  markNotificationAsRead,
} from "@/api/notificationApi";
import "./mypagesection.css";

const CURRENT_USER_ID = 1;

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

  const loadNotifications = async (currentFilter = filter) => {
    const [notificationData, unreadData] = await Promise.all([
      getUserNotifications(CURRENT_USER_ID, currentFilter),
      getUnreadNotificationCount(CURRENT_USER_ID),
    ]);

    setNotifications(notificationData);
    setUnreadCount(unreadData.unreadCount);
  };

  useEffect(() => {
    loadNotifications().catch((error) => console.error(error));
  }, [filter]);

  const handleRead = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    await loadNotifications();
  };

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
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`mypage-section-item notification-item ${item.read ? "read" : "unread"}`}
          >
            <div className="notification-item-top">
              <strong>
                [{TYPE_LABEL[item.type]}] {item.title}
              </strong>
              {!item.read && <span className="notification-channel">새 알림</span>}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
