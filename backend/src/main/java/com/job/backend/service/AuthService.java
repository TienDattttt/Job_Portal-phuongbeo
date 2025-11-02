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

    // ---------------------------
    // 🟢 Đăng ký tài khoản mới
    // ---------------------------
    public Map<String, Object> register(String fullName, String email, String password, int roleId) {
        // 1️⃣ Kiểm tra trùng email
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM [User] WHERE Email = ?", Integer.class, email);
        if (count != null && count > 0) {
            return Map.of("error", "Email đã được sử dụng");
        }

        // 2️⃣ Mã hóa mật khẩu
        String encoded = passwordEncoder.encode(password);

        // 3️⃣ Thêm user mới
        String defaultPhone = "0000000000";
        jdbcTemplate.update("""
            INSERT INTO [User] (FullName, Email, PasswordHash, Phone, RoleID)
            VALUES (?, ?, ?, ?, ?)
        """, fullName, email, encoded, defaultPhone, roleId);

        // 4️⃣ Lấy ID user vừa thêm
        Integer userId = jdbcTemplate.queryForObject(
                "SELECT TOP 1 UserID FROM [User] WHERE Email = ? ORDER BY UserID DESC",
                Integer.class, email);

        // 5️⃣ Nếu là ỨNG VIÊN → tự động tạo hồ sơ rỗng
        if (roleId == 3) {
            Integer exist = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM UngVien WHERE UserID = ?",
                    Integer.class, userId);

            if (exist == null || exist == 0) {
                jdbcTemplate.update("""
                    INSERT INTO UngVien (UserID, NgaySinh, DiaChi, GioiTinh, HocVan, KyNang, KinhNghiem, CvLink, MoTaBanThan)
                    VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
                """, userId);
            }
        }

        // ✅ 6️⃣ Lấy RoleName thật từ DB để ghi vào token (VD: "NTD")
        String roleName = jdbcTemplate.queryForObject(
                "SELECT RoleName FROM [Role] WHERE RoleID = ?",
                String.class, roleId
        );

        // ✅ 7️⃣ Tạo token JWT chứa role và userId
        String token = jwtService.generateToken(email, roleName, userId);

        // 8️⃣ Trả về response
        return Map.of(
                "message", "Đăng ký thành công",
                "token", token,
                "user", Map.of(
                        "userId", userId,
                        "fullName", fullName,
                        "roleId", roleId
                )
        );
    }

    // ---------------------------
    // 🔵 Đăng nhập
    // ---------------------------
    public Map<String, Object> login(String email, String password) {
        try {
            Map<String, Object> user = jdbcTemplate.queryForMap(
                    "SELECT * FROM [User] WHERE Email = ?", email);

            if (!passwordEncoder.matches(password, (String) user.get("PasswordHash"))) {
                return Map.of("error", "Sai mật khẩu");
            }

            // ✅ Lấy RoleName thật từ DB
            String roleName = jdbcTemplate.queryForObject(
                    "SELECT RoleName FROM [Role] WHERE RoleID = ?",
                    String.class, user.get("RoleID")
            );

            // ✅ Sinh token chứa roleName + userId
            String token = jwtService.generateToken(
                    (String) user.get("Email"),
                    roleName,
                    ((Number) user.get("UserID")).intValue()
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
}
