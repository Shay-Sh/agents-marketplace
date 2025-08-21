'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Bot,
  MessageSquare, 
  BarChart3,
  Settings,
  CreditCard,
  BookOpen,
  Zap,
  Search
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Browse & Discover",
    href: "/dashboard/marketplace",
    icon: Search,
  },
  {
    name: "My Agents", 
    href: "/dashboard/agents",
    icon: Bot,
  },
  {
    name: "Conversations",
    href: "/dashboard/conversations", 
    icon: MessageSquare,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Knowledge Base",
    href: "/dashboard/knowledge",
    icon: BookOpen,
  },
  {
    name: "Billing", 
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-lg">
            <Zap className="h-5 w-5 text-white dark:text-gray-900" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Lab17 Agents</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-r-2 border-gray-900 dark:border-gray-100"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white">
          <h3 className="font-semibold text-sm">Upgrade to Pro</h3>
          <p className="text-xs opacity-90 mt-1">Unlock advanced features</p>
          <Link 
            href="/dashboard/billing"
            className="inline-flex items-center mt-2 text-xs font-medium hover:underline"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </div>
  );
}