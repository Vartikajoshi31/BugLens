import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Bell, CheckCircle2, MessageSquare, UserCheck, Activity } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading } =
    useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (isLoading) {
    return <Skeleton height={300} className="w-full rounded-2xl" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" />
            Notification Center ({unreadCount} unread)
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time updates on bug assignments, @mentions, comments, and status changes.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="py-12 text-center text-xs text-gray-500">
            No notifications available.
          </Card>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                markAsRead(n._id);
                if (n.bug) navigate(`/bugs/${n.bug.bugId || n.bug._id}`);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/30'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              }`}
            >
              <Avatar name={n.actor?.name || 'User'} src={n.actor?.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant={n.type === 'BUG_ASSIGNED' ? 'primary' : 'warning'} size="sm">
                    {n.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-[10px] text-gray-400">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-200 font-medium">
                  {n.message || `${n.actor?.name} performed action on ${n.bug?.bugId}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
