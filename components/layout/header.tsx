"use client";

import React from "react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useAuth } from "@/provider/AuthProvider";
import { User } from "lucide-react";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-zinc-800">Quản trị hệ thống</h2>
      </div>

      <div className="flex items-center gap-6">
        <NotificationDropdown />
        
        <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-zinc-900">{user?.fullName || user?.username || 'Admin'}</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Administrator</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-zinc-100 border flex items-center justify-center text-zinc-500 shadow-inner">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
