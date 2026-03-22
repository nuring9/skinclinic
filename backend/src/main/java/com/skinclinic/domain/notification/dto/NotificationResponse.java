package com.skinclinic.domain.notification.dto;

import com.skinclinic.domain.notification.enumtype.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
   Long id,
   Long userId,
   NotificationType type,
   String title,
   String message,
   boolean read,
   boolean kakaoShareAvailable,
   boolean kakaoSent,
   LocalDateTime createdAt
) {
}
