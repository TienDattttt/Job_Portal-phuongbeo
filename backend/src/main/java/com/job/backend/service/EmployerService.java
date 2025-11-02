package com.job.backend.service;

import com.job.backend.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployerService {

    private final EmployerRepository repository;

    public List<Map<String, Object>> getAllEmployers() {
        return repository.findAll();
    }

    public Map<String, Object> getEmployerDetail(int ntdId) {
        return repository.findById(ntdId);
    }

    public Map<String, Object> getByUserId(int userId) {
        return repository.findByUserId(userId);
    }

    public String createEmployer(Map<String, Object> data) {
        int result = repository.createEmployer(data);
        return (result > 0) ? "Tạo hồ sơ công ty thành công!" : "Không thể tạo hồ sơ.";
    }

    public String updateEmployer(int ntdId, Map<String, Object> data) {
        int result = repository.updateEmployer(ntdId, data);
        return (result > 0)
                ? "Đã cập nhật hồ sơ công ty #" + ntdId
                : "Không tìm thấy công ty #" + ntdId;
    }

    public String updateLogo(int ntdId, String logoUrl) {
        int result = repository.updateLogo(ntdId, logoUrl);
        return (result > 0)
                ? "Đã cập nhật logo thành công."
                : "Không tìm thấy công ty #" + ntdId;
    }

    public String deleteEmployer(int ntdId) {
        int result = repository.deleteEmployer(ntdId);
        return (result > 0)
                ? "Đã xóa công ty #" + ntdId
                : "Không tìm thấy công ty #" + ntdId;
    }
}
