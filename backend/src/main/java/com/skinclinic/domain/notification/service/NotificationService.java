package com.skinclinic.domain.notification.service;

import com.skinclinic.domain.notification.dto.NotificationCreateRequest;
import com.skinclinic.domain.notification.dto.NotificationResponse;
import com.skinclinic.domain.notification.enumtype.NotificationType;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class NotificationService {

    private final List<NotificationResponse> notifications = new ArrayList<>();
    private long sequence = 1L;

    @PostConstruct
    void initDummyData() {
        notifications.add(new NotificationResponse(
                sequence++,
                1L,
                NotificationType.RESERVATION,
                "예약 완료",
                "3월 25일 14:00 예약이 확정되었습니다.",
                false,
                true,
                false,
                LocalDateTime.of(2026, 3, 19, 9, 0)
        ));

        notifications.add(new NotificationResponse(
                sequence++,
                1L,
                NotificationType.PAYMENT,
                "결제 완료",
                "LDM 물방울 리프팅 결제가 완료되었습니다.",
                false,
                true,
                false,
                LocalDateTime.of(2026, 3, 19, 10, 12)
        ));

        notifications.add(new NotificationResponse(
                sequence++,
                1L,
                NotificationType.CONSULTATION,
                "상담 답변 도착",
                "문의하신 내용에 관리자 답변이 등록되었습니다.",
                true,
                false,
                false,
                LocalDateTime.of(2026, 3, 18, 16, 20)
        ));
    }

    public List<NotificationResponse> getUserNotifications(Long userId, NotificationType type){
        return notifications.stream()
                .filter(item -> item.userId().equals(userId))
                .filter(item -> type == null || item.type() == type)
                .sorted(Comparator.comparing(NotificationResponse::createdAt).reversed())
                .toList();
    }

    public long getUnreadCount(Long userId){
        return notifications.stream()
                .filter(item -> item.userId().equals(userId))
                .filter(item -> item.read())
                .count();
    }

    public NotificationResponse createNotification(NotificationCreateRequest request) {
        NotificationResponse newNotification = new NotificationResponse(
                sequence++,
                request.userId(),
                request.type(),
                request.title(),
                request.message(),
                false,
                request.kakaoShareAvailable(),
                false,
                LocalDateTime.now()
        );

        notifications.add(newNotification);
        return newNotification;
    }

    public NotificationResponse markAsRead(Long notificationId){
        return updateNotification(notificationId, true, null);
    }

    public NotificationResponse markKakaoSent(Long notificationId){
        return  updateNotification(notificationId, null, true);
    }

    public List<NotificationResponse> getAllNotifications(NotificationType type) {
        return notifications.stream()
                .filter(item -> type == null || item.type() == type)
                .sorted(Comparator.comparing(NotificationResponse::createdAt).reversed())
                .toList();
    }

    private NotificationResponse updateNotification(Long notificationId, Boolean read, Boolean kakaoSent) {
        for (int i = 0; i < notifications.size(); i++) {
            NotificationResponse current = notifications.get(i);

            if (current.id().equals(notificationId)) {
                NotificationResponse updated = new NotificationResponse(
                        current.id(),
                        current.userId(),
                        current.type(),
                        current.title(),
                        current.message(),
                        read != null ? read : current.read(),
                        current.kakaoShareAvailable(),
                        kakaoSent != null ? kakaoSent : current.kakaoSent(),
                        current.createdAt()
                );
                notifications.set(i, updated);
                return updated;
            }
        }

        throw new IllegalArgumentException("해당 알림을 찾을 수 없습니다. id=" + notificationId);
    }
}
