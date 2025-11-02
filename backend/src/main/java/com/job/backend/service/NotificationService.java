package com.job.backend.service;

import com.job.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    /**
     * Lấy danh sách thông báo cho user (có thể lọc unread)
     */
    public List<Map<String, Object>> getNotificationsByUser(int userId, boolean onlyUnread) {
        return repository.getByUserId(userId, onlyUnread);
    }

    /**
     * Đánh dấu thông báo là đã đọc
     */
    public String markAsRead(int notiId) {
        int updated = repository.markAsRead(notiId);
        return (updated > 0)
                ? "Thông báo #" + notiId + " đã được đánh dấu là đã đọc."
                : "Không tìm thấy thông báo #" + notiId;
    }
}
