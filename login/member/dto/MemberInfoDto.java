package com.skinclinic.domain.member.dto;

import com.skinclinic.domain.member.entity.Member;
import lombok.Builder;
import lombok.Getter;

@Getter
public class MemberInfoDto {

    private final String loginId;
    private final String name;
    private final String email;
    private final String phone;
    private final boolean socialLogin;
    private final String socialProvider;

    @Builder
    public MemberInfoDto(String loginId, String name, String email, String phone,
                         boolean socialLogin, String socialProvider) {
        this.loginId = loginId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.socialLogin = socialLogin;
        this.socialProvider = socialProvider;
    }

    public static MemberInfoDto from(Member member) {
        return MemberInfoDto.builder()
                .loginId(member.getLoginId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .socialLogin(member.getSocialProvider() != null)
                .socialProvider(member.getSocialProvider() == null ? null : member.getSocialProvider().name())
                .build();
    }
}
