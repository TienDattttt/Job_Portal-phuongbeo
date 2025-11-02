import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Briefcase, Users, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

export default function Statistics() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null); // Từ backend: {overview, monthly}
  const [loading, setLoading] = useState(true);
  const [ntdId, setNtdId] = useState<number | null>(null);

  useEffect(() => {
    fetchNtdId();
  }, [user]);

  const fetchNtdId = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/employers/${user.userId}`); // Sửa để lấy ntdId đúng
      setNtdId(response.data.ntdID);
    } catch (error) {
      toast.error('Không thể tải thông tin nhà tuyển dụng');
    }
  };

  useEffect(() => {
    if (ntdId) {
      fetchStatistics();
    }
  }, [ntdId]);

  const fetchStatistics = async () => {
    try {
      const response = await api.get(`/statistics/employer/${ntdId}`);
      setStats(response.data);
    } catch (error) {
      toast.error('Không thể tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardLayout><div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></DashboardLayout>;
  }

  const summaryStats = [
    { title: 'Tổng tin tuyển dụng', value: stats?.overview?.totalJobs || 0, icon: Briefcase, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Tổng ứng viên', value: stats?.overview?.totalApplicants || 0, icon: Users, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: 'Trúng tuyển', value: stats?.overview?.successApplicants || 0, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Tỷ lệ thành công', value: `${stats?.overview?.successRate || 0}%`, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  ];

  const monthlyData = stats?.monthly?.map((item: any) => ({ name: `Tháng ${item.month}`, value: item.applications })) || [];
  const pieData = stats?.overview?.statusDistribution?.map((item: any) => ({ name: item.status, value: item.count })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Báo cáo thống kê</h2>
          <p className="text-muted-foreground">Phân tích hiệu quả tuyển dụng</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <Card key={stat.title} className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`rounded-full p-2 ${stat.bgColor}`}><stat.icon className={`h-4 w-4 ${stat.color}`} /></div>
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-soft">
            <CardHeader><CardTitle>Ứng tuyển theo tháng</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle>Phân bố trạng thái</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                    {pieData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}