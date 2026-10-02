"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { DemoRoleSwitcher } from "@/components/ui/DemoRoleSwitcher";
import { NotificationBell } from "@/components/layout/NotificationBell";
import {
  getNavItemsForRole,
  getRoleIndicator,
  UserRole,
} from "@/lib/permissions";
import {
  Building2,
  Building,
  Map,
  BarChart3,
  ClipboardList,
  FileText,
  FolderOpen,
  FilePlus,
  Camera,
  HelpCircle,
  Coins,
  Users,
  ShieldCheck,
  Sliders,
  Database,
  ShieldAlert,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

// Icon mapping table for dynamic role navigation
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Building,
  Map,
  BarChart3,
  ClipboardList,
  FileText,
  FolderOpen,
  FilePlus,
  Camera,
  HelpCircle,
  Coins,
  Users,
  ShieldCheck,
  Sliders,
  Database,
  ShieldAlert,
};

export function Navbar() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = (session?.user as any)?.role as UserRole | undefined;
  const roleIndicator = getRoleIndicator(userRole, locale);
  const navItems = getNavItemsForRole(userRole);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Persistent Demo Banner — ONLY SHOWN INSIDE AUTHENTICATED APP */}
      {session && (
        <div className="bg-amber-500 text-slate-950 font-bold text-xs py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2 border-b border-amber-600">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span>⚠️ {t.demoBanner}</span>
          <span className="hidden md:inline font-normal text-slate-900 text-[11px]">
            ({t.syntheticCadastralNotice})
          </span>
        </div>
      )}

      {/* 2. Top Bar */}
      <div className="bg-[#0a2240] text-white px-4 md:px-8 py-2.5 flex items-center justify-between">
        {/* Wordmark / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border-2 border-amber-500 text-gov-navy font-black text-sm shadow">
            🏛️
          </div>
          <div>
            <p className="text-[10px] tracking-wider uppercase text-amber-300 font-semibold leading-tight">
              {t.governmentOfIndia} • {t.ministryTitle}
            </p>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              <Link href="/" className="hover:text-amber-200 transition">
                {t.appName}
              </Link>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                LAMS
              </span>
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        {!session ? (
          /* Minimal Unauthenticated Landing Top Bar: Wordmark, "About", "Login", "Register" */
          <div className="flex items-center gap-3 md:gap-5">
            <Link
              href="/#about"
              className="text-xs font-medium text-slate-300 hover:text-white transition"
            >
              {locale === "hi" ? "के बारे में" : "About"}
            </Link>

            <LanguageSelector />

            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <Link
                href="/login"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-xs"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700"
              >
                {t.nav.register}
              </Link>
            </div>
          </div>
        ) : (
          /* Authenticated Top Ribbon Controls */
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Current Role Indicator */}
            {roleIndicator && (
              <div className="hidden lg:flex items-center gap-1.5 bg-amber-500/10 border border-amber-400/30 px-2.5 py-1 rounded-md text-xs font-medium text-amber-300">
                <span className="text-[11px] text-slate-300 font-normal">
                  {locale === "hi" ? "लॉग इन:" : "Logged in as:"}
                </span>
                <span className="font-bold text-amber-200">{roleIndicator}</span>
              </div>
            )}

            {/* Notification Bell with Dropdown */}
            <NotificationBell />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Instant Demo Role Switcher */}
            <DemoRoleSwitcher />

            {/* User Profile Capsule */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-200 truncate max-w-[120px]">
                {session.user?.name}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-200 transition border border-rose-800"
              title={locale === "hi" ? "लॉग आउट" : "Sign Out"}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {locale === "hi" ? "लॉग आउट" : "Sign Out"}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded bg-slate-800 text-slate-200 border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 3. Primary Role-Driven Navigation Ribbon — ONLY SHOWN WHEN AUTHENTICATED */}
      {session && navItems.length > 0 && (
        <nav className="bg-slate-50 border-b border-slate-200 px-4 md:px-8 py-1.5 hidden md:block overflow-x-auto">
          <ul className="flex items-center gap-1.5 text-xs font-medium text-slate-700 min-w-max">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href.includes("?") &&
                  pathname === item.href.split("?")[0]);
              const Icon = ICON_MAP[item.iconName] || FileText;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                      isActive
                        ? "bg-gov-navy text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                    <span>{locale === "hi" ? item.labelHi : item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Mobile Drawer Navigation */}
      {session && mobileMenuOpen && (
        <div className="md:hidden bg-slate-100 border-b border-slate-300 p-4 space-y-2">
          {roleIndicator && (
            <div className="p-2 bg-amber-500/10 border border-amber-400/30 rounded text-xs text-amber-800 font-semibold mb-2">
              {locale === "hi" ? "लॉग इन: " : "Logged in as: "} {roleIndicator}
            </div>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = ICON_MAP[item.iconName] || FileText;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                      isActive
                        ? "bg-gov-navy text-white font-bold"
                        : "text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{locale === "hi" ? item.labelHi : item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
