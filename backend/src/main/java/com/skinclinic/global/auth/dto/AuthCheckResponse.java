package com.skinclinic.global.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthCheckResponse {
    private boolean authenticated;
    private Long id;
    private String loginId;
    private String name;
    private String role;
}
