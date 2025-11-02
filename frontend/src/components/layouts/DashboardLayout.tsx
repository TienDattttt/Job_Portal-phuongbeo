import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Bell,
  Building2,
  Calendar,
  BarChart3,
  LogOut,
  User,
  Search,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.roleId) {
      case UserRole.UNGVIEN:
        return [
          { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
          { icon: Search, label: 'Tìm việc làm', path: '/jobs' },
          { icon: FileText, label: 'Hồ sơ của tôi', path: '/profile' },
          { icon: Briefcase, label: 'Việc đã ứng tuyển', path: '/applications' },
          { icon: Bell, label: 'Thông báo', path: '/notifications' },
        ];
      case UserRole.NTD:
        return [
          { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
          { icon: Briefcase, label: 'Tin tuyển dụng', path: '/jobs/manage' },
          // { icon: Users, label: 'Ứng viên', path: '/applicants' },
          { icon: Calendar, label: 'Lịch phỏng vấn', path: '/interviews' },
          { icon: Building2, label: 'Thông tin công ty', path: '/company' },
          { icon: BarChart3, label: 'Báo cáo', path: '/statistics' },
        ];
      case UserRole.ADMIN:
        return [
          { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
          { icon: Building2, label: 'Quản lý doanh nghiệp', path: '/employers' },
          { icon: Users, label: 'Quản lý người dùng', path: '/users' },
          { icon: BarChart3, label: 'Thống kê hệ thống', path: '/statistics' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = getNavigationItems();

  const NavItems = () => (
    <>
      {navigationItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <h1 className="text-xl font-bold text-sidebar-foreground">RecruitHub</h1>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <NavItems />
          </nav>
          <div className="border-t border-sidebar-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b border-sidebar-border px-6">
                  <h1 className="text-xl font-bold text-sidebar-foreground">RecruitHub</h1>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  <NavItems />
                </nav>
                <div className="border-t border-sidebar-border p-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Đăng xuất
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">{user?.fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Hồ sơ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
