package com.job.backend.service;

import com.job.backend.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterviewService {
    private final InterviewRepository repository;
    private final MailService mailService;

    public Map<String, Object> createInterview(Map<String, Object> req) {
        int ungTuyenID = (int) req.get("ungTuyenID");
        String ngayHen = (String) req.get("ngayHen");
        String diaDiem = (String) req.get("diaDiem");
        String nguoiPhongVan = (String) req.get("nguoiPhongVan");
        String noiDungThu = (String) req.get("noiDungThu");
        String emailUngVien = (String) req.get("emailUngVien");

        // 1️⃣ Ghi vào DB
        Map<String, Object> saved = repository.createInterview(
                ungTuyenID, ngayHen, diaDiem, nguoiPhongVan, noiDungThu, emailUngVien
        );

        // 2️⃣ Gửi email nếu có địa chỉ
        if (emailUngVien != null && !emailUngVien.isBlank()) {
            mailService.sendMail(
                    emailUngVien,
                    "Thư mời phỏng vấn từ nhà tuyển dụng",
                    """
                    <p>Xin chào,</p>
                    <p>%s</p>
                    <p><b>Thời gian:</b> %s<br>
                    <b>Địa điểm:</b> %s<br>
                    <b>Người phỏng vấn:</b> %s</p>
                    <p>Trân trọng,<br>Phòng nhân sự</p>
                    """.formatted(noiDungThu, ngayHen, diaDiem, nguoiPhongVan)
            );
        }

        return saved;
    }

    public List<Map<String, Object>> getByEmployer(int ntdId) {
        return repository.listByEmployer(ntdId);
    }

    public Map<String, Object> confirmInterview(int lichHenID, String trangThai) {
        return repository.confirmInterview(lichHenID, trangThai);
    }
}
