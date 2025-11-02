import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    diaChi: '',
    ngaySinh: '',
    gioiTinh: '',
    hocVan: '',
    kyNang: '',
    kinhNghiem: '',
    moTaBanThan: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/profile/user/${user.userId}`);
      const data = response.data;
      console.log('📄 Profile API response:', data);

      const normalized = {
        ungVienID: data.ungVienID ?? data.UngVienID,
        hoTen: data.FullName ?? data.hoTen ?? '',
        email: data.Email ?? '',
        soDienThoai: data.Phone ?? '',
        diaChi: data.DiaChi ?? '',
        ngaySinh: data.NgaySinh ?? '',
        gioiTinh: data.GioiTinh ?? '',
        hocVan: data.HocVan ?? '',
        kyNang: data.KyNang ?? '',
        kinhNghiem: data.KinhNghiem ?? '',
        moTaBanThan: data.MoTaBanThan ?? '',
        cvLink: data.CVLink ?? '',
      };

      setProfile(normalized);
      setFormData({
        hoTen: normalized.hoTen,
        email: normalized.email,
        soDienThoai: normalized.soDienThoai,
        diaChi: normalized.diaChi,
        ngaySinh: normalized.ngaySinh,
        gioiTinh: normalized.gioiTinh,
        hocVan: normalized.hocVan,
        kyNang: normalized.kyNang,
        kinhNghiem: normalized.kinhNghiem,
        moTaBanThan: normalized.moTaBanThan,
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('🟡 Người dùng chưa có hồ sơ — sẽ tạo mới khi lưu');
      } else {
        toast.error('Không thể tải thông tin hồ sơ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      if (profile?.ungVienID) {
        await api.put(`/profile/${profile.ungVienID}`, {
          ...formData,
          userId: user.userId,
        });
        toast.success('✅ Cập nhật hồ sơ thành công!');
      } else {
        await api.post('/profile', {
          ...formData,
          userId: user.userId,
        });
        toast.success('🆕 Tạo hồ sơ thành công!');
        fetchProfile();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lưu hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!profile?.ungVienID) {
      toast.error('Vui lòng lưu hồ sơ trước khi tải CV!');
      return;
    }

    const form = new FormData();
    form.append('file', file);

    setUploading(true);
    try {
      const response = await api.post('/profile/upload-cv', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const cvLink = response.data.cvLink;

      await api.patch(`/profile/${profile.ungVienID}/cv`, { cvLink });
      toast.success('📄 Tải CV thành công!');
      fetchProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Tải CV thất bại');
    } finally {
      setUploading(false);
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
          <h2 className="text-3xl font-bold">Hồ sơ ứng viên</h2>
          <p className="text-muted-foreground">Cập nhật đầy đủ thông tin cá nhân và kỹ năng của bạn</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* --- Họ tên, email, SĐT --- */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Họ và tên *</Label>
                      <Input
                        value={formData.hoTen}
                        onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={formData.email} disabled />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Số điện thoại *</Label>
                    <Input
                      type="tel"
                      value={formData.soDienThoai}
                      onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                      required
                    />
                  </div>

                  {/* --- Địa chỉ & Ngày sinh --- */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Địa chỉ</Label>
                      <Input
                        value={formData.diaChi}
                        onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ngày sinh</Label>
                      <Input
                        type="date"
                        value={formData.ngaySinh || ''}
                        onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* --- Giới tính --- */}
                  <div className="space-y-2">
                    <Label>Giới tính</Label>
                    <Select
                      value={formData.gioiTinh}
                      onValueChange={(value) => setFormData({ ...formData, gioiTinh: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nam">Nam</SelectItem>
                        <SelectItem value="Nữ">Nữ</SelectItem>
                        <SelectItem value="Khác">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* --- Học vấn, Kinh nghiệm, Kỹ năng --- */}
                  <div className="space-y-2">
                    <Label>Học vấn</Label>
                    <Textarea
                      placeholder="Ví dụ: Cử nhân CNTT - Đại học Tài nguyên & Môi trường TP.HCM"
                      value={formData.hocVan}
                      onChange={(e) => setFormData({ ...formData, hocVan: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Kinh nghiệm làm việc</Label>
                    <Textarea
                      placeholder="Ví dụ: 2 năm kinh nghiệm tại Công ty ABC..."
                      value={formData.kinhNghiem}
                      onChange={(e) => setFormData({ ...formData, kinhNghiem: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Kỹ năng chuyên môn</Label>
                    <Textarea
                      placeholder="Ví dụ: Java, Spring Boot, ReactJS, SQL, GIT..."
                      value={formData.kyNang}
                      onChange={(e) => setFormData({ ...formData, kyNang: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mô tả bản thân</Label>
                    <Textarea
                      placeholder="Giới thiệu ngắn gọn về bạn..."
                      value={formData.moTaBanThan}
                      onChange={(e) => setFormData({ ...formData, moTaBanThan: e.target.value })}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? 'Đang lưu...' : profile ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* --- Cột CV --- */}
          <div>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>CV của bạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.cvLink ? (
                  <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">CV đã tải lên</p>
                      <a
  href={`http://localhost:8080${profile.cvLink}`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs text-primary hover:underline"
>
  Xem CV
</a>

                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Chưa có CV</p>
                )}
                <div>
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('cv-upload')?.click()}
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Đang tải lên...' : profile?.cvLink ? 'Cập nhật CV' : 'Tải lên CV'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chỉ chấp nhận file PDF, DOC, DOCX. Dung lượng tối đa 5MB.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
