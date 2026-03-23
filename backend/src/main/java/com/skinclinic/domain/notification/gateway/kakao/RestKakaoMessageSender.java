package com.skinclinic.domain.notification.gateway.kakao;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skinclinic.domain.notification.enumtype.FailureReason;
import com.skinclinic.domain.notification.gateway.KakaoMessageSender;
import com.skinclinic.domain.notification.port.NotificationMemberInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@Component
@ConditionalOnProperty(value = "notification.kakao.provider", havingValue = "rest")
public class RestKakaoMessageSender implements KakaoMessageSender {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String webUrl;
    private final String mobileWebUrl;
    private final String buttonTitle;

    public RestKakaoMessageSender(
            ObjectMapper objectMapper,
            @Value("${notification.kakao.message-api-base-url:https://kapi.kakao.com}") String baseUrl,
            @Value("${notification.kakao.web-url:http://localhost:5173/mypage/notifications}") String webUrl,
            @Value("${notification.kakao.mobile-web-url:http://localhost:5173/mypage/notifications}") String mobileWebUrl,
            @Value("${notification.kakao.button-title:알림 확인하기}") String buttonTitle
    ) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
        this.webUrl = webUrl;
        this.mobileWebUrl = mobileWebUrl;
        this.buttonTitle = buttonTitle;
    }

    @Override
    public KakaoSendResult sendToMe(NotificationMemberInfo memberInfo, String title, String message) {
        if (!memberInfo.kakaoLogin()) {
            return new KakaoSendResult(false, FailureReason.AUTH_ERROR, "카카오 로그인이 필요합니다.");
        }

        if (!memberInfo.talkMessageAgreed()) {
            return new KakaoSendResult(false, FailureReason.TALK_MESSAGE_NOT_ALLOWED, "talk_message 동의가 필요합니다.");
        }

        if (!memberInfo.hasAccessToken()) {
            return new KakaoSendResult(false, FailureReason.AUTH_ERROR, "access token 이 없습니다.");
        }

        if (memberInfo.isAccessTokenExpired()) {
            return new KakaoSendResult(false, FailureReason.TOKEN_EXPIRED, "access token 이 만료되었습니다.");
        }

        try {
            LinkedMultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("template_object", buildTemplateObject(title, message));

            Map<?, ?> response = restClient.post()
                    .uri("/v2/api/talk/memo/default/send")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .header("Authorization", "Bearer " + memberInfo.accessToken())
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            Object resultCode = response == null ? null : response.get("result_code");
            if (resultCode instanceof Number number && number.intValue() == 0) {
                return new KakaoSendResult(true, FailureReason.NONE, "카카오 나에게 메시지 전송 성공");
            }

            return new KakaoSendResult(false, FailureReason.UNKNOWN, "카카오 메시지 응답이 올바르지 않습니다.");
        } catch (RestClientResponseException exception) {
            return new KakaoSendResult(false, mapFailureReason(exception), "카카오 메시지 발송 실패: " + exception.getResponseBodyAsString());
        } catch (Exception exception) {
            return new KakaoSendResult(false, FailureReason.UNKNOWN, "카카오 메시지 발송 예외: " + exception.getMessage());
        }
    }

    private String buildTemplateObject(String title, String message) throws JsonProcessingException {
        Map<String, Object> template = Map.of(
                "object_type", "text",
                "text", "[" + title + "]\n" + message,
                "link", Map.of(
                        "web_url", webUrl,
                        "mobile_web_url", mobileWebUrl
                ),
                "button_title", buttonTitle
        );

        return objectMapper.writeValueAsString(template);
    }

    private FailureReason mapFailureReason(RestClientResponseException exception) {
        if (exception.getStatusCode().value() == 401) {
            return FailureReason.AUTH_ERROR;
        }
        if (exception.getStatusCode().value() == 403) {
            return FailureReason.TALK_MESSAGE_NOT_ALLOWED;
        }
        return FailureReason.UNKNOWN;
    }
}
