package com.skinclinic.domain.member.service;

import com.skinclinic.domain.member.entity.Member;
import com.skinclinic.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MemberKakaoAuthService {

    private final MemberRepository memberRepository;

    @Transactional
    public void syncKakaoAuthorizedClient(Long memberId, OAuth2AuthorizedClient authorizedClient) {
        if (memberId == null || authorizedClient == null) {
            return;
        }

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));

        String accessToken = authorizedClient.getAccessToken() == null
                ? null
                : authorizedClient.getAccessToken().getTokenValue();
        LocalDateTime expiresAt = authorizedClient.getAccessToken() == null
                || authorizedClient.getAccessToken().getExpiresAt() == null
                ? null
                : LocalDateTime.ofInstant(
                        authorizedClient.getAccessToken().getExpiresAt(),
                        ZoneId.systemDefault()
                );
        String refreshToken = authorizedClient.getRefreshToken() == null
                ? null
                : authorizedClient.getRefreshToken().getTokenValue();
        Set<String> scopes = authorizedClient.getAccessToken() == null
                ? Set.of()
                : authorizedClient.getAccessToken().getScopes();

        member.updateKakaoNotificationAuth(
                accessToken,
                refreshToken,
                expiresAt,
                scopes.contains("talk_message")
        );
    }
}
