"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import Link from "next/link";
import { getDashboardPathByEmail } from "@/lib/permissions";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  UserCheck,
  CheckCircle2,
  KeyRound,
  X,
  Loader2,
  Phone,
} from "lucide-react";

interface DemoRole {
  role: string;
  roleHi: string;
  email: string;
  scope: string;
  scopeHi: string;
}

const DEMO_ROLES: DemoRole[] = [
  {
    role: "Central Ministry",
    roleHi: "केंद्रीय मंत्रालय",
    email: "central.ministry@lams.gov.in",
    scope: "National Overview (DoLR / MoRD)",
    scopeHi: "राष्ट्रीय अवलोकन",
  },
  {
    role: "State Government",
    roleHi: "राज्य सरकार",
    email: "state.maharashtra@lams.gov.in",
    scope: "Maharashtra State Revenue",
    scopeHi: "महाराष्ट्र राज्य",
  },
  {
    role: "District Collector / CALA",
    roleHi: "जिला कलेक्टर / सीएएलए",
    email: "collector.nashik@lams.gov.in",
    scope: "Nashik District (CALA)",
    scopeHi: "नासिक जिला",
  },
  {
    role: "Project Implementing Body",
    roleHi: "परियोजना क्रियान्वयन निकाय",
    email: "nhai.projects@lams.gov.in",
    scope: "NHAI Western Region",
    scopeHi: "एनएचएआई पश्चिमी क्षेत्र",
  },
  {
    role: "Field Revenue Officer",
    roleHi: "क्षेत्रीय राजस्व अधिकारी",
    email: "field.sinnar@lams.gov.in",
    scope: "Sinnar Tehsil",
    scopeHi: "सिन्नर तहसील",
  },
  {
    role: "Landowner / Citizen",
    roleHi: "भू-स्वामी / नागरिक",
    email: "ramesh.patil@lams.test",
    scope: "Survey No. 104/2 Musalgaon",
    scopeHi: "सर्वे 104/2 मुसलगांव",
  },
  {
    role: "System Administrator",
    roleHi: "सिस्टम प्रशासक",
    email: "admin@lams.gov.in",
    scope: "Global Platform Administration",
    scopeHi: "प्रणाली-स्तरीय प्रशासन",
  },
];

function LoginContent() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoExpanded, setIsDemoExpanded] = useState(false);

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fpStep, setFpStep] = useState<1 | 2 | 3>(1);
  const [fpIdentifier, setFpIdentifier] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpSuccessMsg, setFpSuccessMsg] = useState<string | null>(null);
  const [fpError, setFpError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error")) {
      setError(
        locale === "hi"
          ? "अमान्य क्रेडेंशियल्स या अनधिकृत प्रवेश प्रयास।"
          : "Invalid credentials or unauthorized access attempt."
      );
    }
  }, [searchParams, locale]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      setError(locale === "hi" ? "कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें।" : "Please enter your email or phone number.");
      return;
    }

    if (!password) {
      setError(locale === "hi" ? "कृपया अपना पासवर्ड दर्ज करें।" : "Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: trimmedId,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(locale === "hi" ? "गलत क्रेडेंशियल्स। कृपया पुनः प्रयास करें।" : "Invalid credentials. Please verify your email and password.");
        setIsLoading(false);
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl && callbackUrl.startsWith("/") && callbackUrl !== "/login" && callbackUrl !== "/unauthorized") {
          router.push(callbackUrl);
        } else {
          router.push(getDashboardPathByEmail(trimmedId));
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickRoleLogin = async (roleEmail: string) => {
    setIdentifier(roleEmail);
    setPassword("Demo@123");
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: roleEmail,
        password: "Demo@123",
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl && callbackUrl.startsWith("/") && callbackUrl !== "/login" && callbackUrl !== "/unauthorized") {
          router.push(callbackUrl);
        } else {
          router.push(getDashboardPathByEmail(roleEmail));
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Demo login failed");
      setIsLoading(false);
    }
  };

  // Forgot password mock flow
  const handleFpSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fpIdentifier.trim()) {
      setFpError("Please enter your registered email or phone.");
      return;
    }
    setFpError(null);
    setFpStep(2);
  };

  const handleFpVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (fpOtp !== "123456") {
      setFpError("Invalid OTP. Use demo verification code 123456.");
      return;
    }
    if (fpNewPassword.length < 6) {
      setFpError("New password must be at least 6 characters.");
      return;
    }
    setFpError(null);
    setFpStep(3);
    setFpSuccessMsg("Password reset successfully! You can now log in with your new password.");
    setIdentifier(fpIdentifier);
    setPassword(fpNewPassword);
    setTimeout(() => {
      setShowForgotPassword(false);
      setFpStep(1);
      setFpSuccessMsg(null);
    }, 2500);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center py-10 px-4 sm:px-6 bg-slate-50 selection:bg-amber-500 selection:text-white">
      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Card Header with Language Toggle */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gov-navy flex items-center justify-center text-white text-base shadow-xs">
              🏛️
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
                LAMS Login
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {locale === "hi" ? "भू-अर्जन निगरानी प्रणाली" : "Land Acquisition Monitoring System"}
              </p>
            </div>
          </div>

          {/* Language Toggle right inside login header */}
          <div className="shrink-0">
            <LanguageSelector />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-slate-600 leading-relaxed text-center">
          {locale === "hi"
            ? "ग्रामीण विकास मंत्रालय • भूमि संसाधन विभाग (भारत सरकार) के अधिकृत पोर्टल में प्रवेश करें।"
            : "Ministry of Rural Development • Department of Land Resources (DoLR), Government of India"}
        </p>

        {/* Inline Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          {/* Email / Phone Field */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              {locale === "hi" ? "ईमेल अथवा मोबाइल नंबर" : "Official Email or Mobile Phone"}
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="identifier"
                name="email"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@lams.gov.in"
                className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700"
              >
                {locale === "hi" ? "पासवर्ड" : "Password"}
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setFpStep(1);
                  setFpError(null);
                }}
                className="text-[11px] font-medium text-amber-700 hover:text-amber-800 hover:underline transition"
              >
                {locale === "hi" ? "पासवर्ड भूल गए?" : "Forgot password?"}
              </button>
            </div>
            <div className="relative rounded-lg shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-9 pr-10 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gov-navy focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-navy disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>{locale === "hi" ? "सत्यापित हो रहा है..." : "Authenticating..."}</span>
              </>
            ) : (
              <>
                <span>{locale === "hi" ? "साइन इन करें" : "Sign In to LAMS"}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        {/* Secondary Landowner Self-Registration Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-600">
            {locale === "hi" ? "नए भू-स्वामी / नागरिक हैं? " : "New Landowner? "}
            <Link
              href="/register"
              className="font-semibold text-amber-700 hover:text-amber-800 underline transition"
            >
              {locale === "hi" ? "स्वयं-पंजीकरण करें" : "Register here"}
            </Link>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {locale === "hi"
              ? "(शासकीय भूमिकाएं केवल व्यवस्थापक द्वारा प्रदान की जाती हैं)"
              : "(Government official roles are provisioned by Administrator)"}
          </p>
        </div>

        {/* Collapsible Demo Credentials Accordion */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/70 transition">
          <button
            type="button"
            onClick={() => setIsDemoExpanded(!isDemoExpanded)}
            className="w-full flex items-center justify-between p-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition focus:outline-none"
            aria-expanded={isDemoExpanded}
          >
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600" />
              <span>
                {locale === "hi"
                  ? "डेमो खाते (त्वरित 1-क्लिक प्रवेश)"
                  : "Demo Credentials (Click to expand)"}
              </span>
            </div>
            {isDemoExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {isDemoExpanded && (
            <div className="p-3 border-t border-slate-200 space-y-2 bg-white animate-in fade-in duration-150">
              <p className="text-[11px] text-slate-500 mb-2">
                {locale === "hi"
                  ? "किसी भी भूमिका के रूप में सीधे साइन इन करने के लिए चयन करें (पासवर्ड: Demo@123):"
                  : "Click any seeded role below for instant automated sign-in (Password: Demo@123):"}
              </p>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {DEMO_ROLES.map((dr) => (
                  <button
                    key={dr.email}
                    type="button"
                    onClick={() => handleQuickRoleLogin(dr.email)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 leading-snug">
                        {locale === "hi" ? dr.roleHi : dr.role}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">{dr.email}</p>
                    </div>
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {locale === "hi" ? dr.scopeHi : dr.scope}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  {locale === "hi" ? "पासवर्ड रीसेट करें" : "Reset Password"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {fpError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {fpError}
              </div>
            )}

            {fpSuccessMsg ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{fpSuccessMsg}</span>
              </div>
            ) : fpStep === 1 ? (
              <form onSubmit={handleFpSendOtp} className="space-y-3 text-xs">
                <p className="text-slate-600 text-[11px]">
                  Enter your registered official email or mobile phone to receive a verification OTP.
                </p>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Email / Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={fpIdentifier}
                    onChange={(e) => setFpIdentifier(e.target.value)}
                    placeholder="name@lams.gov.in or 9822142109"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-semibold transition"
                >
                  Send Verification OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleFpVerifyAndReset} className="space-y-3 text-xs">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                  Demo OTP: <strong className="font-mono">123456</strong> sent to {fpIdentifier}.
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={fpOtp}
                    onChange={(e) => setFpOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono tracking-widest text-center text-sm font-bold focus:ring-1 focus:ring-gov-navy"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={fpNewPassword}
                    onChange={(e) => setFpNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-semibold transition"
                >
                  Verify OTP & Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading sign-in portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
