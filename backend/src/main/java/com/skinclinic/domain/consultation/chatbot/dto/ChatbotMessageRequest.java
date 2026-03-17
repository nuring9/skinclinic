package com.skinclinic.domain.consultation.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class ChatbotMessageRequest {
    @NotBlank // 공백이면 안된다. 잘못된 요청을 보냈을때 빈 값으로 로직이 돌지 않게 막아줌.
    private String optionCode;  // 사용자가 누른 버튼의 코드 값.
}
