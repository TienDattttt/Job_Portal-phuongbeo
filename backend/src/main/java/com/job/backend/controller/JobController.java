package com.job.backend.controller;

import com.job.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // GET /api/jobs?keyword=java&diaDiem=HCM&page=1&size=10
    @GetMapping
    public Map<String, Object> listJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String diaDiem,
            @RequestParam(required = false) String loaiHinh,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return jobService.getAllJobs(keyword, diaDiem, loaiHinh, page, size);
    }

    // GET /api/jobs/{id}
    @GetMapping("/{id}")
    public Map<String, Object> jobDetail(@PathVariable int id) {
        return jobService.getJobDetail(id);
    }

    // GET /api/jobs/employer/{ntdId}
    @GetMapping("/employer/{ntdId}")
    public List<Map<String, Object>> listByEmployer(@PathVariable int ntdId) {
        return jobService.getJobsByEmployer(ntdId);
    }

    // POST /api/jobs
    @PostMapping
    public String createJob(@RequestBody Map<String, Object> job) {
        return jobService.createJob(job);
    }

    // PUT /api/jobs/{tinId}
    @PutMapping("/{tinId}")
    public String updateJob(@PathVariable int tinId, @RequestBody Map<String, Object> job) {
        return jobService.updateJob(tinId, job);
    }

    // DELETE /api/jobs/{tinId}
    @DeleteMapping("/{tinId}")
    public String deleteJob(@PathVariable int tinId) {
        return jobService.deleteJob(tinId);
    }

}
