package com.job.backend.controller;

import com.job.backend.service.ProfileService;
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
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileUploadController {

    private final ProfileService service;

    private static final String UPLOAD_DIR = "uploads/cv/";

    // 1️⃣ Upload file CV (PDF/DOCX)
    @PostMapping("/upload-cv")
    public ResponseEntity<?> uploadCV(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Chưa chọn tệp CV"));
            }

            // Kiểm tra định dạng hợp lệ
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            if (!fileName.endsWith(".pdf") && !fileName.endsWith(".docx")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Chỉ chấp nhận định dạng PDF hoặc DOCX"));
            }

            // Tạo thư mục nếu chưa có
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // Lưu file với tên duy nhất (thời gian + tên gốc)
            String newName = System.currentTimeMillis() + "_" + fileName;
            Path path = Paths.get(UPLOAD_DIR + newName);
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // Trả về đường dẫn (relative URL)
            String fileUrl = "/uploads/cv/" + newName;
            return ResponseEntity.ok(Map.of(
                    "message", "Upload thành công",
                    "cvLink", fileUrl
            ));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi upload file: " + e.getMessage()));
        }
    }

    // 2️⃣ Gắn link CV vào hồ sơ ứng viên
    @PatchMapping("/{ungVienId}/cv")
    public ResponseEntity<?> updateCvLink(
            @PathVariable int ungVienId,
            @RequestBody Map<String, Object> body
    ) {
        Object link = body.get("cvLink");
        if (link == null || link.toString().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu đường dẫn CV"));
        }
        String result = service.updateCvLink(ungVienId, link.toString());
        return ResponseEntity.ok(Map.of("message", result));
    }
}
