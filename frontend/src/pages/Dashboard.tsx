import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, CheckCircle2, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, successApplicants: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.roleId === UserRole.NTD || user?.roleId === UserRole.ADMIN) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get(`/statistics/employer/${user?.userId}`); // Map với backend
      const overview = response.data.overview;
      setStats({
        totalJobs: overview.totalJobs || 0,
        totalApplicants: overview.totalApplicants || 0,
        successApplicants: overview.successApplicants || 0,
        successRate: overview.successRate || 0,
      });
    } catch (error) {
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    switch (user?.roleId) {
      case UserRole.ADMIN: return 'Chào mừng Quản trị viên';
      case UserRole.NTD: return 'Chào mừng Nhà tuyển dụng';
      case UserRole.UNGVIEN: return 'Chào mừng Ứng viên';
      default: return 'Chào mừng';
    }
  };

  const dashboardStats = [
    { title: 'Tin tuyển dụng', value: stats.totalJobs, icon: Briefcase, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Ứng viên', value: stats.totalApplicants, icon: Users, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: 'Trúng tuyển', value: stats.successApplicants, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Tỷ lệ thành công', value: `${stats.successRate}%`, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  ];

  if (loading) {
    return <DashboardLayout><div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">{getWelcomeMessage()}</h2>
          <p className="text-muted-foreground">Xin chào, {user?.fullName}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <Card key={stat.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}><stat.icon className={`h-4 w-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-soft">
          <CardHeader><CardTitle>Hoạt động gần đây</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Chưa có hoạt động nào. Hãy bắt đầu khám phá hệ thống!</p></CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}