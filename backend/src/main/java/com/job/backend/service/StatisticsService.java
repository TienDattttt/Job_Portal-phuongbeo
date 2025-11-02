package com.job.backend.service;

import com.job.backend.repository.StatisticsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StatisticsRepository repository;

    public Map<String, Object> getEmployerDashboard(int ntdId) {
        Map<String, Object> overview = repository.getEmployerStats(ntdId);
        List<Map<String, Object>> monthly = repository.getMonthlyApplications(ntdId);

        Map<String, Object> result = new HashMap<>();
        result.put("overview", overview);
        result.put("monthly", monthly);
        return result;
    }
}
