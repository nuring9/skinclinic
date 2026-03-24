package com.skinclinic.domain.notification.service;

import com.skinclinic.domain.notification.dto.NotificationEventTriggerRequest;
import com.skinclinic.domain.notification.dto.NotificationResponse;
import com.skinclinic.domain.notification.dto.ReservationNotificationCommand;
import com.skinclinic.domain.notification.enumtype.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationNotificationService {

    private final NotificationService notificationService;

    public NotificationResponse notifyReservationCompleted(ReservationNotificationCommand command) {
        String reservationReference = hasText(command.reservationReference())
                ? command.reservationReference()
                : "예약 완료";

        return notificationService.triggerNotificationEvent(
                new NotificationEventTriggerRequest(
                        command.memberId(),
                        NotificationType.RESERVATION,
                        hasText(command.title()) ? command.title() : null,
                        hasText(command.message()) ? command.message() : null,
                        reservationReference
                )
        );
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
