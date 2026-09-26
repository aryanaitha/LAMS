"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { DemoRoleSwitcher } from "@/components/ui/DemoRoleSwitcher";
import {
  Map,
  FileText,
  Calculator,
  Users,
  ShieldAlert,
  BarChart3,
  Settings,
  LogIn,
  LogOut,
  User,
  Menu,
  X,
  Building2,
} from "lucide-react";

export function Navbar() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicLanding = pathname === "/" && !session;
  const userRole = (session?.user as any)?.role;

  // Filter links by role in authenticated mode
  const navLinks = [
    { href: "/gis", label: t.nav.gisExplorer, icon: Map, roles: ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "ADMIN"] },
    { href: "/dashboard/collector", label: "Collector Console", icon: FileText, roles: ["DISTRICT_COLLECTOR", "ADMIN"] },
    { href: "/dashboard/citizen", label: t.nav.landownerPortal, icon: User, roles: ["LANDOWNER", "ADMIN"] },
    { href: "/dashboard/central", label: "National Dashboard", icon: Building2, roles: ["CENTRAL_MINISTRY", "STATE_OFFICER", "ADMIN"] },
    { href: "/calculator", label: "Compensation Record", icon: Calculator, roles: ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "LANDOWNER", "ADMIN"] },
    { href: "/rr", label: t.nav.rrTracker, icon: Users, roles: ["DISTRICT_COLLECTOR", "ADMIN"] },
    { href: "/audit", label: t.nav.auditTrail, icon: ShieldAlert, roles: ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "ADMIN"] },
    { href: "/reports", label: t.nav.reports, icon: BarChart3, roles: ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "ADMIN"] },
    { href: "/admin", label: t.nav.admin, icon: Settings, roles: ["ADMIN"] },
  ];

  const visibleLinks = navLinks.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole))
  );

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

        {/* Minimal Unauthenticated Landing Top Bar: Wordmark, "About", "Login", "Register" */}
        {!session ? (
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
          /* Authenticated App Controls */
          <div className="flex items-center gap-3">
            <LanguageSelector />
            <DemoRoleSwitcher />

            <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700 text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-200">{session.user?.name}</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded">
                {userRole}
              </span>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded bg-rose-950/70 hover:bg-rose-900 text-rose-200 transition border border-rose-800"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{locale === "hi" ? "लॉग आउट" : "Sign Out"}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Primary Navigation Bar — ONLY SHOWN WHEN AUTHENTICATED */}
      {session && (
        <nav className="bg-slate-50 border-b border-slate-200 px-4 md:px-8 py-1.5 hidden md:block overflow-x-auto">
          <ul className="flex items-center gap-1.5 text-xs font-medium text-slate-700 min-w-max">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                      isActive
                        ? "bg-[#0a2240] text-white font-semibold shadow-xs"
                        : "hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
