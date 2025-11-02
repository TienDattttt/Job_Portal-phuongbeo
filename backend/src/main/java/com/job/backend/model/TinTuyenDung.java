package com.job.backend.model;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TinTuyenDung {
    private Integer tinID;
    private Integer ntdID;
    private String tieuDe;
    private String moTa;
    private String yeuCau;
    private String mucLuong;
    private String diaDiemLamViec;
    private String loaiHinhCongViec;
    private LocalDate hanNop;
    private String trangThai;
    private LocalDateTime createdAt;

    // liên kết mở rộng
    private String tenCongTy;
    private String logoURL;
}
