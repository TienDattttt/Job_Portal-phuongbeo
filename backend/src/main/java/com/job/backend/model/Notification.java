package com.job.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Notification {
    private Integer notiID;
    private Integer userID;
    private String tieuDe;
    private String noiDung;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
