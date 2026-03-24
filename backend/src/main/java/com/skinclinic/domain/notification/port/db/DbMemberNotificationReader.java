package com.skinclinic.domain.notification.port.db;

import com.skinclinic.domain.member.entity.Member;
import com.skinclinic.domain.member.entity.SocialProvider;
import com.skinclinic.domain.member.repository.MemberRepository;
import com.skinclinic.domain.notification.enumtype.MemberType;
import com.skinclinic.domain.notification.port.MemberNotificationReader;
import com.skinclinic.domain.notification.port.NotificationMemberInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Primary
@Component
@RequiredArgsConstructor
public class DbMemberNotificationReader implements MemberNotificationReader {

    private final MemberRepository memberRepository;

    @Override
    public Optional<NotificationMemberInfo> findByMemberId(Long memberId) {
        return memberRepository.findById(memberId)
                .filter(member -> !member.isDeleted())
                .map(this::toNotificationMemberInfo);
    }

    @Override
    public List<NotificationMemberInfo> findAll() {
        return memberRepository.findAll().stream()
                .filter(member -> !member.isDeleted())
                .map(this::toNotificationMemberInfo)
                .toList();
    }

    private NotificationMemberInfo toNotificationMemberInfo(Member member) {
        boolean isKakaoMember = member.getSocialProvider() == SocialProvider.KAKAO;

        return new NotificationMemberInfo(
                member.getId(),
                member.getName(),
                member.getPhone(),
                isKakaoMember ? MemberType.KAKAO : MemberType.GENERAL,
                isKakaoMember,
                member.isKakaoTalkMessageAgreed(),
                member.getKakaoAccessToken(),
                member.getKakaoRefreshToken(),
                member.getKakaoAccessTokenExpiresAt(),
                isKakaoMember
                        ? "실회원: 카카오 메시지 자동 발송 대상"
                        : "실회원: SMS 자동 발송 대상"
        );
    }
}
