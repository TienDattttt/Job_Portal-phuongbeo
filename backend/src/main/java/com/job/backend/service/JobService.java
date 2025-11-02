package com.job.backend.service;

import com.job.backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;

    public Map<String, Object> getAllJobs(String keyword, String diaDiem, String loaiHinh, int page, int size) {
        List<Map<String, Object>> items = jobRepository.findJobs(keyword, diaDiem, loaiHinh, page, size);
        Map<String, Object> resp = new HashMap<>();
        resp.put("page", page);
        resp.put("size", size);
        resp.put("items", items);
        resp.put("count", items.size());
        return resp;
    }

    public Map<String, Object> getJobDetail(int id) {
        return jobRepository.findById(id);
    }

    public List<Map<String, Object>> getJobsByEmployer(int ntdId) {
        return jobRepository.findByEmployer(ntdId);
    }

    public String createJob(Map<String, Object> job) {
        int result = jobRepository.createJob(job);
        return (result > 0) ? "Đã tạo tin tuyển dụng mới thành công." : "Tạo tin thất bại.";
    }

    public String updateJob(int tinId, Map<String, Object> job) {
        int result = jobRepository.updateJob(tinId, job);
        return (result > 0) ? "Đã cập nhật tin #" + tinId : "Không tìm thấy tin #" + tinId;
    }

    public String deleteJob(int tinId) {
        int result = jobRepository.deleteJob(tinId);
        return (result > 0) ? "Đã xóa tin #" + tinId : "Không tìm thấy tin #" + tinId;
    }

}
