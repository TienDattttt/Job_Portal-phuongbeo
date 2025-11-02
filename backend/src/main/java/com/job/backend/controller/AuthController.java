package com.job.backend.controller;

import com.job.backend.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    // Đăng ký
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {
        return service.register(req.getFullName(), req.getEmail(), req.getPassword(), req.getRoleId());
    }

    // Đăng nhập
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        return service.login(req.getEmail(), req.getPassword());
    }

    @Data
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private int roleId; // 1=ADMIN, 2=NTD, 3=UNGVIEN
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}
