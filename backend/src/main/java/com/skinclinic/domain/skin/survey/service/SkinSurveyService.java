package com.skinclinic.domain.skin.survey.service;

import com.skinclinic.domain.skin.survey.dto.SkinSurveyRequest;
import com.skinclinic.domain.skin.survey.dto.SkinSurveyResponse;
import com.skinclinic.domain.skin.survey.entity.SkinSurvey;
import com.skinclinic.domain.skin.survey.repository.SkinSurveyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
@Transactional
public class SkinSurveyService {
    private final SkinSurveyRepository skinSurveyRepository;

    public SkinSurveyResponse createSkinSurvey(SkinSurveyRequest request){
        SkinSurvey skinSurvey = SkinSurvey.builder()
                .skinType(request.getSkinType())
                .concerns(request.getConcerns() != null ? request.getConcerns() : new HashSet<>())
                .build();

        SkinSurvey savedSkinSurvey = skinSurveyRepository.save(skinSurvey);

        return SkinSurveyResponse.from(savedSkinSurvey);
    }

}
