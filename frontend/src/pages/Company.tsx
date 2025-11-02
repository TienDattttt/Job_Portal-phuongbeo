import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Building2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Company() {
  const { user } = useAuth();
  const [employer, setEmployer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    TenCongTy: '',
    MaSoThue: '',
    DiaChi: '',
    LinhVuc: '',
    Website: '',
    MoTa: '',
  });

  useEffect(() => {
    fetchEmployer();
  }, []);

  // 🟢 Lấy thông tin hồ sơ công ty
  const fetchEmployer = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/employers/${user.userId}`);
      setEmployer(response.data);
      setFormData({
        TenCongTy: response.data.TenCongTy || '',
        MaSoThue: response.data.MaSoThue || '',
        DiaChi: response.data.DiaChi || '',
        LinhVuc: response.data.LinhVuc || '',
        Website: response.data.Website || '',
        MoTa: response.data.MoTa || '',
      });
    } catch {
      toast.error('Không thể tải thông tin công ty');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Lưu thông tin công ty
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!employer || !employer.NTDID) {
        // Nếu chưa có hồ sơ -> tạo mới
        await api.post('/employers', {
          UserID: user?.userId,
          ...formData,
        });
        toast.success('Đã tạo hồ sơ công ty thành công!');
      } else {
        // Đã có -> cập nhật
        await api.put(`/employers/${employer.NTDID}`, formData);
        toast.success('Đã cập nhật thông tin công ty!');
      }
      fetchEmployer();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  // 🟢 Upload logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employer) return;

    const formDataFile = new FormData();
    formDataFile.append('file', file);

    setUploading(true);
    try {
      const response = await api.post('/employers/upload-logo', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await api.patch(`/employers/${employer.NTDID}/logo`, {
        logoURL: response.data.logoURL,
      });

      toast.success('Cập nhật logo thành công!');
      fetchEmployer();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Tải logo thất bại');
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
          <h2 className="text-3xl font-bold">Thông tin công ty</h2>
          <p className="text-muted-foreground">
            Quản lý thông tin doanh nghiệp của bạn
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 🏢 Form thông tin công ty */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Thông tin chung</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="TenCongTy">Tên công ty *</Label>
                    <Input
                      id="TenCongTy"
                      value={formData.TenCongTy}
                      onChange={(e) =>
                        setFormData({ ...formData, TenCongTy: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="MaSoThue">Mã số thuế</Label>
                      <Input
                        id="MaSoThue"
                        value={formData.MaSoThue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            MaSoThue: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="LinhVuc">Lĩnh vực hoạt động</Label>
                      <Input
                        id="LinhVuc"
                        value={formData.LinhVuc}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            LinhVuc: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="DiaChi">Địa chỉ *</Label>
                    <Input
                      id="DiaChi"
                      value={formData.DiaChi}
                      onChange={(e) =>
                        setFormData({ ...formData, DiaChi: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Website">Website</Label>
                    <Input
                      id="Website"
                      type="url"
                      value={formData.Website}
                      onChange={(e) =>
                        setFormData({ ...formData, Website: e.target.value })
                      }
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="MoTa">Mô tả công ty</Label>
                    <Textarea
                      id="MoTa"
                      value={formData.MoTa}
                      onChange={(e) =>
                        setFormData({ ...formData, MoTa: e.target.value })
                      }
                      placeholder="Giới thiệu về công ty..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving
                      ? 'Đang lưu...'
                      : employer?.NTDID
                      ? 'Cập nhật thông tin'
                      : 'Tạo hồ sơ mới'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 🖼️ Logo công ty */}
          <div>
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Logo công ty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  {employer?.LogoURL ? (
                    <img
                      src={employer.LogoURL}
                      alt={employer.TenCongTy}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      document.getElementById('logo-upload')?.click()
                    }
                    disabled={uploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading
                      ? 'Đang tải lên...'
                      : employer?.LogoURL
                      ? 'Cập nhật logo'
                      : 'Tải lên logo'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chỉ chấp nhận file JPG, PNG. Kích thước tối đa 2MB.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
