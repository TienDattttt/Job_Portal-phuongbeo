package com.job.backend.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class JobRepository {

    private final JdbcTemplate jdbcTemplate;

    /**
     * Lấy danh sách tin tuyển dụng có lọc & phân trang
     */
    public List<Map<String, Object>> findJobs(String keyword, String diaDiem, String loaiHinh, int page, int size) {
        int offset = (page - 1) * size;

        String sql = """
                SELECT t.TinID, t.TieuDe, t.MoTa, t.MucLuong, t.DiaDiemLamViec,
                       t.LoaiHinhCongViec, t.HanNop, t.CreatedAt,
                       n.TenCongTy, n.LogoURL
                FROM TinTuyenDung t
                JOIN NhaTuyenDung n ON n.NTDID = t.NTDID
                WHERE t.TrangThai = N'Đang hiển thị'
                  AND (@kw IS NULL OR t.TieuDe LIKE N'%' + @kw + N'%' OR t.MoTa LIKE N'%' + @kw + N'%')
                  AND (@dd IS NULL OR t.DiaDiemLamViec LIKE N'%' + @dd + N'%')
                  AND (@lh IS NULL OR t.LoaiHinhCongViec = @lh)
                ORDER BY t.CreatedAt DESC
                OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
                """;

        // SQL Server không cho dùng @param kiểu này trong JdbcTemplate,
        // nên ta xử lý thủ công: build điều kiện bằng Java.
        StringBuilder dynamicSql = new StringBuilder("""
                SELECT t.TinID, t.TieuDe, t.MoTa, t.MucLuong, t.DiaDiemLamViec,
                       t.LoaiHinhCongViec, t.HanNop, t.CreatedAt,
                       n.TenCongTy, n.LogoURL
                FROM TinTuyenDung t
                JOIN NhaTuyenDung n ON n.NTDID = t.NTDID
                WHERE t.TrangThai = N'Đang hiển thị'
                """);

        if (keyword != null && !keyword.isBlank()) {
            dynamicSql.append(" AND (t.TieuDe LIKE N'%' + ? + N'%' OR t.MoTa LIKE N'%' + ? + N'%')");
        }
        if (diaDiem != null && !diaDiem.isBlank()) {
            dynamicSql.append(" AND t.DiaDiemLamViec LIKE N'%' + ? + N'%'");
        }
        if (loaiHinh != null && !loaiHinh.isBlank()) {
            dynamicSql.append(" AND t.LoaiHinhCongViec = ?");
        }
        dynamicSql.append(" ORDER BY t.CreatedAt DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY");

        // Tạo danh sách tham số động
        new Object() {};
        new Object();
        new Object();

        // Gom tham số theo thứ tự
        java.util.List<Object> params = new java.util.ArrayList<>();
        if (keyword != null && !keyword.isBlank()) {
            params.add(keyword);
            params.add(keyword);
        }
        if (diaDiem != null && !diaDiem.isBlank()) params.add(diaDiem);
        if (loaiHinh != null && !loaiHinh.isBlank()) params.add(loaiHinh);
        params.add(offset);
        params.add(size);

        return jdbcTemplate.queryForList(dynamicSql.toString(), params.toArray());
    }

    /**
     * Lấy chi tiết 1 tin tuyển dụng theo ID
     */
    public Map<String, Object> findById(int id) {
        String sql = """
                SELECT t.TinID, t.TieuDe, t.MoTa, t.YeuCau, t.MucLuong, 
                       t.DiaDiemLamViec, t.LoaiHinhCongViec, t.HanNop, 
                       t.TrangThai, t.CreatedAt,
                       n.TenCongTy, n.MoTa AS MoTaCongTy, n.Website, n.LogoURL
                FROM TinTuyenDung t
                JOIN NhaTuyenDung n ON n.NTDID = t.NTDID
                WHERE t.TinID = ?
                """;
        return jdbcTemplate.queryForMap(sql, id);
    }

    /**
     * Lấy danh sách tin theo Nhà tuyển dụng
     */
    public List<Map<String, Object>> findByEmployer(int ntdId) {
        String sql = """
                SELECT t.TinID, t.TieuDe, t.MucLuong, t.HanNop, t.TrangThai, t.CreatedAt
                FROM TinTuyenDung t
                WHERE t.NTDID = ?
                ORDER BY t.CreatedAt DESC
                """;
        return jdbcTemplate.queryForList(sql, ntdId);
    }

    /**
     * Tạo tin tuyển dụng mới
     */
    public int createJob(Map<String, Object> job) {
        String sql = """
                INSERT INTO TinTuyenDung 
                    (NTDID, TieuDe, MoTa, YeuCau, MucLuong, DiaDiemLamViec, LoaiHinhCongViec, HanNop, TrangThai, CreatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, N'Đang hiển thị', GETDATE())
                """;
        return jdbcTemplate.update(sql,
                job.get("NTDID"),
                job.get("TieuDe"),
                job.get("MoTa"),
                job.get("YeuCau"),
                job.get("MucLuong"),
                job.get("DiaDiemLamViec"),
                job.get("LoaiHinhCongViec"),
                job.get("HanNop"));
    }

    /**
     * Cập nhật tin tuyển dụng
     */
    public int updateJob(int tinId, Map<String, Object> job) {
        String sql = """
                UPDATE TinTuyenDung
                SET TieuDe = ?, MoTa = ?, YeuCau = ?, MucLuong = ?, DiaDiemLamViec = ?, 
                    LoaiHinhCongViec = ?, HanNop = ?, TrangThai = ?
                WHERE TinID = ?
                """;
        return jdbcTemplate.update(sql,
                job.get("TieuDe"),
                job.get("MoTa"),
                job.get("YeuCau"),
                job.get("MucLuong"),
                job.get("DiaDiemLamViec"),
                job.get("LoaiHinhCongViec"),
                job.get("HanNop"),
                job.get("TrangThai"),
                tinId);
    }

    /**
     * Xóa tin tuyển dụng
     */
    public int deleteJob(int tinId) {
        String sql = "DELETE FROM TinTuyenDung WHERE TinID = ?";
        return jdbcTemplate.update(sql, tinId);
    }

}
