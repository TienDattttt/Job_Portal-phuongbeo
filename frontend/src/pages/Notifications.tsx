import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // 🔹 Lấy danh sách thông báo
  useEffect(() => {
    fetchNotifications();
  }, [showUnreadOnly]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/notifications/user/${user.userId}`, {
        params: { onlyUnread: showUnreadOnly },
      });

      // ✅ Chuẩn hóa dữ liệu đúng DB
      const normalized = response.data.map((n: any) => ({
        notiID: n.NotiID,
        userID: n.UserID,
        tieuDe: n.TieuDe,
        noiDung: n.NoiDung,
        daDoc: n.IsRead === true || n.IsRead === 1,
        ngayTao: n.CreatedAt,
      }));

      setNotifications(normalized);
    } catch (error) {
      console.error("❌ Lỗi tải thông báo:", error);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Đánh dấu là đã đọc
  const markAsRead = async (notiID: number) => {
    try {
      await api.put(`/notifications/${notiID}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.notiID === notiID ? { ...n, daDoc: true } : n))
      );
      toast.success("Đã đánh dấu là đã đọc");
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái:", error);
      toast.error("Không thể cập nhật thông báo");
    }
  };

  const unreadCount = notifications.filter((n) => !n.daDoc).length;

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
        {/* 🧭 Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Thông báo</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : "Không có thông báo mới"}
            </p>
          </div>
          <Button
            variant={showUnreadOnly ? "default" : "outline"}
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
          >
            {showUnreadOnly ? "Xem tất cả" : "Chỉ chưa đọc"}
          </Button>
        </div>

        {/* 🧩 Danh sách thông báo */}
        {notifications.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="py-12 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                {showUnreadOnly
                  ? "Không có thông báo chưa đọc"
                  : "Chưa có thông báo nào"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <Card
                key={`noti-${notification.notiID || index}`} // ✅ unique key
                className={`shadow-soft transition-all ${
                  !notification.daDoc
                    ? "border-l-4 border-l-primary bg-primary/5"
                    : ""
                }`}
              >
                <CardContent className="flex items-start justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <Bell
                        className={`mt-1 h-5 w-5 ${
                          !notification.daDoc
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            !notification.daDoc ? "text-primary" : ""
                          }`}
                        >
                          {notification.tieuDe}
                        </p>
                        <p className="text-sm">{notification.noiDung}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(notification.ngayTao).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!notification.daDoc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.notiID)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
