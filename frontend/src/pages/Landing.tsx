import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Tìm kiếm thông minh',
      description: 'Hệ thống lọc việc làm theo địa điểm, lĩnh vực, và mức lương',
    },
    {
      icon: Briefcase,
      title: 'Quản lý tuyển dụng',
      description: 'Công cụ toàn diện cho nhà tuyển dụng đăng tin và quản lý ứng viên',
    },
    {
      icon: Users,
      title: 'Kết nối nhanh chóng',
      description: 'Kết nối trực tiếp giữa ứng viên và nhà tuyển dụng',
    },
    {
      icon: TrendingUp,
      title: 'Thống kê chi tiết',
      description: 'Báo cáo và phân tích dữ liệu tuyển dụng chuyên sâu',
    },
  ];

  const benefits = [
    'Hồ sơ ứng viên chuyên nghiệp',
    'Thông báo việc làm phù hợp',
    'Lịch phỏng vấn tự động',
    'Bảo mật thông tin tuyệt đối',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">RecruitHub</h1>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>
                Trang chủ
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Đăng nhập
                </Button>
                <Button onClick={() => navigate('/register')}>Đăng ký</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl font-bold leading-tight">
              Nền tảng tuyển dụng
              <br />
              <span className="text-white/90">hàng đầu Việt Nam</span>
            </h2>
            <p className="mb-8 text-xl text-white/80">
              Kết nối hàng nghìn ứng viên tài năng với các cơ hội việc làm tốt nhất.
              Giải pháp tuyển dụng toàn diện cho doanh nghiệp.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="text-lg"
              >
                Bắt đầu ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/jobs')}
                className="border-white/20 bg-white/10 text-lg text-white hover:bg-white/20"
              >
                Khám phá việc làm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h3 className="mb-4 text-3xl font-bold">Tính năng nổi bật</h3>
            <p className="text-muted-foreground">
              Hệ thống quản lý tuyển dụng hiện đại với đầy đủ tính năng
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-soft">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-3xl font-bold">
                Tại sao chọn RecruitHub?
              </h3>
              <p className="mb-8 text-lg text-muted-foreground">
                Chúng tôi cung cấp giải pháp tuyển dụng toàn diện, giúp bạn tiết kiệm
                thời gian và nâng cao hiệu quả tuyển dụng.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="mt-8"
                onClick={() => navigate('/register')}
              >
                Đăng ký miễn phí
              </Button>
            </div>
            <div className="relative">
              <Card className="shadow-strong">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">10,000+</div>
                        <div className="text-muted-foreground">Ứng viên</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                        <Briefcase className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">5,000+</div>
                        <div className="text-muted-foreground">Việc làm</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">95%</div>
                        <div className="text-muted-foreground">Tỷ lệ hài lòng</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-none bg-gradient-hero text-primary-foreground shadow-strong">
            <CardContent className="p-12 text-center">
              <h3 className="mb-4 text-3xl font-bold">
                Sẵn sàng bắt đầu hành trình mới?
              </h3>
              <p className="mb-8 text-xl text-white/80">
                Tham gia RecruitHub ngay hôm nay và khám phá cơ hội việc làm tốt nhất
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/register')}
                className="text-lg"
              >
                Đăng ký miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 RecruitHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
