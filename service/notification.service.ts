import { BaseResponse } from "@/lib/interface/baseresponse";
import { Endpoint } from "@/lib/shared/constants/endpoint";
import { UrlBuilder } from "@/lib/urlbuilder";
import { TokenManager } from "@/lib/token-client";
import { tokenType } from "@/lib/token";
import { NotificationResponse, UnreadNotificationResponse, Notification } from "@/lib/interface/notification.interface";

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async getAuthHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = await TokenManager.getToken(tokenType.ACCESS);
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async getNotifications(page: number = 1, limit: number = 10): Promise<NotificationResponse> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.NOTIFICATIONS)
        .addQueryParam("page", page.toString())
        .addQueryParam("limit", limit.toString())
        .build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { 
        success: false, 
        data: { 
          notifications: [], 
          pagination: { currentPage: 1, totalPages: 0, totalCount: 0, unreadCount: 0 } 
        } 
      } as any;
    }
  }

  async getUnreadNotifications(): Promise<UnreadNotificationResponse> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.NOTIFICATIONS)
        .addParam("unread")
        .build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "GET",
        headers,
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      return { success: false, data: [] };
    }
  }

  async markAsRead(id: string): Promise<BaseResponse<Notification>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.NOTIFICATIONS)
        .addParam(id)
        .addParam("read")
        .build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "PUT",
        headers,
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, message: "Failed to update notification" };
    }
  }

  async markAllAsRead(): Promise<BaseResponse<void>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.NOTIFICATIONS)
        .addParam("read")
        .addParam("all")
        .build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "PUT",
        headers,
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, message: "Failed to update notifications" };
    }
  }

  async deleteNotification(id: string): Promise<BaseResponse<void>> {
    try {
      const url = new UrlBuilder()
        .addPath(Endpoint.NOTIFICATIONS)
        .addParam(id)
        .build();
      const headers = await this.getAuthHeaders();
      const response = await fetch(url, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting notification:", error);
      return { success: false, message: "Failed to delete notification" };
    }
  }
}
