import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CreateJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ntdId, setNtdId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    TieuDe: '',
    MoTa: '',
    YeuCau: '',
    MucLuong: '',
    DiaDiemLamViec: '',
    LoaiHinhCongViec: '',
    HanNop: '',
    TrangThai: 'Đang hiển thị', // 🟢 mặc định
  });

  useEffect(() => {
    fetchNtdId();
    if (id) fetchJobDetail();
  }, [id]);

  // 🟢 Lấy NTDID của user hiện tại
  const fetchNtdId = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/employers/${user.userId}`);
      console.log('🏢 EMPLOYER:', response.data);
      const employerId = response.data.NTDID || response.data.ntdID;
      setNtdId(employerId);
    } catch {
      toast.error('Không thể tải thông tin nhà tuyển dụng');
    }
  };

  // 🟢 Lấy chi tiết tin khi edit
  const fetchJobDetail = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      console.log('📋 JOB DETAIL:', response.data);
      const d = response.data;
      setFormData({
        TieuDe: d.TieuDe || '',
        MoTa: d.MoTa || '',
        YeuCau: d.YeuCau || '',
        MucLuong: d.MucLuong || '',
        DiaDiemLamViec: d.DiaDiemLamViec || '',
        LoaiHinhCongViec: d.LoaiHinhCongViec || '',
        HanNop: d.HanNop ? d.HanNop.split('T')[0] : '',
        TrangThai: d.TrangThai || 'Đang hiển thị',
      });
    } catch {
      toast.error('Không thể tải thông tin tin tuyển dụng');
      navigate('/jobs/manage');
    }
  };

  // 🟢 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ntdId) {
      toast.error('Không xác định được hồ sơ nhà tuyển dụng');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        NTDID: ntdId,
        ...formData,
      };

      if (id) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Cập nhật tin tuyển dụng thành công!');
      } else {
        await api.post('/jobs', payload);
        toast.success('Đăng tin tuyển dụng thành công!');
      }

      navigate('/jobs/manage');
    } catch (error: any) {
      console.error('❌ Lỗi submit:', error);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/jobs/manage')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>{id ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tiêu đề */}
              <div className="space-y-2">
                <Label htmlFor="TieuDe">Tiêu đề *</Label>
                <Input
                  id="TieuDe"
                  value={formData.TieuDe}
                  onChange={(e) => setFormData({ ...formData, TieuDe: e.target.value })}
                  placeholder="Ví dụ: Nhân viên kinh doanh"
                  required
                />
              </div>

              {/* Địa điểm + Loại hình */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="DiaDiemLamViec">Địa điểm làm việc *</Label>
                  <Input
                    id="DiaDiemLamViec"
                    value={formData.DiaDiemLamViec}
                    onChange={(e) =>
                      setFormData({ ...formData, DiaDiemLamViec: e.target.value })
                    }
                    placeholder="Ví dụ: TP.HCM, Hà Nội..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="LoaiHinhCongViec">Loại hình công việc *</Label>
                  <Select
                    value={formData.LoaiHinhCongViec}
                    onValueChange={(value) =>
                      setFormData({ ...formData, LoaiHinhCongViec: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toàn thời gian">Toàn thời gian</SelectItem>
                      <SelectItem value="Bán thời gian">Bán thời gian</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="Thực tập">Thực tập</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mức lương + Hạn nộp */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="MucLuong">Mức lương *</Label>
                  <Input
                    id="MucLuong"
                    value={formData.MucLuong}
                    onChange={(e) => setFormData({ ...formData, MucLuong: e.target.value })}
                    placeholder="Ví dụ: 10-15 triệu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="HanNop">Hạn nộp hồ sơ *</Label>
                  <Input
                    id="HanNop"
                    type="date"
                    value={formData.HanNop}
                    onChange={(e) => setFormData({ ...formData, HanNop: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="MoTa">Mô tả công việc *</Label>
                <Textarea
                  id="MoTa"
                  value={formData.MoTa}
                  onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                  placeholder="Mô tả chi tiết công việc..."
                  rows={5}
                  required
                />
              </div>

              {/* Yêu cầu */}
              <div className="space-y-2">
                <Label htmlFor="YeuCau">Yêu cầu ứng viên *</Label>
                <Textarea
                  id="YeuCau"
                  value={formData.YeuCau}
                  onChange={(e) => setFormData({ ...formData, YeuCau: e.target.value })}
                  placeholder="Nhập yêu cầu kỹ năng, kinh nghiệm..."
                  rows={5}
                  required
                />
              </div>

              {/* 🟢 Trạng thái */}
              <div className="space-y-2">
                <Label htmlFor="TrangThai">Trạng thái tin *</Label>
                <Select
                  value={formData.TrangThai}
                  onValueChange={(value) => setFormData({ ...formData, TrangThai: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang hiển thị">Đang hiển thị</SelectItem>
                    <SelectItem value="Tạm ẩn">Tạm ẩn</SelectItem>
                    <SelectItem value="Đã hết hạn">Đã hết hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nút hành động */}
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang xử lý...' : id ? 'Cập nhật tin' : 'Đăng tin mới'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/jobs/manage')}>
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
