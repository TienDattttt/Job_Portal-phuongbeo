import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Briefcase, Calendar, Building2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [diaDiem, setDiaDiem] = useState('');
  const [loaiHinh, setLoaiHinh] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const effectiveLoaiHinh = loaiHinh === 'all' ? '' : loaiHinh;
      const response = await api.get('/jobs', {
        params: { keyword, diaDiem, loaiHinh: effectiveLoaiHinh, page, size: 10 },
      });

      const data = response.data;

      const normalizedJobs = (data.items || []).map((j: any) => ({
        tinID: j.TinID,
        tieuDe: j.TieuDe,
        congTy: j.TenCongTy,
        diaDiem: j.DiaDiemLamViec,
        mucLuong: j.MucLuong,
        loaiHinh: j.LoaiHinhCongViec || 'Không rõ',
        hanNop: j.HanNop,
        logoURL: j.LogoURL,
        moTa: j.MoTa,
      }));

      setJobs(normalizedJobs);
      setTotalPages(Math.ceil((data.count || 1) / (data.size || 10)));
    } catch (error) {
      toast.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Tìm việc làm</h2>
          <p className="text-muted-foreground">Khám phá cơ hội nghề nghiệp phù hợp với bạn</p>
        </div>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm theo từ khóa..."
                    className="pl-9"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Địa điểm"
                    className="pl-9"
                    value={diaDiem}
                    onChange={(e) => setDiaDiem(e.target.value)}
                  />
                </div>
                <Select value={loaiHinh} onValueChange={setLoaiHinh}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Toàn thời gian">Toàn thời gian</SelectItem>
                    <SelectItem value="Bán thời gian">Bán thời gian</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Thực tập">Thực tập</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full md:w-auto">
                <Search className="mr-2 h-4 w-4" />
                Tìm kiếm
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Không tìm thấy việc làm phù hợp</p>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <Card
                  key={`job-${job.tinID}`}
                  className="cursor-pointer shadow-soft transition-shadow hover:shadow-medium"
                  onClick={() => navigate(`/jobs/${job.tinID}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {job.logoURL && (
                          <img
                            src={job.logoURL}
                            alt={job.congTy}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <CardTitle className="text-xl">{job.tieuDe}</CardTitle>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {job.congTy}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.diaDiem}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Hạn nộp: {new Date(job.hanNop).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        <Briefcase className="mr-1 h-3 w-3" />
                        {job.loaiHinh}
                      </Badge>
                      <Badge variant="outline">{job.mucLuong}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {jobs.length > 0 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trang trước
            </Button>
            <span className="self-center text-sm text-muted-foreground">
              Trang {page}/{totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Trang sau
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
