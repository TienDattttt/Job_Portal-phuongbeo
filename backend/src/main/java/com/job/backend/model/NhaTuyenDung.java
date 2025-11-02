package com.job.backend.model;

import lombok.Data;

@Data
public class NhaTuyenDung {
    private Integer ntdID;
    private Integer userID;
    private String tenCongTy;
    private String maSoThue;
    private String diaChi;
    private String linhVuc;
    private String moTa;
    private String website;
    private String logoURL;
}
