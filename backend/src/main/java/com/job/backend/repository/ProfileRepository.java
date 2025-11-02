package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Lấy hồ sơ theo UserID.
     * Nếu chưa có -> tự động tạo hồ sơ rỗng.
     */
    public Map<String, Object> getByUserId(int userId) {
        String selectSql = """
            SELECT u.UngVienID, u.UserID, usr.FullName, usr.Email, usr.Phone,
                   u.NgaySinh, u.DiaChi, u.GioiTinh, 
                   u.HocVan, u.KyNang, u.KinhNghiem, 
                   u.CVLink, u.MoTaBanThan
            FROM UngVien u
            JOIN [User] usr ON usr.UserID = u.UserID
            WHERE u.UserID = ?
        """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(selectSql, userId);

        // 🟡 Nếu chưa có hồ sơ -> tự tạo hồ sơ rỗng
        if (rows.isEmpty()) {
            String insertSql = """
                INSERT INTO UngVien (UserID, NgaySinh, DiaChi, GioiTinh, HocVan, KyNang, KinhNghiem, CVLink, MoTaBanThan)
                VALUES (?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
            """;
            jdbcTemplate.update(insertSql, userId);

            // Lấy lại hồ sơ vừa tạo
            rows = jdbcTemplate.queryForList(selectSql, userId);
        }

        return rows.get(0);
    }

    /**
     * Tạo hồ sơ mới (nếu chưa có)
     */
    public int createProfile(Map<String, Object> data) {
        String sql = """
            INSERT INTO UngVien (UserID, NgaySinh, DiaChi, GioiTinh, HocVan, KyNang, KinhNghiem, CVLink, MoTaBanThan)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                data.get("userId"),
                data.get("ngaySinh"),
                data.get("diaChi"),
                data.get("gioiTinh"),
                data.get("hocVan"),
                data.get("kyNang"),
                data.get("kinhNghiem"),
                data.get("cvLink"),
                data.get("moTaBanThan"));
    }

    /**
     * Cập nhật hồ sơ theo UngVienID
     */
    public int updateProfile(int ungVienId, Map<String, Object> data) {
        String sql = """
            UPDATE UngVien
            SET NgaySinh = ?, DiaChi = ?, GioiTinh = ?, HocVan = ?, 
                KyNang = ?, KinhNghiem = ?, CVLink = ?, MoTaBanThan = ?
            WHERE UngVienID = ?
        """;
        return jdbcTemplate.update(sql,
                data.get("ngaySinh"),
                data.get("diaChi"),
                data.get("gioiTinh"),
                data.get("hocVan"),
                data.get("kyNang"),
                data.get("kinhNghiem"),
                data.get("cvLink"),
                data.get("moTaBanThan"),
                ungVienId);
    }

    /**
     * Xóa hồ sơ (ít dùng)
     */
    public int deleteProfile(int ungVienId) {
        return jdbcTemplate.update("DELETE FROM UngVien WHERE UngVienID = ?", ungVienId);
    }

    /**
     * Cập nhật đường dẫn CV
     */
    public int updateCvLink(int ungVienId, String cvLink) {
        String sql = "UPDATE UngVien SET CVLink = ? WHERE UngVienID = ?";
        return jdbcTemplate.update(sql, cvLink, ungVienId);
    }
}
