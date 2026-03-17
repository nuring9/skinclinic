package com.skinclinic.domain.consultation.chatbot.controller;

import com.skinclinic.domain.consultation.chatbot.dto.ChatbotMessageRequest;
import com.skinclinic.domain.consultation.chatbot.dto.ChatbotResponse;
import com.skinclinic.domain.consultation.chatbot.service.ChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @GetMapping("/welcome")
    public ResponseEntity<ChatbotResponse> getWelcome() {
         return ResponseEntity.ok(chatbotService.getWelcome());
    }

    @PostMapping("/messages")
    public ResponseEntity<ChatbotResponse> sendMessage(@Valid @RequestBody ChatbotMessageRequest request) {
        return ResponseEntity.ok(chatbotService.reply(request.getOptionCode()));
    }
}
