package com.job.backend.controller;

import com.job.backend.service.EmployerService;
import com.job.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService service;
    private final JwtService jwtService;
    private static final String UPLOAD_DIR = "uploads/logo/";

    // 1️⃣ Lấy danh sách tất cả NTD (Admin)
    @GetMapping
    public List<Map<String, Object>> getAllEmployers() {
        return service.getAllEmployers();
    }

    // 2️⃣ Lấy chi tiết NTD theo NTDID
    @GetMapping("/detail/{ntdId}")
    public Map<String, Object> getEmployerDetail(@PathVariable int ntdId) {
        return service.getEmployerDetail(ntdId);
    }

    // 3️⃣ Lấy NTD theo UserID (FE gọi /api/employers/{userId})
    @GetMapping("/{userId}")
    public ResponseEntity<?> getEmployerByUser(@PathVariable int userId) {
        try {
            Map<String, Object> employer = service.getByUserId(userId);
            return ResponseEntity.ok(employer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy NTD với UserID = " + userId));
        }
    }

    // 4️⃣ Tạo mới NTD — tự lấy UserID từ token
    @PostMapping
    public ResponseEntity<?> createEmployer(@RequestBody Map<String, Object> body,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Thiếu hoặc sai token"));
            }

            String token = authHeader.substring(7);
            Integer userId = jwtService.extractUserId(token);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Token không chứa userId"));
            }

            body.put("userID", userId);

            String result = service.createEmployer(body);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 5️⃣ Cập nhật thông tin công ty
    @PutMapping("/{ntdId}")
    public ResponseEntity<?> updateEmployer(@PathVariable int ntdId, @RequestBody Map<String, Object> body) {
        String result = service.updateEmployer(ntdId, body);
        return ResponseEntity.ok(Map.of("message", result));
    }

    // 6️⃣ Upload logo file (multipart/form-data)
    @PostMapping("/upload-logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Chưa chọn tệp logo"));
            }

            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            if (!fileName.matches(".*\\.(png|jpg|jpeg|gif|svg)$")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Chỉ chấp nhận file ảnh (PNG, JPG, JPEG, GIF, SVG)"));
            }

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

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

    // 7️⃣ Gắn link logo vào hồ sơ công ty
    @PatchMapping("/{ntdId}/logo")
    public ResponseEntity<?> updateLogo(@PathVariable int ntdId, @RequestBody Map<String, Object> body) {
        Object link = body.get("logoURL");
        if (link == null || link.toString().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu đường dẫn logo"));
        }

        String result = service.updateLogo(ntdId, link.toString());
        return ResponseEntity.ok(Map.of("message", result));
    }

    // 8️⃣ Xóa NTD
    @DeleteMapping("/{ntdId}")
    public ResponseEntity<?> deleteEmployer(@PathVariable int ntdId) {
        String result = service.deleteEmployer(ntdId);
        return ResponseEntity.ok(Map.of("message", result));
    }
}
