"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { useSession } from "next-auth/react";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { DemoRoleSwitcher } from "@/components/ui/DemoRoleSwitcher";

export default function UnauthorizedPage() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();

  const currentRole = (session?.user as any)?.role || "ANONYMOUS";

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-lg text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h1 className="text-xl font-bold text-slate-900">
          {locale === "hi" ? "403 - अनधिकृत पहुंच (पहुंच वर्जित)" : "403 - Access Forbidden"}
        </h1>

        <p className="text-xs text-slate-600 leading-relaxed">
          {locale === "hi"
            ? `आपकी वर्तमान भूमिका (${currentRole}) इस पृष्ठ या कार्यवाही को देखने हेतु अधिकृत नहीं है। यह प्रणाली भारत सरकार के सख्त 7-स्तरीय सर्वर आरबीएसी प्रोटोकॉल का पालन करती है।`
            : `Your current session role (${currentRole}) lacks statutory privileges to access this internal government console.`}
        </p>

        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <p className="font-semibold">Test Different Role via Demo Switcher:</p>
          <DemoRoleSwitcher />
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{locale === "hi" ? "मुख्य पृष्ठ पर लौटें" : "Return to Home Page"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
