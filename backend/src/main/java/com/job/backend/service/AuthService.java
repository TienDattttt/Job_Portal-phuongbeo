package com.job.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JdbcTemplate jdbcTemplate;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    // Đăng ký
    public Map<String, Object> register(String fullName, String email, String password, int roleId) {
        // Kiểm tra trùng email
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM [User] WHERE Email = ?", Integer.class, email);
        if (count != null && count > 0) {
            return Map.of("error", "Email đã được sử dụng");
        }

        // Mã hóa mật khẩu
        String encoded = passwordEncoder.encode(password);

        // Thêm user mới (Phone có thể để null hoặc truyền mặc định)
        String defaultPhone = "0000000000";
        jdbcTemplate.update("""
        INSERT INTO [User] (FullName, Email, PasswordHash, Phone, RoleID)
        VALUES (?, ?, ?, ?, ?)
    """, fullName, email, encoded, defaultPhone, roleId);

        // Sinh JWT
        String token = jwtService.generateToken(email, getRoleName(roleId));
        return Map.of("message", "Đăng ký thành công", "token", token);
    }


    // Đăng nhập
    public Map<String, Object> login(String email, String password) {
        try {
            Map<String, Object> user = jdbcTemplate.queryForMap(
                    "SELECT * FROM [User] WHERE Email = ?", email);

            if (!passwordEncoder.matches(password, (String) user.get("PasswordHash"))) {
                return Map.of("error", "Sai mật khẩu");
            }

            String token = jwtService.generateToken(
                    (String) user.get("Email"),
                    getRoleName((Integer) user.get("RoleID"))
            );

            return Map.of(
                    "message", "Đăng nhập thành công",
                    "token", token,
                    "user", Map.of(
                            "userId", user.get("UserID"),
                            "fullName", user.get("FullName"),
                            "roleId", user.get("RoleID")
                    )
            );
        } catch (Exception e) {
            return Map.of("error", "Không tìm thấy tài khoản với email này");
        }
    }

    private String getRoleName(int roleId) {
        return switch (roleId) {
            case 1 -> "ADMIN";
            case 2 -> "NTD";
            default -> "UNGVIEN";
        };
    }
}
