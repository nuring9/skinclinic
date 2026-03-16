package com.skinclinic.domain.skin.survey.repository;

import com.skinclinic.domain.skin.survey.entity.SkinSurvey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkinSurveyRepository extends JpaRepository<SkinSurvey, Long> {

    // 어차피 비워져 있어도 JpaRepository의 기능을 사용할 수 있어서 비워져 있음..
    // save(entity): 데이터 저장 및 수정, findById(id): ID로 데이터 한 건 찾기, findAll(): 모든 데이터 목록 가져오기,
    // delete(entity): 데이터 삭제, count(): 전체 개수 세기  가능.
}
