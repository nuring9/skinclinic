import { useEffect, useMemo, useState } from "react";
import {
  getAllNotifications,
  getNotificationMembers,
  triggerNotificationEvent,
} from "@/api/notificationApi";
import "@/pages/mypage/mypagesection.css";

const initialForm = {
  userId: 1,
  type: "RESERVATION",
  title: "",
  message: "",
  eventReference: "",
};

const TYPE_LABEL = {
  RESERVATION: "예약",
  PAYMENT: "결제",
  CONSULTATION: "상담",
};

const getDefaultTitlePreview = (memberName, type) => {
  if (!memberName) return "";

  switch (type) {
    case "RESERVATION":
      return `${memberName}님 예약 안내`;
    case "PAYMENT":
      return `${memberName}님 결제 완료 안내`;
    case "CONSULTATION":
      return `${memberName}님 1:1 상담 안내`;
    default:
      return "";
  }
};

const getDefaultMessagePreview = (memberName, type, eventReference) => {
  if (!memberName) return "";

  const reference =
    eventReference?.trim() || "상세 정보는 마이페이지에서 확인해주세요.";

  switch (type) {
    case "RESERVATION":
      return `${memberName}님의 예약 이벤트가 발생했습니다. ${reference}`;
    case "PAYMENT":
      return `${memberName}님의 결제 이벤트가 발생했습니다. ${reference}`;
    case "CONSULTATION":
      return `${memberName}님의 1:1 상담 이벤트가 발생했습니다. ${reference}`;
    default:
      return "";
  }
};

export default function AdminNotificationPage() {
  const [form, setForm] = useState(initialForm);
  const [members, setMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [memberQuery, setMemberQuery] = useState("");

  const loadPage = async () => {
    const [memberData, notificationData] = await Promise.all([
      getNotificationMembers(),
      getAllNotifications(),
    ]);

    setMembers(memberData);
    setNotifications(notificationData);
  };

  useEffect(() => {
    loadPage().catch((error) => console.error(error));
  }, []);

  const selectedMember = useMemo(
    () => members.find((item) => item.memberId === form.userId),
    [members, form.userId],
  );

  const selectedHistory = useMemo(
    () => notifications.filter((item) => item.userId === form.userId),
    [notifications, form.userId],
  );

  const filteredMembers = useMemo(() => {
    const keyword = memberQuery.trim().toLowerCase();

    if (!keyword) {
      return members.slice(0, 8);
    }

    return members.filter((member) => {
      const haystack = [
        String(member.memberId),
        member.memberName,
        member.memberType,
        member.phone || "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [members, memberQuery]);

  const defaultTitlePreview = useMemo(
    () => getDefaultTitlePreview(selectedMember?.memberName, form.type),
    [selectedMember, form.type],
  );

  const defaultMessagePreview = useMemo(
    () =>
      getDefaultMessagePreview(
        selectedMember?.memberName,
        form.type,
        form.eventReference,
      ),
    [selectedMember, form.type, form.eventReference],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await triggerNotificationEvent({
        userId: form.userId,
        type: form.type,
        title: form.title.trim() || null,
        message: form.message.trim() || null,
        eventReference: form.eventReference.trim() || null,
      });

      setLastResult(data);
      setForm((prev) => ({
        ...prev,
        title: "",
        message: "",
        eventReference: "",
      }));

      await loadPage();
      alert("자동 알림 이벤트가 DB에 저장되었습니다.");
    } catch (error) {
      console.error("자동 알림 생성 실패", error);
      alert("자동 알림 생성에 실패했습니다.");
    }
  };

  return (
    <section className="mypage-section-card admin-notification-page">
      <div className="notification-header admin-notification-hero">
        <div>
          <span className="admin-notification-badge">Notification Control</span>
          <h2>예약/결제/상담 자동 알림 관리</h2>
          <p className="notification-subtitle">
            회원을 검색해 선택한 뒤 예약, 결제, 상담 알림을 전송할 수 있습니다.
          </p>
        </div>
        <div className="admin-notification-hero-meta">
          <div className="admin-hero-stat">
            <span>대상 회원</span>
            <strong>{members.length}명</strong>
          </div>
          <div className="admin-hero-stat">
            <span>알림 이력</span>
            <strong>{selectedHistory.length}건</strong>
          </div>
        </div>
      </div>

      <div className="admin-search-layout">
        <div className="mypage-section-item admin-search-panel">
          <div className="admin-panel-head">
            <div>
              <h3>회원 검색</h3>
              <p>이름, 회원 번호, 휴대폰 번호로 빠르게 찾을 수 있습니다.</p>
            </div>
            <span className="admin-panel-count">{filteredMembers.length}명</span>
          </div>

          <input
            className="admin-member-search-input"
            value={memberQuery}
            onChange={(event) => setMemberQuery(event.target.value)}
            placeholder="회원 이름, 번호, 휴대폰 번호로 검색"
          />

          <div className="admin-member-list">
            {filteredMembers.map((member) => (
              <button
                key={member.memberId}
                type="button"
                className={`admin-member-list-item ${form.userId === member.memberId ? "active" : ""}`}
                onClick={() =>
                  setForm((prev) => ({ ...prev, userId: member.memberId }))
                }
              >
                <div className="admin-member-list-main">
                  <strong>{member.memberName}</strong>
                  <span>{member.phone || "휴대폰 없음"}</span>
                </div>
                <div className="admin-member-list-meta">
                  <span>#{member.memberId}</span>
                  <span>{member.memberType}</span>
                </div>
              </button>
            ))}
            {filteredMembers.length === 0 && (
              <div className="admin-member-empty">
                검색 조건에 맞는 회원이 없습니다.
              </div>
            )}
          </div>
        </div>

        {selectedMember && (
          <div className="mypage-section-item admin-selected-card">
            <div className="admin-selected-card-body">
              <span className="admin-status-label">선택된 회원</span>
              <div className="admin-selected-member-row">
                <strong>{selectedMember.memberName}</strong>
                <span>/</span>
                <strong>{selectedMember.memberType}</strong>
              </div>
              <div className="admin-selected-details">
                <p>회원 번호: {selectedMember.memberId}</p>
                <p>휴대폰: {selectedMember.phone || "없음"}</p>
                <p>안 읽은 포함 전체 이력: {selectedHistory.length}건</p>
              </div>
              <p>{selectedMember.demoScenario}</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mypage-section-list admin-form">
        <div className="mypage-section-item admin-form-card">
          <p>대상 회원</p>
          <select name="userId" value={form.userId} onChange={handleChange}>
            {members.map((member) => (
              <option key={member.memberId} value={member.memberId}>
                {member.memberId} - {member.memberName}
              </option>
            ))}
          </select>
        </div>

        <div className="mypage-section-item admin-form-card">
          <p>이벤트 유형</p>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="RESERVATION">예약</option>
            <option value="PAYMENT">결제</option>
            <option value="CONSULTATION">상담</option>
          </select>
        </div>

        <div className="mypage-section-item admin-form-card admin-form-card-wide">
          <p>알림 상세 내용</p>
          <input
            name="eventReference"
            value={form.eventReference}
            onChange={handleChange}
            placeholder="예: 2026-03-25 14:00 예약 확정"
          />
        </div>

        <div className="mypage-section-item admin-form-card admin-form-card-wide">
          <p>직접 입력할 제목(선택)</p>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={`비우면 자동 제목 사용: ${defaultTitlePreview}`}
          />
          <span className="admin-form-help">
            기본 제목: {defaultTitlePreview}
          </span>
        </div>

        <div className="mypage-section-item admin-form-card admin-form-card-wide">
          <p>직접 입력할 메시지(선택)</p>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            placeholder={`비우면 자동 메시지 사용: ${defaultMessagePreview}`}
          />
          <span className="admin-form-help admin-form-help-block">
            기본 메시지: {defaultMessagePreview}
          </span>
        </div>

        <div className="admin-form-actions">
          <button
            type="submit"
            className="notification-read-button admin-submit-button"
          >
            알림 전송하기
          </button>
        </div>
      </form>

      <div className="admin-status-grid">
        {lastResult && (
          <div className="mypage-section-item admin-status-card admin-result-card">
            <span className="admin-status-label">최근 처리 결과</span>
            <strong>
              [{TYPE_LABEL[lastResult.type]}] {lastResult.title}
            </strong>
            <p>{lastResult.message}</p>
            <p>최종 요약: {lastResult.deliverySummary}</p>
            <p>최종 채널: {lastResult.lastDeliveryChannel || "없음"}</p>
          </div>
        )}
      </div>

      <div className="admin-notification-history">
        <div className="admin-history-header">
          <div>
            <h3>선택 회원 알림 이력</h3>
            <p className="admin-history-count">{selectedHistory.length}건</p>
          </div>
        </div>

        <div className="mypage-section-list">
          {selectedHistory.map((item) => (
            <div key={item.id} className="mypage-section-item admin-history-card">
              <div className="admin-history-card-top">
                <strong>
                  [{TYPE_LABEL[item.type]}] {item.title}
                </strong>
                <span className="notification-channel">
                  {item.lastDeliveryChannel || "미발송"}
                </span>
              </div>
              <p>{item.message}</p>
              <div className="admin-history-meta">
                <span>요약: {item.deliverySummary}</span>
                <span>생성일: {item.createdAt.replace("T", " ")}</span>
              </div>
              <div className="admin-attempt-list">
                {item.attempts?.map((attempt) => (
                  <p
                    key={`${item.id}-${attempt.sequence}`}
                    className="admin-attempt-item"
                  >
                    {attempt.sequence}. {attempt.channel} / {attempt.status} /{" "}
                    {attempt.failureReason} / {attempt.detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
