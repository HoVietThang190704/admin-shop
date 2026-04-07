"use client";

import React from "react";
import { Bell, CheckCheck, Ghost } from "lucide-react";
import { useNotifications } from "@/provider/NotificationProvider";
import { NotificationItem } from "./NotificationItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function NotificationDropdown() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    loading
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative transition-colors hover:text-primary/70 cursor-pointer p-2 outline-none group bg-muted/50 rounded-lg">
          <Bell className="h-5 w-5 group-hover:animate-ring" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground font-bold animate-in zoom-in duration-300 shadow-sm border-2 border-background">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 sm:w-96 mt-2 rounded-2xl bg-popover border-border shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold flex items-center gap-2">
              Thông báo admin
              {unreadCount > 0 && (
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-bold">
                  {unreadCount} mới
                </span>
              )}
            </h3>
            <p className="text-[10px] text-muted-foreground font-medium">Hệ thống thông báo quản trị</p>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors hover:bg-primary/10 px-2 py-1 rounded-lg"
            >
              <CheckCheck className="h-3 w-3" />
              Đã đọc tất cả
            </button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Ghost className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">Không có thông báo</p>
                <p className="text-[10px] text-muted-foreground max-w-[200px]">Hiện tại hệ thống chưa có thông báo mới nào dành cho quản trị viên.</p>
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={markAsRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-muted/10">
            <button 
              className="w-full text-center text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer uppercase tracking-widest py-1"
            >
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
