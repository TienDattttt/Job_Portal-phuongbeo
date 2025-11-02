package com.job.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer userID;
    private String email;
    private String passwordHash;
    private String fullName;
    private String phone;
    private Integer roleID;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
