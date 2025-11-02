import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Building2, Mail, Phone } from 'lucide-react';
import { Employer } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Employers() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employer | null>(null);
  const [formData, setFormData] = useState({
    tenCongTy: '',
    diaChi: '',
    website: '',
    moTa: '',
    email: '',
    soDienThoai: '',
  });

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      const response = await api.get('/employers');
      setEmployers(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách doanh nghiệp');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editing) {
        await api.put(`/employers/${editing.ntdID}`, formData);
        toast.success('Cập nhật doanh nghiệp thành công!');
      } else {
        await api.post('/employers', formData);
        toast.success('Thêm doanh nghiệp thành công!');
      }
      setOpen(false);
      setEditing(null);
      setFormData({
        tenCongTy: '',
        diaChi: '',
        website: '',
        moTa: '',
        email: '',
        soDienThoai: '',
      });
      fetchEmployers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (employer: Employer) => {
    setEditing(employer);
    setFormData({
      tenCongTy: employer.tenCongTy,
      diaChi: employer.diaChi,
      website: employer.website || '',
      moTa: employer.moTa || '',
      email: employer.email,
      soDienThoai: employer.soDienThoai,
    });
    setOpen(true);
  };

  const handleDelete = async (ntdID: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa doanh nghiệp này?')) return;

    try {
      await api.delete(`/employers/${ntdID}`);
      toast.success('Xóa doanh nghiệp thành công');
      fetchEmployers();
    } catch (error) {
      toast.error('Không thể xóa doanh nghiệp');
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Quản lý doanh nghiệp</h2>
            <p className="text-muted-foreground">
              Tổng số: {employers.length} doanh nghiệp
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditing(null); setFormData({ tenCongTy: '', diaChi: '', website: '', moTa: '', email: '', soDienThoai: '' }); }}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm doanh nghiệp
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editing ? 'Chỉnh sửa doanh nghiệp' : 'Thêm doanh nghiệp mới'}
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin doanh nghiệp
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenCongTy">Tên công ty *</Label>
                  <Input
                    id="tenCongTy"
                    value={formData.tenCongTy}
                    onChange={(e) => setFormData({ ...formData, tenCongTy: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soDienThoai">Số điện thoại *</Label>
                    <Input
                      id="soDienThoai"
                      type="tel"
                      value={formData.soDienThoai}
                      onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diaChi">Địa chỉ *</Label>
                  <Input
                    id="diaChi"
                    value={formData.diaChi}
                    onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moTa">Mô tả</Label>
                  <Textarea
                    id="moTa"
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editing ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employers.map((employer) => (
            <Card key={employer.ntdID} className="shadow-soft">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    {employer.logoURL ? (
                      <img
                        src={employer.logoURL}
                        alt={employer.tenCongTy}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{employer.tenCongTy}</CardTitle>
                      <Badge variant="secondary" className="mt-1">ID: {employer.ntdID}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(employer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employer.ntdID)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{employer.diaChi}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {employer.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {employer.soDienThoai}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
