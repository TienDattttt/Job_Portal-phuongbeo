export enum UserRole {
  ADMIN = 1,
  NTD = 2,
  UNGVIEN = 3,
}

export interface User {
  userId: number;
  fullName: string;
  email: string;
  roleId: UserRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Job {
  tinID: number;
  tieuDe: string;
  moTa: string;
  yeuCau: string;
  diaDiem: string;
  loaiHinh: string;
  mucLuong: string;
  hanNop: string;
  congTy: string;
  logoURL?: string;
  ngayDang: string;
}

// 🧩 Dữ liệu lịch sử ứng tuyển của ỨNG VIÊN
export interface UserApplication {
  ungTuyenID: number;
  tinID: number;
  tieuDe: string;
  congTy: string;
  trangThai: string;
  ngayNop: string;
  ghiChu?: string;
}

// 🧩 Dữ liệu danh sách ứng viên cho NTD
export interface EmployerApplication {
  ungTuyenID: number;
  ungVienID: number;
  hoTen: string;
  email: string;
  cvLink: string;
  trangThai: string;
  ngayUngTuyen: string;
  ghiChu?: string;
}


export interface Profile {
  ungVienID: number;
  userId: number;
  hoTen: string;
  soDienThoai: string;
  diaChi: string;
  ngaySinh?: string;
  gioiTinh?: string;
  cvLink?: string;
}

export interface Notification {
  notiID: number;        // = NotiID trong DB
  userID: number;        // User nhận thông báo
  tieuDe: string;        // Tựa đề
  noiDung: string;       // Nội dung thông báo
  daDoc: boolean;        // map từ IsRead
  ngayTao: string;       // CreatedAt
}


export interface Interview {
  lichHenID: number;
  ungTuyenID: number;
  ngayHen: string;         // DATETIME
  diaDiem: string;
  nguoiPhongVan: string;
  noiDungThu: string;
  trangThai: "Chờ xác nhận" | "Đồng ý" | "Từ chối" | "Đang chờ phản hồi";
  ngayGuiThu: string;      // DATETIME
  emailUngVien: string;
}

export interface Statistics {
  totalJobs: number;
  totalApplicants: number;
  successRate: number;
  chartData: Array<{
    name: string;
    value: number;
  }>;
}

export interface Employer {
  ntdID: number;
  tenCongTy: string;
  diaChi: string;
  website?: string;
  moTa?: string;
  logoURL?: string;
  email: string;
  soDienThoai: string;
}
