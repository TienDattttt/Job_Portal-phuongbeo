package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class InterviewRepository {
    private final JdbcTemplate jdbcTemplate;

    /**
     * Tạo thư mời phỏng vấn (INSERT trực tiếp)
     */
    public Map<String, Object> createInterview(
            int ungTuyenID,
            String ngayHen,
            String diaDiem,
            String nguoiPhongVan,
            String noiDungThu,
            String emailUngVien
    ) {
        // 1️⃣ Thêm vào bảng LichHenPhongVan
        String insertSql = """
            INSERT INTO LichHenPhongVan
                (UngTuyenID, NgayHen, DiaDiem, NguoiPhongVan, NoiDungThu, TrangThai, NgayGuiThu, EmailUngVien)
            VALUES (?, TRY_CAST(? AS DATETIME), ?, ?, ?, N'Đang chờ phản hồi', GETDATE(), ?)
        """;

        jdbcTemplate.update(insertSql, ungTuyenID, ngayHen, diaDiem, nguoiPhongVan, noiDungThu, emailUngVien);

        // 2️⃣ Lấy ID vừa thêm
        Integer lichHenID = jdbcTemplate.queryForObject("SELECT MAX(LichHenID) FROM LichHenPhongVan", Integer.class);

        // 3️⃣ (Tùy chọn) Ghi thông báo Notification cho ứng viên
        String insertNoti = """
            INSERT INTO Notification (UserID, TieuDe, NoiDung, IsRead, CreatedAt)
            SELECT u.UserID,
                   N'Thư mời phỏng vấn từ nhà tuyển dụng',
                   N'Bạn đã nhận được thư mời phỏng vấn cho hồ sơ #' + CAST(ut.UngTuyenID AS NVARCHAR(10)) 
                   + N'. Thời gian: ' + ? + N'. Địa điểm: ' + ? + N'. Người phỏng vấn: ' + ?,
                   0,
                   GETDATE()
            FROM UngVien u
            JOIN UngTuyen ut ON u.UngVienID = ut.UngVienID
            WHERE ut.UngTuyenID = ?
        """;
        jdbcTemplate.update(insertNoti, ngayHen, diaDiem, nguoiPhongVan, ungTuyenID);

        // 4️⃣ Trả kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("LichHenID", lichHenID);
        result.put("UngTuyenID", ungTuyenID);
        result.put("NgayHen", ngayHen);
        result.put("DiaDiem", diaDiem);
        result.put("NguoiPhongVan", nguoiPhongVan);
        result.put("EmailUngVien", emailUngVien);
        result.put("TrangThai", "Đang chờ phản hồi");
        return result;
    }

    /**
     * Danh sách thư mời theo nhà tuyển dụng (gọi SP sẵn có)
     */
    public java.util.List<Map<String, Object>> listByEmployer(int ntdId) {
        return jdbcTemplate.queryForList("EXEC sp_Interview_ListByEmployer ?", ntdId);
    }

    /**
     * Xác nhận thư mời (gọi SP sẵn có sp_Interview_Confirm)
     */
    public Map<String, Object> confirmInterview(int lichHenID, String trangThai) {
        return jdbcTemplate.queryForMap("EXEC sp_Interview_Confirm ?, ?", lichHenID, trangThai);
    }
}
