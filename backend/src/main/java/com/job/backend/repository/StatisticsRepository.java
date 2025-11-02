package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class StatisticsRepository {

    private final JdbcTemplate jdbcTemplate;

    public Map<String, Object> getEmployerStats(int ntdId) {
        // Gọi SP và chia làm hai phần kết quả
        String sql = "EXEC sp_Employer_Statistics ?";
        List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, ntdId);

        // SQL Server trả 2 result sets, nhưng JdbcTemplate chỉ đọc cái đầu,
        // nên ta có thể tách ra hoặc làm 2 SP riêng nếu cần chi tiết biểu đồ.
        return results.get(0);
    }

    public List<Map<String, Object>> getMonthlyApplications(int ntdId) {
        String sql = """
            SELECT FORMAT(ut.NgayUngTuyen, 'yyyy-MM') AS Thang, COUNT(*) AS SoLuong
            FROM UngTuyen ut
            JOIN TinTuyenDung t ON t.TinID = ut.TinID
            WHERE t.NTDID = ?
            GROUP BY FORMAT(ut.NgayUngTuyen, 'yyyy-MM')
            ORDER BY Thang
        """;
        return jdbcTemplate.queryForList(sql, ntdId);
    }
}
