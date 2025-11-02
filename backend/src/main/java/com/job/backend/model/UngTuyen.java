package com.job.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UngTuyen {
    private Integer ungTuyenID;
    private Integer ungVienID;
    private Integer tinID;
    private LocalDateTime ngayUngTuyen;
    private String trangThai;
    private String ghiChu;
}
