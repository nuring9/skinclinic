package com.skinclinic.domain.notification.dto;

import com.skinclinic.domain.notification.enumtype.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationCreateRequest(
        @NotNull Long userId,
        @NotNull NotificationType type,
        @NotBlank String title,
        @NotBlank String message,
        boolean kakaoShareAvailable
) {
}