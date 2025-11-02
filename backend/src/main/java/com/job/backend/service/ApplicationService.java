package com.job.backend.service;

import com.job.backend.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository repository;

    // Ứng viên nộp hồ sơ
    public Map<String, Object> create(int ungVienID, int tinID, String ghiChu) {
        return repository.createApplication(ungVienID, tinID, ghiChu);
    }

    // Danh sách ứng viên theo tin
    public List<Map<String, Object>> getByJob(int tinID) {
        return repository.listByJob(tinID);
    }

    // Danh sách tin đã ứng tuyển theo user
    public List<Map<String, Object>> getByUser(int userID) {
        return repository.listByUser(userID);
    }

    // Cập nhật trạng thái hồ sơ
    public Map<String, Object> updateStatus(int ungTuyenID, String trangThai, String ghiChu) {
        return repository.updateStatus(ungTuyenID, trangThai, ghiChu);
    }
}
