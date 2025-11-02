import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Calendar, Mail, Paperclip } from "lucide-react";
import { EmployerApplication as Application } from "@/types";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Applicants() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    } else {
      // ✅ Nếu không có jobId thì ngừng loading (tránh xoay mãi)
      setLoading(false);
    }
  }, [jobId]);

  // 🧩 Gọi API lấy danh sách ứng viên theo tin tuyển dụng
  const fetchApplicants = async () => {
    if (!jobId) return;

    try {
      console.log("🔍 Fetching applicants for jobId:", jobId);
      const response = await api.get(`/applications/job/${jobId}`);
      console.log("✅ API Response:", response.data);

      // Chuẩn hóa dữ liệu đúng với BE
      const normalized = response.data.map((a: any) => ({
        ungTuyenID: a.UngTuyenID,
        ungVienID: a.UngVienID,
        hoTen: a.HoTen || `Ứng viên #${a.UngVienID}`,
        email: a.Email || "",
        cvLink: a.CVLink || "",
        trangThai: a.TrangThai || "Đang xem xét",
        ngayUngTuyen: a.NgayUngTuyen,
        ghiChu: a.GhiChu || "",
      }));

      setApplicants(normalized);
    } catch (error: any) {
      console.error("❌ Lỗi tải danh sách ứng viên:", error);
      toast.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Cập nhật trạng thái hồ sơ (NTD duyệt)
  const handleStatusChange = async (ungTuyenID: number, trangThai: string) => {
    try {
      await api.put(`/applications/${ungTuyenID}`, { trangThai });
      toast.success("Cập nhật trạng thái thành công");
      fetchApplicants();
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // 🎨 Màu của badge theo trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang xem xét":
        return "default";
      case "Mời phỏng vấn":
        return "default";
      case "Từ chối":
        return "destructive";
      case "Trúng tuyển":
        return "default";
      case "Đã nộp":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // 🌀 Loading spinner
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  // 🚫 Khi không có jobId trong URL
  if (!jobId) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Vui lòng chọn một tin tuyển dụng để xem danh sách ứng viên.
          </p>
          <Button onClick={() => (window.location.href = "/jobs")}>
            Quay lại danh sách tin tuyển dụng
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // ✅ Giao diện chính
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Danh sách ứng viên</h2>
          <p className="text-muted-foreground">
            Tổng số: {applicants.length} ứng viên
          </p>
        </div>

        {applicants.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Chưa có ứng viên nào nộp hồ sơ cho tin này
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <Card key={app.ungTuyenID} className="shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    {/* 👤 Thông tin ứng viên */}
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold">
                          {app.hoTen}
                        </CardTitle>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {app.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {app.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Nộp:{" "}
                            {new Date(app.ngayUngTuyen).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
{app.cvLink && (
  <span className="flex items-center gap-1">
    <Paperclip className="h-4 w-4" />
    <a
      href={`http://localhost:8080${app.cvLink.startsWith('/') ? app.cvLink : '/' + app.cvLink}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      Xem CV
    </a>
  </span>
)}

                        </div>
                        {app.ghiChu && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            <span className="font-medium">Ghi chú:</span>{" "}
                            {app.ghiChu}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 🏷️ Trạng thái */}
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant={getStatusColor(app.trangThai)}>
                        {app.trangThai}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* ⚙️ Cập nhật trạng thái */}
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Select
                      value={app.trangThai}
                      onValueChange={(value) =>
                        handleStatusChange(app.ungTuyenID, value)
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Cập nhật trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đã nộp">Đã nộp</SelectItem>
                        <SelectItem value="Đang xem xét">
                          Đang xem xét
                        </SelectItem>
                        <SelectItem value="Mời phỏng vấn">
                          Mời phỏng vấn
                        </SelectItem>
                        <SelectItem value="Từ chối">Từ chối</SelectItem>
                        <SelectItem value="Trúng tuyển">Trúng tuyển</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `/interviews/create?ungTuyenID=${app.ungTuyenID}`)
                      }
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Gửi thư mời
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
