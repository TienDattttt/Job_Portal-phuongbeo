import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Mail, Clock, ArrowLeft } from 'lucide-react';
import { Interview } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Interviews() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ungTuyenID = searchParams.get('ungTuyenID');
  const { user } = useAuth();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [ntdId, setNtdId] = useState<number | null>(null);
  const [creating, setCreating] = useState(!!ungTuyenID);
  const [formData, setFormData] = useState({
    ungTuyenID: ungTuyenID || '',
    ngayHen: '',
    diaDiem: '',
    nguoiPhongVan: '',
    noiDungThu: '',
    emailUngVien: '',
  });

  // 🔹 Lấy ID Nhà tuyển dụng theo UserID
  useEffect(() => {
    fetchNtdId();
  }, []);

  // 🔹 Khi có NTDID thì tải danh sách phỏng vấn
  useEffect(() => {
    if (ntdId && !creating) {
      fetchInterviews();
    }
  }, [ntdId, creating]);

  // 🧩 Lấy thông tin NTD theo UserID
  const fetchNtdId = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/employers/${user.userId}`);
      const data = response.data;

      const id = data.NTDID || data.ntdID || data.id || null;
      if (id) {
        setNtdId(id);
        console.log('✅ Lấy được NTDID:', id);
      } else {
        console.error('❌ Không tìm thấy NTDID:', data);
        toast.error('Không tìm thấy mã NTD trong dữ liệu trả về');
      }
    } catch (error: any) {
      console.error('❌ Lỗi khi tải thông tin NTD:', error);
      if (error.response?.status === 403) {
        toast.error('Tài khoản của bạn không có quyền truy cập thông tin NTD');
      } else {
        toast.error('Không thể tải thông tin nhà tuyển dụng');
      }
    }
  };

  // 🧩 Tải danh sách lịch phỏng vấn
  const fetchInterviews = async () => {
    if (!ntdId) return;
    try {
      const response = await api.get(`/interviews/by-employer/${ntdId}`);

      // 🔹 Chuẩn hóa dữ liệu đúng field trong DB
      const normalized = response.data.map((row: any, index: number) => ({
        lichHenID: row.LichHenID,
        ungTuyenID: row.UngTuyenID,
        ngayHen: row.NgayHen,
        diaDiem: row.DiaDiem,
        nguoiPhongVan: row.NguoiPhongVan,
        noiDungThu: row.NoiDungThu,
        trangThai: row.TrangThai,
        ngayGuiThu: row.NgayGuiThu,
        emailUngVien: row.EmailUngVien,
      }));

      setInterviews(normalized);
    } catch (error) {
      console.error('❌ Lỗi khi tải danh sách phỏng vấn:', error);
      toast.error('Không thể tải danh sách lịch phỏng vấn');
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Gửi thư mời phỏng vấn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/interviews/send', {
        ...formData,
        ungTuyenID: parseInt(formData.ungTuyenID),
      });
      toast.success('🎉 Gửi thư mời phỏng vấn thành công!');
      setCreating(false);
      setFormData({
        ungTuyenID: '',
        ngayHen: '',
        diaDiem: '',
        nguoiPhongVan: '',
        noiDungThu: '',
        emailUngVien: '',
      });
      fetchInterviews();
    } catch (error: any) {
      console.error('❌ Lỗi khi gửi thư mời:', error);
      toast.error(error.response?.data?.message || 'Gửi thư mời thất bại');
    }
  };

  // 🧩 Cập nhật trạng thái thư mời
  const handleStatusChange = async (lichHenID: number, trangThai: string) => {
    try {
      await api.put(`/interviews/${lichHenID}`, { trangThai });
      toast.success('✅ Cập nhật trạng thái thành công');
      fetchInterviews();
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
      toast.error('Không thể cập nhật trạng thái lịch hẹn');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'secondary';
      case 'Đồng ý':
        return 'default';
      case 'Từ chối':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading && !creating) {
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
        {creating ? (
          <>
            <Button variant="ghost" onClick={() => setCreating(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Gửi thư mời phỏng vấn</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ungTuyenID">Mã ứng tuyển *</Label>
                      <Input
                        id="ungTuyenID"
                        type="number"
                        value={formData.ungTuyenID}
                        onChange={(e) =>
                          setFormData({ ...formData, ungTuyenID: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emailUngVien">Email ứng viên *</Label>
                      <Input
                        id="emailUngVien"
                        type="email"
                        value={formData.emailUngVien}
                        onChange={(e) =>
                          setFormData({ ...formData, emailUngVien: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ngayHen">Ngày và giờ hẹn *</Label>
                      <Input
                        id="ngayHen"
                        type="datetime-local"
                        value={formData.ngayHen}
                        onChange={(e) =>
                          setFormData({ ...formData, ngayHen: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diaDiem">Địa điểm *</Label>
                      <Input
                        id="diaDiem"
                        value={formData.diaDiem}
                        onChange={(e) =>
                          setFormData({ ...formData, diaDiem: e.target.value })
                        }
                        placeholder="Ví dụ: Phòng họp A, tầng 5"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nguoiPhongVan">Người phỏng vấn *</Label>
                    <Input
                      id="nguoiPhongVan"
                      value={formData.nguoiPhongVan}
                      onChange={(e) =>
                        setFormData({ ...formData, nguoiPhongVan: e.target.value })
                      }
                      placeholder="Ví dụ: Nguyễn Văn A - Trưởng phòng nhân sự"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noiDungThu">Nội dung thư *</Label>
                    <Textarea
                      id="noiDungThu"
                      value={formData.noiDungThu}
                      onChange={(e) =>
                        setFormData({ ...formData, noiDungThu: e.target.value })
                      }
                      placeholder="Nhập nội dung thư mời phỏng vấn..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Gửi thư mời</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreating(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Lịch phỏng vấn</h2>
                <p className="text-muted-foreground">
                  Tổng số: {interviews.length} lịch hẹn
                </p>
              </div>
              <Button onClick={() => setCreating(true)}>Tạo lịch hẹn mới</Button>
            </div>

            {interviews.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Chưa có lịch phỏng vấn nào</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {interviews.map((interview, index) => (
                  <Card key={`lichhen-${interview.lichHenID || index}`} className="shadow-soft">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              Phỏng vấn ứng viên #{interview.ungTuyenID}
                            </CardTitle>
                            <Badge variant={getStatusColor(interview.trangThai)}>
                              {interview.trangThai}
                            </Badge>
                          </div>

                          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(interview.ngayHen).toLocaleString('vi-VN')}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {interview.diaDiem}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {interview.nguoiPhongVan}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {interview.emailUngVien}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Gửi lúc: {new Date(interview.ngayGuiThu).toLocaleString('vi-VN')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Nội dung:</span> {interview.noiDungThu}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
