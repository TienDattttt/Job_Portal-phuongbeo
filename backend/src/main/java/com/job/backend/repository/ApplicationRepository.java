package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ApplicationRepository {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Ứng viên nộp hồ sơ vào tin tuyển dụng
     * Gọi SP: sp_Application_Create
     */
    public Map<String, Object> createApplication(int ungVienID, int tinID, String ghiChu) {
        return jdbcTemplate.queryForMap(
                "EXEC sp_Application_Create ?, ?, ?", ungVienID, tinID, ghiChu);
    }

    /**
     * Danh sách ứng viên ứng tuyển theo tin
     * Gọi SP: sp_Application_ListByJob
     */
    public List<Map<String, Object>> listByJob(int tinID) {
        return jdbcTemplate.queryForList(
                "EXEC sp_Application_ListByJob ?", tinID);
    }

    /**
     * Lịch sử ứng tuyển của ứng viên (theo UserID)
     * Gọi SP: sp_Application_ListByUser
     */
    public List<Map<String, Object>> listByUser(int userID) {
        return jdbcTemplate.queryForList(
                "EXEC sp_Application_ListByUser ?", userID);
    }

    /**
     * Cập nhật trạng thái hồ sơ (NTD duyệt)
     * Gọi SP: sp_Application_UpdateStatus
     */
    public Map<String, Object> updateStatus(int ungTuyenID, String trangThai, String ghiChu) {
        return jdbcTemplate.queryForMap(
                "EXEC sp_Application_UpdateStatus ?, ?, ?", ungTuyenID, trangThai, ghiChu);
    }
}
