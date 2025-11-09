import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, roleId: number) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token && typeof storedUser === 'string' && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser || typeof parsedUser !== 'object') {
          throw new Error('Dữ liệu user không hợp lệ');
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Invalid user data in localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

// 🟢 Đăng nhập
const login = async (email: string, password: string) => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    const data = response.data;

    if (!data.success) {
      // ⛔ backend trả lỗi có "error" và "errorCode"
      throw new Error(data.error || 'Đăng nhập thất bại');
    }

    const { token, user: userData } = data;
    if (!token || !userData || typeof userData !== 'object') {
      throw new Error('Dữ liệu xác thực không hợp lệ từ server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    toast.success(data.message || 'Đăng nhập thành công!');
  } catch (error: any) {
    // lấy message từ backend nếu có
    const backendMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Đăng nhập thất bại';
    toast.error(backendMessage);
    throw error;
  }
};

// 🟢 Đăng ký
const register = async (
  fullName: string,
  email: string,
  password: string,
  roleId: number
) => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', {
      fullName,
      email,
      password,
      roleId,
    });
    const data = response.data;

    if (!data.success) {
      // ⛔ backend báo lỗi email trùng, format sai, ...
      throw new Error(data.error || 'Đăng ký thất bại');
    }

    const { token, user: userData } = data;
    if (!token || !userData || typeof userData !== 'object') {
      throw new Error('Dữ liệu xác thực không hợp lệ từ server');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    toast.success(data.message || 'Đăng ký thành công!');
  } catch (error: any) {
    const backendMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Đăng ký thất bại';
    toast.error(backendMessage);
    throw error;
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Đăng xuất thành công!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}