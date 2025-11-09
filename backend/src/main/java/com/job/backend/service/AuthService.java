package com.job.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
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
        try {
            // 1️⃣ Kiểm tra trùng email
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM [User] WHERE Email = ?", Integer.class, email);
            if (count != null && count > 0) {
                return Map.of(
                        "success", false,
                        "errorCode", "EMAIL_EXISTS",
                        "error", "Email đã tồn tại trong hệ thống"
                );
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
                jdbcTemplate.update("""
                    INSERT INTO UngVien (UserID, NgaySinh, DiaChi, GioiTinh, HocVan, KyNang, KinhNghiem, CVLink, MoTaBanThan)
                    VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
                """, userId);
            }

            // ✅ 6️⃣ Lấy RoleName thật từ DB để ghi vào token (VD: "NTD")
            String roleName = jdbcTemplate.queryForObject(
                    "SELECT RoleName FROM [Role] WHERE RoleID = ?",
                    String.class, roleId
            );

            // ✅ 7️⃣ Tạo token JWT chứa role và userId
            String token = jwtService.generateToken(email, roleName, userId);

            // ✅ 8️⃣ Trả về response
            return Map.of(
                    "success", true,
                    "message", "Đăng ký thành công",
                    "token", token,
                    "user", Map.of(
                            "userId", userId,
                            "fullName", fullName,
                            "roleId", roleId
                    )
            );
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "errorCode", "REGISTER_FAILED",
                    "error", "Đăng ký thất bại. Vui lòng thử lại sau."
            );
        }
    }

    // ---------------------------
    // 🔵 Đăng nhập
    // ---------------------------
    public Map<String, Object> login(String email, String password) {
        try {
            Map<String, Object> user = jdbcTemplate.queryForMap(
                    "SELECT * FROM [User] WHERE Email = ?", email);

            // Nếu sai mật khẩu
            if (!passwordEncoder.matches(password, (String) user.get("PasswordHash"))) {
                return Map.of(
                        "success", false,
                        "errorCode", "WRONG_PASSWORD",
                        "error", "Mật khẩu không chính xác"
                );
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
                    "success", true,
                    "message", "Đăng nhập thành công",
                    "token", token,
                    "user", Map.of(
                            "userId", user.get("UserID"),
                            "fullName", user.get("FullName"),
                            "roleId", user.get("RoleID")
                    )
            );

        } catch (EmptyResultDataAccessException e) {
            // Không tìm thấy email
            return Map.of(
                    "success", false,
                    "errorCode", "EMAIL_NOT_FOUND",
                    "error", "Email chưa được đăng ký"
            );
        } catch (Exception e) {
            return Map.of(
                    "success", false,
                    "errorCode", "LOGIN_FAILED",
                    "error", "Đăng nhập thất bại. Vui lòng thử lại."
            );
        }
    }
}
