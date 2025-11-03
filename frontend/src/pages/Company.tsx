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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        UserID: user?.userId,
        TenCongTy: formData.TenCongTy || employer?.TenCongTy,
        MaSoThue: formData.MaSoThue,
        DiaChi: formData.DiaChi || employer?.DiaChi,
        LinhVuc: formData.LinhVuc,
        Website: formData.Website,
        MoTa: formData.MoTa,
      };

      if (!employer?.NTDID) {
        await api.post('/employers', payload);
        toast.success('Đã tạo hồ sơ công ty!');
      } else {
        await api.put(`/employers/${employer.NTDID}`, payload);
        toast.success('Đã cập nhật thông tin công ty!');
      }

      fetchEmployer();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employer) return;

    const formDataFile = new FormData();
    formDataFile.append('file', file);

    setUploading(true);
    try {
      const res = await api.post('/employers/upload-logo', formDataFile, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await api.patch(`/employers/${employer.NTDID}/logo`, {
        LogoURL: res.data.logoURL,
      });

      toast.success('Logo đã được cập nhật!');
      fetchEmployer();
    } catch {
      toast.error('Tải logo thất bại');
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
          <p className="text-muted-foreground">Quản lý thông tin doanh nghiệp của bạn</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          
          <div className="lg:col-span-2">
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Thông tin chung</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="space-y-2">
                    <Label>Tên công ty *</Label>
                    <Input
                      value={formData.TenCongTy}
                      onChange={(e) => setFormData({ ...formData, TenCongTy: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">

                    <div className="space-y-2">
                      <Label>Mã số thuế</Label>
                      <Input
                        value={formData.MaSoThue}
                        onChange={(e) => setFormData({ ...formData, MaSoThue: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lĩnh vực</Label>
                      <Input
                        value={formData.LinhVuc}
                        onChange={(e) => setFormData({ ...formData, LinhVuc: e.target.value })}
                      />
                    </div>

                  </div>

                  <div className="space-y-2">
                    <Label>Địa chỉ *</Label>
                    <Input
                      value={formData.DiaChi}
                      onChange={(e) => setFormData({ ...formData, DiaChi: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={formData.Website}
                      onChange={(e) => setFormData({ ...formData, Website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Textarea
                      value={formData.MoTa}
                      onChange={(e) => setFormData({ ...formData, MoTa: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? 'Đang lưu...' : employer?.NTDID ? 'Cập nhật' : 'Tạo hồ sơ'}
                  </Button>

                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="shadow-soft">
              <CardHeader><CardTitle>Logo công ty</CardTitle></CardHeader>
              <CardContent className="space-y-4">

                <div className="flex justify-center">
                  {employer?.LogoURL ? (
                    <img src={employer.LogoURL} className="h-32 w-32 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center bg-muted rounded-lg">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />

                <Button variant="outline" className="w-full" onClick={() => document.getElementById('logo-upload')?.click()} disabled={uploading}>
                  <Upload className="mr-2 h-4 w-4"/>
                  {uploading ? 'Đang tải...' : employer?.LogoURL ? 'Đổi logo' : 'Tải logo'}
                </Button>

                <p className="text-xs text-muted-foreground">Hỗ trợ JPG, PNG. Tối đa 2MB.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
