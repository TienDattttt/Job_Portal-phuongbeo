import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<string>(UserRole.UNGVIEN.toString());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    if (!email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Sai định dạng email';
    }

    if (!password.trim()) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Mật khẩu phải bao gồm chữ thường';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Mật khẩu phải bao gồm chữ hoa';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Mật khẩu phải bao gồm ít nhất một số';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password = 'Mật khẩu phải bao gồm ký tự đặc biệt';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // kiểm tra lại mỗi lần người dùng nhấn nút
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(fullName, email, password, parseInt(roleId));
      navigate('/dashboard');
    } catch (error) {
      // lỗi xử lý trong context
    } finally {
      setLoading(false);
    }
  };

  // Xóa lỗi realtime khi người dùng nhập lại
  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Đăng ký</CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để bắt đầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate  className="space-y-4">
            {/* Họ và tên */}
            <div className="space-y-1">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Loại tài khoản */}
            <div className="space-y-2">
              <Label>Loại tài khoản</Label>
              <RadioGroup value={roleId} onValueChange={setRoleId}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={UserRole.UNGVIEN.toString()} id="ungvien" />
                  <Label htmlFor="ungvien" className="font-normal cursor-pointer">
                    Ứng viên - Tìm việc làm
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={UserRole.NTD.toString()} id="ntd" />
                  <Label htmlFor="ntd" className="font-normal cursor-pointer">
                    Nhà tuyển dụng - Đăng tin tuyển dụng
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              Quay về trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
