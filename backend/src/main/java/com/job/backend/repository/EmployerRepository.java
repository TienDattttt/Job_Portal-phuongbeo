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

    // 🟢 Lấy danh sách tất cả NTD
    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.queryForList("SELECT * FROM NhaTuyenDung ORDER BY NTDID DESC");
    }

    // 🟢 Lấy chi tiết theo NTDID
    public Map<String, Object> findById(int ntdId) {
        List<Map<String, Object>> list = jdbcTemplate.queryForList(
                "SELECT * FROM NhaTuyenDung WHERE NTDID = ?", ntdId);
        if (list.isEmpty()) {
            throw new RuntimeException("Không tìm thấy NTDID = " + ntdId);
        }
        return list.get(0);
    }

    // 🟢 Lấy theo UserID (FE gọi API này)
    public Map<String, Object> findByUserId(int userId) {
        List<Map<String, Object>> list = jdbcTemplate.queryForList(
                "SELECT * FROM NhaTuyenDung WHERE UserID = ?", userId);
        if (list.isEmpty()) {
            throw new RuntimeException("Chưa có hồ sơ công ty cho UserID = " + userId);
        }
        return list.get(0);
    }

    // 🟢 Tạo mới NTD
    public int createEmployer(Map<String, Object> data) {
        String sql = """
            INSERT INTO NhaTuyenDung (UserID, TenCongTy, MaSoThue, DiaChi, LinhVuc, MoTa, Website, LogoURL)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;
        return jdbcTemplate.update(sql,
                data.get("userID"),
                data.get("tenCongTy"),
                data.getOrDefault("maSoThue", ""),
                data.getOrDefault("diaChi", ""),
                data.getOrDefault("linhVuc", ""),
                data.getOrDefault("moTa", ""),
                data.getOrDefault("website", ""),
                data.getOrDefault("logoURL", null));
    }

    // 🟢 Cập nhật NTD
    public int updateEmployer(int ntdId, Map<String, Object> data) {
        String sql = """
            UPDATE NhaTuyenDung
            SET TenCongTy = ?, MaSoThue = ?, DiaChi = ?, LinhVuc = ?, MoTa = ?, Website = ?, LogoURL = ?
            WHERE NTDID = ?
        """;
        return jdbcTemplate.update(sql,
                data.get("tenCongTy"),
                data.getOrDefault("maSoThue", ""),
                data.getOrDefault("diaChi", ""),
                data.getOrDefault("linhVuc", ""),
                data.getOrDefault("moTa", ""),
                data.getOrDefault("website", ""),
                data.getOrDefault("logoURL", ""),
                ntdId);
    }

    // 🟢 Cập nhật logo riêng
    public int updateLogo(int ntdId, String logoUrl) {
        return jdbcTemplate.update(
                "UPDATE NhaTuyenDung SET LogoURL = ? WHERE NTDID = ?",
                logoUrl, ntdId);
    }

    // 🟢 Xóa công ty
    public int deleteEmployer(int ntdId) {
        return jdbcTemplate.update("DELETE FROM NhaTuyenDung WHERE NTDID = ?", ntdId);
    }
}
