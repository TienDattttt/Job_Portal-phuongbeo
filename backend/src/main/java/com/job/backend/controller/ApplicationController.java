package com.job.backend.controller;

import com.job.backend.service.ApplicationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    // 1️⃣ Ứng viên nộp hồ sơ
    @PostMapping
    public Map<String, Object> create(@RequestBody CreateRequest req) {
        return service.create(req.getUngVienID(), req.getTinID(), req.getGhiChu());
    }

    // 2️⃣ Nhà tuyển dụng xem danh sách ứng viên theo tin
    @GetMapping("/job/{jobId}")
    public List<Map<String, Object>> listByJob(@PathVariable int jobId) {
        return service.getByJob(jobId);
    }

    // 3️⃣ Ứng viên xem lịch sử ứng tuyển
    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> listByUser(@PathVariable int userId) {
        return service.getByUser(userId);
    }

    // 4️⃣ Cập nhật trạng thái hồ sơ
    @PutMapping("/{ungTuyenID}")
    public Map<String, Object> updateStatus(
            @PathVariable int ungTuyenID,
            @RequestBody UpdateRequest req) {
        return service.updateStatus(ungTuyenID, req.getTrangThai(), req.getGhiChu());
    }

    // DTO nội bộ
    @Data
    public static class CreateRequest {
        private int ungVienID;
        private int tinID;
        private String ghiChu;
    }

    @Data
    public static class UpdateRequest {
        private String trangThai;
        private String ghiChu;
    }
}
