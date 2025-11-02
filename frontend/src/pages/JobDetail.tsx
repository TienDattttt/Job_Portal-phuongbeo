import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  MapPin,
  Briefcase,
  Calendar,
  Building2,
  DollarSign,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [ghiChu, setGhiChu] = useState('');
  const [applying, setApplying] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  // 🧩 Lấy chi tiết tin tuyển dụng
  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/jobs/${id}`);
      const j = response.data;

      const normalizedJob = {
        tinID: j.TinID,
        tieuDe: j.TieuDe,
        congTy: j.TenCongTy,
        diaDiem: j.DiaDiemLamViec,
        mucLuong: j.MucLuong,
        loaiHinh: j.LoaiHinhCongViec || 'Không rõ',
        hanNop: j.HanNop,
        logoURL: j.LogoURL,
        moTa: j.MoTa,
        yeuCau: j.YeuCau || 'Không có yêu cầu cụ thể',
      };

      setJob(normalizedJob);
    } catch (error) {
      toast.error('Không thể tải thông tin việc làm');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Ứng viên nộp hồ sơ
  const handleApply = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập trước khi nộp hồ sơ');
      return;
    }

    setApplying(true);
    try {
      // ✅ Lấy đúng key có U hoa
      const profileResponse = await api.get(`/profile/user/${user.userId}`);
      const ungVienID =
        profileResponse.data.UngVienID ||
        profileResponse.data.ungVienID ||
        profileResponse.data.ungVienId;

      console.log('📄 Hồ sơ ứng viên:', profileResponse.data);
      console.log('📤 Gửi ứng tuyển với UngVienID =', ungVienID);

      if (!ungVienID) {
        toast.error('Không tìm thấy hồ sơ ứng viên');
        setApplying(false);
        return;
      }

      await api.post('/applications', {
        ungVienID,
        tinID: parseInt(id!),
        ghiChu,
      });

      toast.success('🎉 Nộp hồ sơ thành công!');
      setOpen(false);
      setGhiChu('');
    } catch (error: any) {
      console.error('❌ Lỗi nộp hồ sơ:', error);
      toast.error(error.response?.data?.message || 'Nộp hồ sơ thất bại');
    } finally {
      setApplying(false);
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

  if (!job) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/jobs')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                {job.logoURL && (
                  <img
                    src={job.logoURL}
                    alt={job.congTy}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-3xl">{job.tieuDe}</CardTitle>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {job.congTy}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {job.diaDiem}
                    </span>
                  </div>
                </div>
              </div>

              {/* 🔘 Nút Nộp hồ sơ */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Nộp hồ sơ
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nộp hồ sơ ứng tuyển</DialogTitle>
                    <DialogDescription>
                      Bạn đang ứng tuyển cho vị trí: {job.tieuDe}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Ghi chú (không bắt buộc)
                      </label>
                      <Textarea
                        placeholder="Thêm ghi chú cho nhà tuyển dụng..."
                        value={ghiChu}
                        onChange={(e) => setGhiChu(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      onClick={handleApply}
                      disabled={applying}
                      className="w-full"
                    >
                      {applying ? 'Đang gửi...' : 'Xác nhận nộp hồ sơ'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 🏷️ Thông tin nhanh */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm">
                <Briefcase className="mr-1 h-4 w-4" />
                {job.loaiHinh}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <DollarSign className="mr-1 h-4 w-4" />
                {job.mucLuong}
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Calendar className="mr-1 h-4 w-4" />
                Hạn nộp: {new Date(job.hanNop).toLocaleDateString('vi-VN')}
              </Badge>
            </div>

            <Separator />

            {/* 📝 Mô tả công việc */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">Mô tả công việc</h3>
              <div className="whitespace-pre-wrap text-muted-foreground">
                {job.moTa}
              </div>
            </div>

            <Separator />

            {/* 🧠 Yêu cầu ứng viên */}
            <div>
              <h3 className="mb-3 text-xl font-semibold">Yêu cầu ứng viên</h3>
              <div className="whitespace-pre-wrap text-muted-foreground">
                {job.yeuCau}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
