package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class NotificationRepository {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Lấy danh sách thông báo theo UserID, có thể lọc chỉ những thông báo chưa đọc.
     */
    public List<Map<String, Object>> getByUserId(int userId, boolean onlyUnread) {
        return jdbcTemplate.queryForList("EXEC sp_Notification_List ?, ?", userId, onlyUnread ? 1 : 0);
    }

    /**
     * Đánh dấu thông báo là đã đọc.
     */
    public int markAsRead(int notiId) {
        String sql = "UPDATE Notification SET IsRead = 1 WHERE NotiID = ?";
        return jdbcTemplate.update(sql, notiId);
    }
}
