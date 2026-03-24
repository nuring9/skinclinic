package com.skinclinic.global.auth.controller;

import com.skinclinic.global.auth.CustomUserDetails;
import com.skinclinic.global.auth.dto.AuthCheckResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class AuthController {

    @GetMapping("/api/auth/me")
    public ResponseEntity<?> me(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인되지 않은 사용자입니다.");
        }

        String loginId = authentication.getName();
        Long memberId = null;
        String name = null;

        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            memberId = userDetails.getMember().getId();
            name = userDetails.getMember().getName();
        }

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(authority -> authority.getAuthority())
                .orElse("ROLE_USER");

        AuthCheckResponse response = AuthCheckResponse.builder()
                .authenticated(true)
                .id(memberId)
                .loginId(loginId)
                .name(name)
                .role(role)
                .build();

        return ResponseEntity.ok(response);
    }
}
