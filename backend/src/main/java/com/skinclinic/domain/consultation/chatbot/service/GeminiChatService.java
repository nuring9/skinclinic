package com.skinclinic.domain.consultation.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiChatService {

    private static final Logger log = LoggerFactory.getLogger(GeminiChatService.class);

    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.base-url}")
    private String baseUrl;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    public GeminiResult enrich(String topic, String defaultAnswer) {

        if (apiKey == null || apiKey.isBlank()) {
            return new GeminiResult(defaultAnswer, false);
        }

        String prompt = """
        당신은 피부과 사이트의 버튼형 상담 챗봇입니다.
        아래 기본 답변을 자연스럽고 친절한 한국어로 2~3문장으로 다시 작성하세요.

        상담 주제: %s
        기본 답변: %s

        조건:
        - 병원 확정 진단처럼 말하지 말 것
        - 기본 답변을 그대로 복사하지 말 것
        - 마크다운 없이 일반 문장으로만 답할 것
        """.formatted(topic, defaultAnswer);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 512,
                        "thinkingConfig", Map.of(
                                "thinkingBudget", 0
                        )
                )
        );


        try {
            RestClient restClient = RestClient.builder()
                    .baseUrl(baseUrl)
                    .build();

            String response = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent?key={apiKey}", model, apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode textNode = root.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (textNode.isTextual()) {
                String aiAnswer = textNode.asText().trim();
                if (!aiAnswer.isBlank()) {
                    return new GeminiResult(aiAnswer, true);
                }
            }
        } catch (Exception e) {
            log.error("Gemini API Error", e);
        }

        return new GeminiResult(defaultAnswer, false);
    }

    public record GeminiResult(String answer, boolean enhanced) {
    }
}