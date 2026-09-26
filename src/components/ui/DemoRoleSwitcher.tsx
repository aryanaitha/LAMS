"use client";

import React, { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { ShieldCheck, ChevronDown, Check, LogOut } from "lucide-react";

interface RoleOption {
  role: string;
  email: string;
  label: string;
  labelHi: string;
  scope: string;
  color: string;
}

const ROLES: RoleOption[] = [
  {
    role: "CENTRAL_MINISTRY",
    email: "central.ministry@lams.gov.in",
    label: "Central Ministry",
    labelHi: "केंद्रीय मंत्रालय",
    scope: "National (DoLR / MoRD)",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    role: "STATE_OFFICER",
    email: "state.maharashtra@lams.gov.in",
    label: "State Revenue Dept",
    labelHi: "राज्य राजस्व विभाग",
    scope: "Maharashtra State",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    role: "DISTRICT_COLLECTOR",
    email: "collector.nashik@lams.gov.in",
    label: "District Collector / CALA",
    labelHi: "जिला कलेक्टर / सीएएलए",
    scope: "Nashik District",
    color: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    role: "REQUIRING_BODY",
    email: "nhai.projects@lams.gov.in",
    label: "Requiring Body (NHAI)",
    labelHi: "अध्येक्षी निकाय (एनएचएआई)",
    scope: "NHAI Western Region",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    role: "FIELD_OFFICER",
    email: "field.sinnar@lams.gov.in",
    label: "Field Revenue Officer",
    labelHi: "क्षेत्रीय राजस्व अधिकारी",
    scope: "Sinnar Tehsil",
    color: "bg-teal-100 text-teal-800 border-teal-300",
  },
  {
    role: "LANDOWNER",
    email: "ramesh.patil@lams.test",
    label: "Landowner / Citizen",
    labelHi: "भू-स्वामी / नागरिक",
    scope: "Musalgaon (Survey 104/2)",
    color: "bg-orange-100 text-orange-800 border-orange-300",
  },
  {
    role: "ADMIN",
    email: "admin@lams.gov.in",
    label: "System Administrator",
    labelHi: "सिस्टम व्यवस्थापक",
    scope: "Global Platform Access",
    color: "bg-rose-100 text-rose-800 border-rose-300",
  },
];

export function DemoRoleSwitcher() {
  const { data: session } = useSession();
  const { locale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentRole = (session?.user as any)?.role;
  const activeRoleConfig = ROLES.find((r) => r.role === currentRole);

  const handleRoleSelect = async (roleOption: RoleOption) => {
    setIsLoading(true);
    setIsOpen(false);
    try {
      await signIn("credentials", {
        email: roleOption.email,
        password: "Demo@123",
        redirect: true,
        callbackUrl: getDashboardPath(roleOption.role),
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const getDashboardPath = (role: string) => {
    switch (role) {
      case "CENTRAL_MINISTRY":
        return "/dashboard/central";
      case "STATE_OFFICER":
        return "/dashboard/state";
      case "DISTRICT_COLLECTOR":
        return "/dashboard/collector";
      case "REQUIRING_BODY":
        return "/dashboard/requiring-body";
      case "FIELD_OFFICER":
        return "/dashboard/field";
      case "LANDOWNER":
        return "/dashboard/citizen";
      case "ADMIN":
        return "/admin";
      default:
        return "/";
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 transition shadow-sm"
        title="Quickly switch between all 7 demo roles"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
        <span className="font-semibold">
          {session ? (locale === "hi" ? activeRoleConfig?.labelHi : activeRoleConfig?.label) : t.nav.switchRole}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-2.5 bg-slate-50 rounded-t-lg">
            <p className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              {locale === "hi" ? "त्वरित डेमो भूमिका चयनकर्ता" : "Instant Demo Role Switcher"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {locale === "hi"
                ? "किसी भी भूमिका के रूप में लॉग इन करने के लिए क्लिक करें (पासवर्ड: Demo@123)"
                : "Click any role to sign in instantly (Password: Demo@123)"}
            </p>
          </div>
          <div className="py-1 max-h-80 overflow-y-auto">
            {ROLES.map((r) => {
              const isActive = r.role === currentRole;
              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full text-left px-3.5 py-2 flex items-start justify-between hover:bg-slate-50 transition text-xs ${
                    isActive ? "bg-amber-50/70" : ""
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">
                        {locale === "hi" ? r.labelHi : r.label}
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">{r.email}</p>
                    <span className="inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {r.scope}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {session && (
            <div className="py-1 px-3 bg-slate-50 rounded-b-lg">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t.nav.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
