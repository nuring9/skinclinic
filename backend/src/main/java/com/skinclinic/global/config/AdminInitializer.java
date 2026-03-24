package com.skinclinic.global.config;

import com.skinclinic.domain.member.entity.Member;
import com.skinclinic.domain.member.entity.Role;
import com.skinclinic.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (memberRepository.findFirstByRole(Role.ADMIN).isPresent()) {
            System.out.println("기존 관리자 계정이 있어 AdminInitializer를 건너뜁니다.");
            return;
        }

        Member loginIdOneMember = memberRepository.findByLoginId("1").orElse(null);
        if (loginIdOneMember != null) {
            loginIdOneMember.changeRole(Role.ADMIN);
            System.out.println("기존 loginId=1 계정을 관리자로 승격했습니다.");
            return;
        }

        if (memberRepository.existsByEmail("admin@skinclinic.com")) {
            System.out.println("admin@skinclinic.com 이메일을 사용하는 계정이 이미 있어 관리자 자동 생성을 건너뜁니다.");
            return;
        }

        Member admin = Member.builder()
                .loginId("1")
                .name("관리자")
                .email("admin@skinclinic.com")
                .password(passwordEncoder.encode("1"))
                .phone("01000000000")
                .role(Role.ADMIN)
                .build();

        memberRepository.save(admin);
        System.out.println("관리자 계정 생성 완료: 1 / 1");
    }
}
