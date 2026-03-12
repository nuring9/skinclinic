package com.skinclinic.domain.skin.survey.controller;

import com.skinclinic.domain.skin.survey.dto.SkinSurveyRequest;
import com.skinclinic.domain.skin.survey.dto.SkinSurveyResponse;
import com.skinclinic.domain.skin.survey.service.SkinSurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skin-surveys")  //      /api/skin-surveys 공통주소
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
// CrossOrigin 보안 정책인 CORS 문제를 해결, 프론트 서버가 기본 5173 포트
public class SkinSurveyController {
    private final SkinSurveyService skinSurveyService;

    @PostMapping  // 공통주소에 대한 POST 요청
    public ResponseEntity<SkinSurveyResponse> createSkinSurvey(@RequestBody SkinSurveyRequest request){

        SkinSurveyResponse response = skinSurveyService.createSkinSurvey(request);
        // 1. 서비스 호출: DTO를 넘겨 비즈니스 로직 수행

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
        // 2. HTTP 상태코드 201(Created)과 함께 결과 DTO 반환
    }
}
