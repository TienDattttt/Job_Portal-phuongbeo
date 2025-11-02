package com.job.backend.controller;

import com.job.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    /**
     * Lấy danh sách thông báo theo UserID.
     * - Nếu `onlyUnread=true` → chỉ trả về thông báo chưa đọc.
     * Ví dụ: /api/notifications/user/3?onlyUnread=true
     */
    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getByUser(
            @PathVariable int userId,
            @RequestParam(defaultValue = "false") boolean onlyUnread
    ) {
        return service.getNotificationsByUser(userId, onlyUnread);
    }

    /**
     * Đánh dấu thông báo đã đọc.
     */
    @PutMapping("/{notiId}/read")
    public String markAsRead(@PathVariable int notiId) {
        return service.markAsRead(notiId);
    }
}
