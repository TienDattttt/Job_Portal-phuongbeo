package com.job.backend.service;

import com.job.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository repository;

    public Map<String, Object> getProfileByUser(int userId) {
        Map<String, Object> profile = repository.getByUserId(userId);
        return profile;
    }

    public String createProfile(Map<String, Object> data) {
        int result = repository.createProfile(data);
        return (result > 0)
                ? "Đã tạo hồ sơ cá nhân mới."
                : "Không thể tạo hồ sơ.";
    }

    public String updateProfile(int ungVienId, Map<String, Object> data) {
        int result = repository.updateProfile(ungVienId, data);
        return (result > 0)
                ? "Đã cập nhật hồ sơ #" + ungVienId
                : "Không tìm thấy hồ sơ #" + ungVienId;
    }

    public String deleteProfile(int ungVienId) {
        int result = repository.deleteProfile(ungVienId);
        return (result > 0)
                ? "Đã xóa hồ sơ #" + ungVienId
                : "Không tìm thấy hồ sơ #" + ungVienId;
    }

    public String updateCvLink(int ungVienId, String cvLink) {
        int result = repository.updateCvLink(ungVienId, cvLink);
        return (result > 0)
                ? "Đã cập nhật đường dẫn CV thành công."
                : "Không tìm thấy hồ sơ #" + ungVienId;
    }
}
