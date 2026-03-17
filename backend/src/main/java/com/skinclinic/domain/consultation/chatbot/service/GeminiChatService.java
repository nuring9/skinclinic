package com.skinclinic.domain.consultation.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiChatService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GeminiChatService.class);
    // 로그 기록을 위한 객체 설정, 자바 표준 로깅 인터페이스

    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.0-flash}")
    private String model;

    public String enrich(String topic, String defaultAnswer) {
        if(apiKey == null || apiKey.isBlank()) {
            return defaultAnswer;
        }

        String prompt = """
                당신은 피부과 사이트의 버튼형 상담 챗봇입니다.
                아래 기본 답변을 바탕으로, 과장 없이 친절한 한국어 상담 답변으로 3문장 이내로 다시 작성하세요.

                상담 주제: %s
                기본 답변: %s

                조건:
                - 병원 확정 진단처럼 말하지 말 것
                - 피부과 사이트 상담 톤으로 답할 것
                - 필요하면 마지막 문장에 짧게 상담 권유 가능
                - 마크다운 없이 일반 문장으로만 답할 것
                """.formatted(topic, defaultAnswer);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.6,
                        "maxOutputTokens", 200
                )
        );

        try {
            RestClient restClient = RestClient.builder()
                    .baseUrl("https://generativelanguage.googleapis.com")
                    .build();

            String response = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent?key={apiKey}", model, apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text");

            if(textNode.isTextual() && !textNode.asText().isBlank()) {
                return textNode.asText().trim();
            }
        } catch (Exception e) {
            log.error("Gemini API Error", e); // 오류 로그 남기기
            return defaultAnswer;
        }

        return defaultAnswer;
    }
}
