package com.job.backend.controller;

import com.job.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService service;

    // 🟢 Lấy hồ sơ theo UserID
    @GetMapping("/user/{userId}")
    public Map<String, Object> getProfile(@PathVariable int userId) {
        return service.getProfileByUser(userId);
    }

    // 🟡 Tạo hồ sơ mới
    @PostMapping
    public String createProfile(@RequestBody Map<String, Object> body) {
        return service.createProfile(body);
    }

    // 🟠 Cập nhật hồ sơ
    @PutMapping("/{ungVienId}")
    public String updateProfile(@PathVariable int ungVienId, @RequestBody Map<String, Object> body) {
        return service.updateProfile(ungVienId, body);
    }

    // 🔴 Xóa hồ sơ
    @DeleteMapping("/{ungVienId}")
    public String deleteProfile(@PathVariable int ungVienId) {
        return service.deleteProfile(ungVienId);
    }
}
