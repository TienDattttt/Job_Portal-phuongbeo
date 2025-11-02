package com.job.backend.controller;

import com.job.backend.service.InterviewService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {
    private final InterviewService service;

    // 1️⃣ Tạo thư mời phỏng vấn (INSERT backend)
    @PostMapping("/send")
    public Map<String, Object> create(@RequestBody CreateRequest req) {
        Map<String, Object> body = Map.of(
                "ungTuyenID", req.getUngTuyenID(),
                "ngayHen", req.getNgayHen(),
                "diaDiem", req.getDiaDiem(),
                "nguoiPhongVan", req.getNguoiPhongVan(),
                "noiDungThu", req.getNoiDungThu(),
                "emailUngVien", req.getEmailUngVien()
        );
        return service.createInterview(body);
    }

    // 2️⃣ Danh sách thư mời theo NTD (gọi SP sẵn có)
    @GetMapping("/by-employer/{ntdId}")
    public List<Map<String, Object>> listByEmployer(@PathVariable int ntdId) {
        return service.getByEmployer(ntdId);
    }

    // 3️⃣ Ứng viên xác nhận / từ chối (gọi SP sp_Interview_Confirm)
    @PutMapping("/{lichHenID}")
    public Map<String, Object> confirm(@PathVariable int lichHenID, @RequestBody ConfirmRequest req) {
        return service.confirmInterview(lichHenID, req.getTrangThai());
    }

    // DTO nội bộ
    @Data
    public static class CreateRequest {
        private int ungTuyenID;
        private String ngayHen;
        private String diaDiem;
        private String nguoiPhongVan;
        private String noiDungThu;
        private String emailUngVien;
    }

    @Data
    public static class ConfirmRequest {
        private String trangThai;
    }
}
