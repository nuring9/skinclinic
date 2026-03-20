package com.skinclinic.domain.skin.survey.service;

import com.skinclinic.domain.skin.survey.dto.SkinSurveyRequest;
import com.skinclinic.domain.skin.survey.dto.SkinSurveyResponse;
import com.skinclinic.domain.skin.survey.entity.SkinSurvey;
import com.skinclinic.domain.skin.survey.repository.SkinSurveyRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;

@Service
@RequiredArgsConstructor
@Transactional
public class SkinSurveyService {
    private final SkinSurveyRepository skinSurveyRepository;

    public SkinSurveyResponse createSkinSurvey(SkinSurveyRequest request) {
        SkinSurvey skinSurvey = SkinSurvey.builder()
                .skinType(request.getSkinType())
                .concerns(request.getConcerns() != null ? request.getConcerns() : new HashSet<>())
                .skinAreas(request.getSkinAreas() != null ? request.getSkinAreas() : new LinkedHashSet<>())
                .questionAnswers(request.getQuestionAnswers() != null ? request.getQuestionAnswers() : new LinkedHashMap<>())
                .build();

        SkinSurvey savedSkinSurvey = skinSurveyRepository.save(skinSurvey);
        return SkinSurveyResponse.from(savedSkinSurvey);
    }

    public SkinSurveyResponse getSkinSurvey(Long id) {
        SkinSurvey skinSurvey = skinSurveyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 설문 결과를 찾을 수 없습니다. id" + id));

        return SkinSurveyResponse.from(skinSurvey);
    }

}
