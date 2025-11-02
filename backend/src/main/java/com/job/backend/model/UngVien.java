package com.job.backend.model;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UngVien {
    private Integer ungVienID;
    private Integer userID;
    private LocalDate ngaySinh;
    private String diaChi;
    private String gioiTinh;
    private String hocVan;
    private String kyNang;
    private String kinhNghiem;
    private String cvLink;
    private String moTaBanThan;
}
