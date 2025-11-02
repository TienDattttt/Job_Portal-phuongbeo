package com.job.backend.controller;

import com.job.backend.service.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerUploadController {

    private final EmployerService service;
    private static final String UPLOAD_DIR = "uploads/logo/";

    // 1️⃣ Upload logo công ty
    @PostMapping("/upload-logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Chưa chọn tệp logo"));
            }

            // Kiểm tra định dạng hợp lệ
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            if (!fileName.matches(".*\\.(png|jpg|jpeg|gif|svg)$")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Chỉ chấp nhận file ảnh (PNG, JPG, JPEG, GIF, SVG)"));
            }

            // Tạo thư mục nếu chưa có
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Lưu file với tên duy nhất
            String newName = System.currentTimeMillis() + "_" + fileName;
            Path path = Paths.get(UPLOAD_DIR + newName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            String logoUrl = "/uploads/logo/" + newName;
            return ResponseEntity.ok(Map.of(
                    "message", "Upload logo thành công",
                    "logoURL", logoUrl
            ));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi upload logo: " + e.getMessage()));
        }
    }

    // 2️⃣ Gắn link logo vào NhaTuyenDung
    @PatchMapping("/{ntdId}/logo")
    public ResponseEntity<?> updateLogo(@PathVariable int ntdId, @RequestBody Map<String, Object> body) {
        Object link = body.get("logoURL");
        if (link == null || link.toString().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu đường dẫn logo"));
        }
        String result = service.updateLogo(ntdId, link.toString());
        return ResponseEntity.ok(Map.of("message", result));
    }
}
