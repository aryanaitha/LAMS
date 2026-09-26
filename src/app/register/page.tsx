"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import {
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
  Lock,
  KeyRound,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function RegisterPage() {
  const { t, locale } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Profile & Mobile, Step 2: OTP & Password
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(5);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 9) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput("");
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError(locale === "hi" ? "कृपया सभी फ़ील्ड भरें।" : "Please fill in all fields.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(
        locale === "hi"
          ? "पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।"
          : "Passwords do not match."
      );
      return;
    }

    if (otp !== "123456") {
      setError(
        locale === "hi"
          ? "अमान्य ओटीपी। प्रोटोटाइप हेतु '123456' दर्ज करें।"
          : "Invalid OTP. For prototype testing, use 123456."
      );
      return;
    }

    if (parseInt(captchaInput, 10) !== captchaNum1 + captchaNum2) {
      setError(
        locale === "hi"
          ? "सुरक्षा कैप्चा उत्तर गलत है।"
          : "Incorrect security captcha answer."
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          otp,
          captchaAnswer: captchaInput,
          captchaToken: captchaNum1 + captchaNum2,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500 text-slate-950 shadow-md">
          <UserPlus className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {locale === "hi" ? "नागरिक / भू-स्वामी स्वयं-पंजीकरण" : "Citizen / Landowner Self-Registration"}
        </h2>
        <p className="text-xs text-slate-500">
          {locale === "hi"
            ? "अपनी अधिग्रहित भूमि, मुआवजा भुगतान और आपत्तियों की वास्तविक स्थिति ट्रैक करने हेतु खाता बनाएं।"
            : "Create an account to track your land acquisition proceedings, compensation awards, and statutory notices."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-xl">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900">
                {locale === "hi" ? "पंजीकरण सफल रहा!" : "Registration Successful!"}
              </h3>
              <p className="text-xs text-slate-600">
                {locale === "hi"
                  ? "आपका नागरिक खाता सक्रिय हो गया है। लॉगिन पृष्ठ पर पुनः निर्देशित किया जा रहा है..."
                  : "Your citizen account has been created. Redirecting to login..."}
              </p>
            </div>
          ) : (
            <form onSubmit={step === 1 ? handleSendOtp : handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Progress Stepper */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <span className={`font-semibold ${step === 1 ? "text-amber-600" : "text-emerald-600"}`}>
                  1. {locale === "hi" ? "व्यक्तिगत विवरण" : "Personal Details"}
                </span>
                <span className="text-slate-300">→</span>
                <span className={`font-semibold ${step === 2 ? "text-amber-600" : "text-slate-400"}`}>
                  2. {locale === "hi" ? "ओटीपी एवं सुरक्षा" : "OTP & Password"}
                </span>
              </div>

              {step === 1 ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      {locale === "hi" ? "भू-स्वामी का पूरा नाम (राजस्व अभिलेखानुसार)" : "Full Legal Name (as per RoR)"}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Tukaram Patil"
                        className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      {locale === "hi" ? "ईमेल पता" : "Email Address"}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh.patil@example.com"
                        className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      {locale === "hi" ? "मोबाइल नंबर (ओटीपी सत्यापन हेतु)" : "Mobile Number (for SMS Alerts)"}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98221 42109"
                        className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-600 transition"
                    >
                      <span>{locale === "hi" ? "ओटीपी प्राप्त करें" : "Generate Verification OTP"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    <p className="font-semibold">
                      {locale === "hi" ? "डेमो ओटीपी सूचना:" : "Simulated OTP Notice:"}
                    </p>
                    <p className="text-[11px] text-amber-800">
                      {locale === "hi"
                        ? `मोबाइल ${phone} पर ओटीपी भेजा गया। डेमो कोड '123456' दर्ज करें।`
                        : `OTP sent to ${phone}. Enter mock code 123456 to verify.`}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      {locale === "hi" ? "6-अंकों का ओटीपी" : "6-Digit SMS OTP"}
                    </label>
                    <div className="mt-1 relative rounded-md shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="block w-full pl-9 pr-3 py-2 text-xs tracking-widest font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        {locale === "hi" ? "पासवर्ड बनाएं" : "Create Password"}
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        {locale === "hi" ? "पासवर्ड दोहराएं" : "Confirm Password"}
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 block w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Math Captcha */}
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      {locale === "hi" ? "सुरक्षा कैप्चा" : "Security Verification Captcha"}
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono font-bold text-slate-800 text-xs tracking-wider">
                        {captchaNum1} + {captchaNum2} = ?
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        title="Refresh Captcha"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Answer"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      {locale === "hi" ? "वापस" : "Back"}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 px-4 border border-transparent rounded-lg shadow-sm text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-600 transition disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span>{locale === "hi" ? "खाता बन रहा है..." : "Creating Account..."}</span>
                      ) : (
                        <span>{locale === "hi" ? "पंजीकरण पूर्ण करें" : "Complete Registration"}</span>
                      )}
                    </button>
                  </div>
                </>
              )}

              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {locale === "hi" ? "पहले से पंजीकृत हैं? " : "Already have an account? "}
                  <Link href="/login" className="font-semibold text-gov-navy underline">
                    {locale === "hi" ? "यहाँ लॉगिन करें" : "Sign In Here"}
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
