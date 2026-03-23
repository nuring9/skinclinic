package com.skinclinic.domain.procedure.review.service;

import com.skinclinic.domain.procedure.review.dto.AdminProcedureReviewItemResponse;
import com.skinclinic.domain.procedure.review.dto.ProcedureReviewCandidateResponse;
import com.skinclinic.domain.procedure.review.dto.ProcedureReviewCreateRequest;
import com.skinclinic.domain.procedure.review.dto.ProcedureReviewResponse;
import com.skinclinic.domain.procedure.review.dto.ProcedureReviewStatItemResponse;
import com.skinclinic.domain.procedure.review.dto.ProcedureSatisfactionStatsResponse;
import com.skinclinic.domain.procedure.review.entity.ProcedureRecord;
import com.skinclinic.domain.procedure.review.entity.ProcedureReview;
import com.skinclinic.domain.procedure.review.repository.ProcedureRecordRepository;
import com.skinclinic.domain.procedure.review.repository.ProcedureReviewMemberRepository;
import com.skinclinic.domain.procedure.review.repository.ProcedureReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProcedureReviewService {

    private final ProcedureRecordRepository procedureRecordRepository;
    private final ProcedureReviewMemberRepository procedureReviewMemberRepository;
    private final ProcedureReviewRepository procedureReviewRepository;

    public List<ProcedureReviewCandidateResponse> getReviewCandidates(Long userId) {
        validateUserExists(userId);

        return procedureRecordRepository.findByUserIdAndCompletedTrueOrderByTreatedAtDesc(userId).stream()
                .map(candidate -> new ProcedureReviewCandidateResponse(
                        candidate.getId(),
                        candidate.getUserId(),
                        candidate.getProcedureType().name(),
                        candidate.getProcedureName(),
                        candidate.getTreatedAt(),
                        procedureReviewRepository.existsByProcedureRecordId(candidate.getId())
                ))
                .toList();
    }

    public List<ProcedureReviewResponse> getUserReviews(Long userId) {
        validateUserExists(userId);

        return procedureReviewRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ProcedureReview::toResponse)
                .toList();
    }

    public List<AdminProcedureReviewItemResponse> getAdminReviews() {
        return procedureReviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(review -> new AdminProcedureReviewItemResponse(
                        review.getId(),
                        review.getUserId(),
                        procedureReviewMemberRepository.findById(review.getUserId())
                                .map(member -> member.getName())
                                .orElse("알 수 없는 회원"),
                        review.getProcedureRecordId(),
                        review.getProcedureType().name(),
                        review.getProcedureName(),
                        review.getTreatedAt(),
                        review.getRating(),
                        review.getShortComment(),
                        review.getEffectSatisfaction(),
                        review.getPriceSatisfaction(),
                        review.getConsultationSatisfaction(),
                        review.getRevisitIntention(),
                        review.getCreatedAt()
                ))
                .toList();
    }

    public ProcedureReviewResponse createReview(ProcedureReviewCreateRequest request) {
        validateUserExists(request.userId());

        ProcedureRecord procedureRecord = procedureRecordRepository.findById(request.procedureRecordId())
                .orElseThrow(() -> new IllegalArgumentException("해당 시술 기록을 찾을 수 없습니다. procedureRecordId=" + request.procedureRecordId()));

        if (!procedureRecord.getUserId().equals(request.userId())) {
            throw new IllegalArgumentException("본인 시술 기록에만 만족도 평가를 등록할 수 있습니다.");
        }

        if (!procedureRecord.isCompleted()) {
            throw new IllegalArgumentException("완료된 시술에만 만족도 평가를 등록할 수 있습니다.");
        }

        if (procedureReviewRepository.existsByProcedureRecordId(request.procedureRecordId())) {
            throw new IllegalArgumentException("이미 만족도 평가가 등록된 시술 기록입니다.");
        }

        ProcedureReview saved = procedureReviewRepository.save(new ProcedureReview(
                request.userId(),
                request.procedureRecordId(),
                procedureRecord.getProcedureType(),
                procedureRecord.getProcedureName(),
                procedureRecord.getTreatedAt(),
                request.rating(),
                request.shortComment(),
                request.effectSatisfaction(),
                request.priceSatisfaction(),
                request.consultationSatisfaction(),
                request.revisitIntention()
        ));

        return saved.toResponse();
    }

    public ProcedureSatisfactionStatsResponse getStatistics() {
        List<ProcedureReview> reviews = procedureReviewRepository.findAll();

        List<ProcedureReviewStatItemResponse> stats = reviews.stream()
                .collect(Collectors.groupingBy(ProcedureReview::getProcedureType))
                .entrySet()
                .stream()
                .map(entry -> {
                    List<ProcedureReview> grouped = entry.getValue();

                    return new ProcedureReviewStatItemResponse(
                            entry.getKey().name(),
                            entry.getKey().getLabel(),
                            grouped.size(),
                            round(average(grouped.stream().map(ProcedureReview::getRating).toList())),
                            round(average(grouped.stream().map(ProcedureReview::getEffectSatisfaction).toList())),
                            round(average(grouped.stream().map(ProcedureReview::getPriceSatisfaction).toList())),
                            round(average(grouped.stream().map(ProcedureReview::getConsultationSatisfaction).toList())),
                            round(average(grouped.stream().map(ProcedureReview::getRevisitIntention).toList()))
                    );
                })
                .sorted(Comparator.comparing(ProcedureReviewStatItemResponse::averageRating).reversed())
                .toList();

        ProcedureReviewStatItemResponse highest = stats.stream()
                .max(Comparator.comparing(ProcedureReviewStatItemResponse::averageRating))
                .orElse(null);

        ProcedureReviewStatItemResponse lowest = stats.stream()
                .min(Comparator.comparing(ProcedureReviewStatItemResponse::averageRating))
                .orElse(null);

        return new ProcedureSatisfactionStatsResponse(
                LocalDateTime.now(),
                reviews.size(),
                highest,
                lowest,
                stats
        );
    }

    private double average(List<Integer> values) {
        DoubleSummaryStatistics statistics = values.stream()
                .filter(Objects::nonNull)
                .mapToDouble(Integer::doubleValue)
                .summaryStatistics();

        return statistics.getCount() == 0 ? 0.0 : statistics.getAverage();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private void validateUserExists(Long userId) {
        if (!procedureReviewMemberRepository.existsById(userId)) {
            throw new IllegalArgumentException("해당 회원을 찾을 수 없습니다. userId=" + userId);
        }
    }
}
