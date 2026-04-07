"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  Bell, 
  Package, 
  Tag, 
  MessageSquare, 
  Star, 
  Circle,
  X
} from "lucide-react";
import { Notification } from "@/lib/interface/notification.interface";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'order':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'promotion':
        return <Tag className="h-4 w-4 text-red-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'reward':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(notification._id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification._id);
  };

  return (
    <div 
      onClick={handleItemClick}
      className={cn(
        "group relative flex items-start gap-4 p-4 transition-colors cursor-pointer border-b last:border-0 hover:bg-muted/50",
        !notification.isRead && "bg-primary/5"
      )}
    >
      <div className={cn(
        "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-medium shadow-sm transition-all group-hover:scale-105",
        !notification.isRead && "border-primary/20 bg-primary/10"
      )}>
        {getIcon()}
      </div>
      
      <div className="flex-1 space-y-1 pr-4">
        <div className="flex items-center justify-between">
          <p className={cn(
            "text-sm font-semibold leading-none text-foreground",
            !notification.isRead && "text-primary"
          )}>
            {notification.title}
          </p>
          <span className="text-[10px] text-muted-foreground font-medium">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Circle className="h-2 w-2 fill-primary stroke-none animate-pulse" />
        </div>
      )}

      <button
        onClick={handleDelete}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
