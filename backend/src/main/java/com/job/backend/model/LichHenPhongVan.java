package com.job.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LichHenPhongVan {
    private Integer lichHenID;
    private Integer ungTuyenID;
    private LocalDateTime ngayHen;
    private String diaDiem;
    private String nguoiPhongVan;
    private String noiDungThu;
    private String trangThai;
    private LocalDateTime ngayGuiThu;
    private String emailUngVien;
}
