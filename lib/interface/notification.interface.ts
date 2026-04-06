export type NotificationType = 'order' | 'promotion' | 'message' | 'system' | 'reward';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string;
  isRead: boolean;
  priority: NotificationPriority;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

export interface NotificationPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  unreadCount: number;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: NotificationPagination;
  };
}

export interface UnreadNotificationResponse {
  success: boolean;
  data: Notification[];
}
