package com.job.backend.controller;

import com.job.backend.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService service;

    // 1️⃣ Danh sách tất cả NTD (admin)
    @GetMapping
    public List<Map<String, Object>> getAllEmployers() {
        return service.getAllEmployers();
    }

    // 2️⃣ Chi tiết 1 doanh nghiệp
    @GetMapping("/{ntdId}")
    public Map<String, Object> getEmployerDetail(@PathVariable int ntdId) {
        return service.getEmployerDetail(ntdId);
    }

    // 3️⃣ Tạo mới
    @PostMapping
    public String createEmployer(@RequestBody Map<String, Object> body) {
        return service.createEmployer(body);
    }

    // 4️⃣ Cập nhật
    @PutMapping("/{ntdId}")
    public String updateEmployer(@PathVariable int ntdId, @RequestBody Map<String, Object> body) {
        return service.updateEmployer(ntdId, body);
    }

    // 5️⃣ Xóa
    @DeleteMapping("/{ntdId}")
    public String deleteEmployer(@PathVariable int ntdId) {
        return service.deleteEmployer(ntdId);
    }
}
