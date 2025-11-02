import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ManageJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ntdId, setNtdId] = useState<number | null>(null);

  console.log('👤 USER:', user);

  // ✅ Lấy thông tin NTD khi load trang
  useEffect(() => {
    fetchNtdId();
  }, []);

  // ✅ Khi có ntdId → gọi danh sách tin
  useEffect(() => {
    if (ntdId) fetchJobs();
    else setLoading(false);
  }, [ntdId]);

  // 🟢 Lấy NTDID theo UserID
  const fetchNtdId = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/employers/${user.userId}`);
      console.log('🏢 EMPLOYER:', response.data);

      // hỗ trợ cả NTDID hoặc ntdID
      const employerId = response.data.NTDID || response.data.ntdID;
      if (employerId) {
        console.log('🆔 Đã lấy được NTDID =', employerId);
        setNtdId(employerId);
      } else {
        toast.warning('Bạn chưa có hồ sơ công ty');
        setNtdId(null);
      }
    } catch (error) {
      console.error('❌ Lỗi fetchNtdId:', error);
      toast.error('Không thể tải thông tin nhà tuyển dụng');
      setNtdId(null);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Lấy danh sách tin tuyển dụng
  const fetchJobs = async () => {
    if (!ntdId) return;

    try {
      const response = await api.get(`/jobs/employer/${ntdId}`);
      console.log('📋 JOBS:', response.data);
      setJobs(response.data);
    } catch (error) {
      console.error('❌ Lỗi fetchJobs:', error);
      toast.error('Không thể tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Xóa tin
  const handleDelete = async (tinId: number) => {
    try {
      await api.delete(`/jobs/${tinId}`);
      toast.success('Xóa tin tuyển dụng thành công');
      fetchJobs();
    } catch {
      toast.error('Không thể xóa tin tuyển dụng');
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
            <h2 className="text-3xl font-bold">Quản lý tin tuyển dụng</h2>
            <p className="text-muted-foreground">
              Tổng số: {jobs.length} tin tuyển dụng
            </p>
          </div>
          <Button onClick={() => navigate('/jobs/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Đăng tin mới
          </Button>
        </div>

        {jobs.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                {ntdId
                  ? 'Bạn chưa đăng tin tuyển dụng nào'
                  : 'Bạn chưa có hồ sơ công ty để đăng tin'}
              </p>
              {ntdId ? (
                <Button onClick={() => navigate('/jobs/create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Đăng tin đầu tiên
                </Button>
              ) : (
                <Button onClick={() => navigate('/company')}>
                  Tạo hồ sơ công ty
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <Card key={job.TinID || index} className="shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.TieuDe}</CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          {job.LoaiHinhCongViec}
                        </Badge>
                        <Badge variant="outline">{job.MucLuong}</Badge>
                        <Badge variant="outline">
                          Hạn: {new Date(job.HanNop).toLocaleDateString('vi-VN')}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          navigate(`/applicants?jobId=${job.TinID}`)
                        }
                      >
                        <Users className="h-4 w-4" />
                      </Button>

                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/jobs/${job.TinID}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button> */}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/jobs/edit/${job.TinID}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa tin tuyển dụng "
                              {job.TieuDe}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(job.TinID)}
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
