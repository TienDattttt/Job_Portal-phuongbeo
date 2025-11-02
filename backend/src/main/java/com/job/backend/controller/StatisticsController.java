package com.job.backend.controller;

import com.job.backend.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService service;

    // 🧭 Lấy dashboard thống kê cho 1 nhà tuyển dụng
    @GetMapping("/employer/{ntdId}")
    public Map<String, Object> getDashboard(@PathVariable int ntdId) {
        return service.getEmployerDashboard(ntdId);
    }
}
