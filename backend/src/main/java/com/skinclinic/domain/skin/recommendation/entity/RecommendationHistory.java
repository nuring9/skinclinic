package com.skinclinic.domain.skin.recommendation.entity;

import com.skinclinic.domain.skin.survey.entity.SkinSurvey;
import com.skinclinic.domain.skin.survey.enumtype.SkinConcern;
import com.skinclinic.domain.skin.survey.enumtype.SkinType;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "recommendation_history")
@Getter
public class RecommendationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skin_survey_id", nullable = false)
    private SkinSurvey survey;

    @Enumerated(EnumType.STRING)
    @Column(name = "skin_type", nullable = false, length = 30)
    private SkinType skinType;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "recommendation_history_concern",
            joinColumns = @JoinColumn(name = "recommendation_history_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "concern", nullable = false, length = 30)
    private Set<SkinConcern> concerns = new LinkedHashSet<>();

    @OneToMany(mappedBy = "history", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("score DESC, id ASC")
    private List<RecommendationProcedure> procedures = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false) // 생성 후 변경 불가
    private LocalDateTime createdAt;

    // 핵심 포인트 2: 생성자 대신 빌더 패턴 사용 (선택 사항이지만 추천)
    @Builder
    public RecommendationHistory(SkinSurvey survey, SkinType skinType, Set<SkinConcern> concerns) {
        this.survey = survey;
        this.skinType = skinType;
        this.concerns = concerns != null ? concerns : new LinkedHashSet<>();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 핵심 포인트 3: 연관관계 편의 메서드 (기존 로직 유지)
    public void addProcedure(RecommendationProcedure procedure) {
        this.procedures.add(procedure);
        procedure.assignHistory(this);
    }
}
