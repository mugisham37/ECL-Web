"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Activity, BarChart3, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/runs", icon: Activity, label: "Runs" },
  { href: "/results", icon: BarChart3, label: "Results" },
  { href: "/admin", icon: Shield, label: "Admin" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="bottom-nav fixed bottom-0 inset-x-0 md:hidden z-30"
      style={{ height: "var(--bottom-nav-h)" }}
      aria-label="Bottom navigation"
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive =
          pathname === href ||
          (href !== "/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={cn("bottom-nav-item", isActive && "active")}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
