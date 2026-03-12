package com.skinclinic.domain.skin.survey.repository;

import com.skinclinic.domain.skin.survey.entity.SkinSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkinSurveyRepository extends JpaRepository<SkinSurvey, Long> {
}
