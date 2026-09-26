"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

function LoginContent() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error")) {
      setError(
        locale === "hi"
          ? "अमान्य क्रेडेंशियल्स या अपर्याप्त अनुमतियां।"
          : "Invalid credentials or unauthorized access attempt."
      );
    }
  }, [searchParams, locale]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl && callbackUrl.startsWith("/")) {
          router.push(callbackUrl);
        } else if (email.includes("collector")) {
          router.push("/dashboard/collector");
        } else if (email.includes("admin")) {
          router.push("/admin");
        } else if (email.includes("citizen") || email.includes("patil")) {
          router.push("/dashboard/citizen");
        } else if (email.includes("field")) {
          router.push("/dashboard/field");
        } else {
          router.push("/dashboard/central");
        }
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
      setIsLoading(false);
    }
  };

  const handleQuickRoleLogin = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("Demo@123");
    setIsLoading(true);
    setError(null);

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
      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl);
      } else if (roleEmail.includes("collector")) {
        router.push("/dashboard/collector");
      } else if (roleEmail.includes("admin")) {
        router.push("/admin");
      } else if (roleEmail.includes("citizen") || roleEmail.includes("patil")) {
        router.push("/dashboard/citizen");
      } else if (roleEmail.includes("field")) {
        router.push("/dashboard/field");
      } else {
        router.push("/dashboard/central");
      }
      router.refresh();
    }
  };

  const demoRoles = [
    {
      role: "Central Ministry",
      roleHi: "केंद्रीय मंत्रालय",
      email: "central.ministry@lams.gov.in",
      scope: "National Overview",
      color: "border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 text-purple-900",
    },
    {
      role: "State Officer",
      roleHi: "राज्य अधिकारी",
      email: "state.maharashtra@lams.gov.in",
      scope: "Maharashtra State",
      color: "border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-900",
    },
    {
      role: "District Collector / CALA",
      roleHi: "जिला कलेक्टर / सीएएलए",
      email: "collector.nashik@lams.gov.in",
      scope: "Nashik District",
      color: "border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900",
    },
    {
      role: "Requiring Body (NHAI)",
      roleHi: "अध्येक्षी निकाय",
      email: "nhai.projects@lams.gov.in",
      scope: "Project Proposer",
      color: "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900",
    },
    {
      role: "Field Revenue Officer",
      roleHi: "क्षेत्रीय अधिकारी",
      email: "field.sinnar@lams.gov.in",
      scope: "Sinnar Tehsil",
      color: "border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-teal-900",
    },
    {
      role: "Landowner / Citizen",
      roleHi: "भू-स्वामी / नागरिक",
      email: "ramesh.patil@lams.test",
      scope: "Survey No. 104/2",
      color: "border-orange-200 bg-orange-50/50 hover:bg-orange-100/70 text-orange-900",
    },
    {
      role: "System Administrator",
      roleHi: "व्यवस्थापक",
      email: "admin@lams.gov.in",
      scope: "Global Admin Console",
      color: "border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-900",
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-gov-navy text-white shadow-md">
          <ShieldCheck className="w-8 h-8 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {locale === "hi" ? "शासकीय एकल लॉगिन (Single Sign-On)" : "National Single Sign-On Portal"}
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {locale === "hi"
            ? "भू-अर्जन निगरानी प्रणाली (LAMS) में अपनी अधिकृत शासकीय अथवा नागरिक साख से प्रवेश करें।"
            : "Sign in with your authorized departmental or landowner credentials to access your jurisdiction."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Col: Credentials Form */}
        <div className="md:col-span-6 bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-xl">
          <form className="space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {locale === "hi" ? "ईमेल / उपयोगकर्ता पहचान" : "Official Email / User ID"}
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@lams.gov.in"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy focus:border-gov-navy"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                {locale === "hi" ? "पासवर्ड" : "Password"}
              </label>
              <div className="mt-1 relative rounded-md shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy focus:border-gov-navy"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-white bg-gov-navy hover:bg-slate-800 transition focus:ring-2 focus:ring-offset-2 focus:ring-gov-navy disabled:opacity-50"
              >
                {isLoading ? (
                  <span>{locale === "hi" ? "सत्यापित हो रहा है..." : "Authenticating..."}</span>
                ) : (
                  <>
                    <span>{t.nav.login}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {locale === "hi" ? "नया भू-स्वामी खाता? " : "Citizen / Landowner? "}
                <Link
                  href="/register"
                  className="font-semibold text-amber-600 hover:text-amber-700 underline"
                >
                  {locale === "hi" ? "यहाँ स्वयं-पंजीकरण करें" : "Self-Register Here"}
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Right Col: Instant 1-Click Role Switcher for Evaluators */}
        <div className="md:col-span-6 bg-white p-6 shadow-sm border border-slate-200 sm:rounded-xl space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserCheck className="w-4 h-4 text-amber-600" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "मूल्यांकनकर्ता 1-क्लिक भूमिका स्विचर" : "Evaluator 1-Click Demo Login"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {locale === "hi"
                  ? "किसी भी भूमिका के रूप में सीधे लॉग इन करने के लिए बटन दबाएं:"
                  : "Click any seeded government role to log in instantly:"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {demoRoles.map((dr) => (
              <button
                key={dr.email}
                type="button"
                onClick={() => handleQuickRoleLogin(dr.email)}
                disabled={isLoading}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition ${dr.color}`}
              >
                <div>
                  <p className="text-xs font-bold leading-tight">
                    {locale === "hi" ? dr.roleHi : dr.role}
                  </p>
                  <p className="text-[11px] opacity-75">{dr.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-black/10 shadow-2xs">
                    {dr.scope}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 text-center pt-1">
            {locale === "hi"
              ? "सभी डेमो खातों का पासवर्ड 'Demo@123' है।"
              : "Default password for all seeded demonstration roles is 'Demo@123'."}
          </p>
        </div>
      </div>
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

