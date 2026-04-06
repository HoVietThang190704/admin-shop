'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Folder, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthService } from '@/service/auth.service';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.getInstance().logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/products',
      label: 'Sản phẩm',
      icon: Package,
    },
    {
      href: '/dashboard/orders',
      label: 'Đơn hàng',
      icon: ShoppingCart,
    },
    {
      href: '/dashboard/categories',
      label: 'Danh mục',
      icon: Folder,
    },
  ];

  return (
    <aside 
      className={cn(
        "bg-zinc-900 text-white min-h-screen flex flex-col transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo & Toggle */}
      <div className={cn("p-6 border-b border-zinc-800 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && <h1 className="text-xl font-bold whitespace-nowrap">Admin Shop</h1>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center py-3 rounded-lg transition-all',
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-4',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap transition-opacity">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors w-full",
            isCollapsed ? "justify-center px-0" : "gap-3 px-4"
          )}
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Đăng xuất</span>}
        </button>
      </div>
    </aside>
  );
}
