import api from "./apiClient";

export const getUserNotifications = async (userId, type = "ALL") => {
  const response = await api.get(`/api/notifications/users/${userId}`, {
    params: type === "ALL" ? {} : { type },
  });
  return response.data;
};

export const getUnreadNotificationCount = async (userId) => {
  const response = await api.get(
    `/api/notifications/users/${userId}/unread-count`,
  );
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(`/api/notifications/${notificationId}/read`); // 데이터의 일부분만 수정할 때 patch
  return response.data;
};

export const markNotificationAsKakaoSent = async (notificationId) => {
  const response = await api.patch(
    `/api/notifications/${notificationId}/kakao-sent`, // 글자 수가 길어서 쉼표가 생김.
  );
  return response.data;
};

export const getAllNotifications = async (type = "ALL") => {
  const response = await api.get("/api/admin/notifications", {
    params: type === "ALL" ? {} : { type },
  });
  return response.data;
};

export const createNotification = async (payload) => {
  const response = await api.post("/api/admin/notifications", payload);
  return response.data;
};
