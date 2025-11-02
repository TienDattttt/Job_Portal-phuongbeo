package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class EmployerRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Lấy danh sách tất cả nhà tuyển dụng (admin)
     */
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM NhaTuyenDung ORDER BY CreatedAt DESC";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Lấy chi tiết nhà tuyển dụng theo ID
     */
    public Map<String, Object> findById(int ntdId) {
        String sql = "SELECT * FROM NhaTuyenDung WHERE NTDID = ?";
        return jdbcTemplate.queryForMap(sql, ntdId);
    }

    /**
     * Tạo mới hồ sơ nhà tuyển dụng
     */
    public int createEmployer(Map<String, Object> data) {
        String sql = """
            INSERT INTO NhaTuyenDung (TenCongTy, MaSoThue, DiaChi, MoTa, LogoURL, Website)
            VALUES (?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                data.get("tenCongTy"),
                data.get("maSoThue"),
                data.get("diaChi"),
                data.get("moTa"),
                data.get("logoURL"),
                data.get("website"));
    }

    /**
     * Cập nhật thông tin nhà tuyển dụng
     */
    public int updateEmployer(int ntdId, Map<String, Object> data) {
        String sql = """
            UPDATE NhaTuyenDung
            SET TenCongTy = ?, MaSoThue = ?, DiaChi = ?, MoTa = ?, LogoURL = ?, Website = ?
            WHERE NTDID = ?
        """;
        return jdbcTemplate.update(sql,
                data.get("tenCongTy"),
                data.get("maSoThue"),
                data.get("diaChi"),
                data.get("moTa"),
                data.get("logoURL"),
                data.get("website"),
                ntdId);
    }

    /**
     * Xóa doanh nghiệp (nếu cần)
     */
    public int deleteEmployer(int ntdId) {
        return jdbcTemplate.update("DELETE FROM NhaTuyenDung WHERE NTDID = ?", ntdId);
    }

    public int updateLogo(int ntdId, String logoUrl) {
        String sql = "UPDATE NhaTuyenDung SET LogoURL = ? WHERE NTDID = ?";
        return jdbcTemplate.update(sql, logoUrl, ntdId);
    }

}
