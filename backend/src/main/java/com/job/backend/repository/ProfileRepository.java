package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ProfileRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Lấy hồ sơ theo UserID
     */
    public Map<String, Object> getByUserId(int userId) {
        String sql = """
            SELECT u.UngVienID, u.UserID, usr.FullName, usr.Email, usr.Phone,
                   u.NgaySinh, u.DiaChi, u.GioiTinh, 
                   u.HocVan, u.KyNang, u.KinhNghiem, 
                   u.CVLink, u.MoTaBanThan
            FROM UngVien u
            JOIN [User] usr ON usr.UserID = u.UserID
            WHERE u.UserID = ?
        """;
        return jdbcTemplate.queryForMap(sql, userId);
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

    public int updateCvLink(int ungVienId, String cvLink) {
        String sql = "UPDATE UngVien SET CVLink = ? WHERE UngVienID = ?";
        return jdbcTemplate.update(sql, cvLink, ungVienId);
    }

}
