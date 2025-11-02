import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Building2 } from 'lucide-react'; // 🗑️ Xóa icon Eye
import { UserApplication as Application } from '@/types';

import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Applications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  // 🧩 Lấy danh sách ứng tuyển theo User
  const fetchApplications = async () => {
    if (!user) return;

    try {
      // ✅ Đảm bảo backend trả về đúng UngVienID → lấy qua API profile
      const profileResponse = await api.get(`/profile/user/${user.userId}`);
      const ungVienID =
        profileResponse.data.UngVienID ||
        profileResponse.data.ungVienID ||
        profileResponse.data.ungVienId;

      if (!ungVienID) {
        toast.error('Không tìm thấy hồ sơ ứng viên');
        return;
      }

      // ✅ Lấy danh sách ứng tuyển theo UngVienID
      const response = await api.get(`/applications/user/${user.userId}`);


      // Chuẩn hóa dữ liệu (trường trong DB: TinID, TieuDe, TrangThai, NgayNop, GhiChu, TenCongTy)
      const normalized = response.data.map((a: any) => ({
        ungTuyenID: a.UngTuyenID,
        tinID: a.TinID,
        tieuDe: a.TieuDe,
        congTy: a.TenCongTy || 'Không rõ',
        ngayNop: a.NgayNop,
        trangThai: a.TrangThai || 'Đang xem xét',
        ghiChu: a.GhiChu || '',
      }));

      setApplications(normalized);
    } catch (error) {
      console.error('❌ Lỗi tải danh sách ứng tuyển:', error);
      toast.error('Không thể tải danh sách ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Màu trạng thái
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang xem xét':
        return 'default';
      case 'Mời phỏng vấn':
        return 'default';
      case 'Từ chối':
        return 'destructive';
      case 'Trúng tuyển':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Việc đã ứng tuyển</h2>
          <p className="text-muted-foreground">
            Theo dõi trạng thái các đơn ứng tuyển của bạn
          </p>
        </div>

        {applications.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                Bạn chưa ứng tuyển việc làm nào
              </p>
              <Button onClick={() => navigate('/jobs')}>Tìm việc làm</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card
                key={app.ungTuyenID}
                className="shadow-soft transition-shadow hover:shadow-medium"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{app.tieuDe}</CardTitle>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {app.congTy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Nộp ngày:{' '}
                          {new Date(app.ngayNop).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(app.trangThai)}>
                        {app.trangThai}
                      </Badge>
                      {/* 🗑️ Đã xóa icon Eye */}
                    </div>
                  </div>
                </CardHeader>

                {app.ghiChu && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Ghi chú:</span>{' '}
                      {app.ghiChu}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
