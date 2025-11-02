package com.job.backend.model;

import lombok.Data;

@Data
public class ThongKeTuyenDung {
    private Integer thongKeID;
    private Integer ntdID;
    private String thangNam; // dạng 'YYYY-MM'
    private Integer soTinDang;
    private Integer soUngVienUngTuyen;
    private Integer soHoSoTrungTuyen;
    private Double tyLeThanhCong;
}
