"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Coins,
  Building2,
  CheckCircle2,
  Layers,
  FileText,
  User,
  AlertTriangle,
  Landmark,
  Scale,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
} from "lucide-react";

export default function CompensationRecordPage() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as string | undefined;

  const [parcelsState, setParcelsState] = useState([
    {
      ulpin: "MH24-0891-4402",
      surveyNo: "104/2",
      owner: "Ramesh Tukaram Patil",
      village: "Musalgaon",
      tehsil: "Sinnar",
      areaHa: 1.25,
      circleRatePerHa: 3500000,
      ruralMultiplier: 1.5,
      assetsValue: 450000,
      solatiumPct: 100,
      interestMonths: 14,
      disbursedAmt: 0,
      status: "OBJECTIONS",
      pfmsStatus: "ESCROW_PENDING_DISPOSAL",
      utr: "Pending CALA Sanction",
    },
    {
      ulpin: "MH24-1102-5819",
      surveyNo: "104/3",
      owner: "Sunita Balasaheb Deshmukh",
      village: "Musalgaon",
      tehsil: "Sinnar",
      areaHa: 0.95,
      circleRatePerHa: 3500000,
      ruralMultiplier: 1.5,
      assetsValue: 280000,
      solatiumPct: 100,
      interestMonths: 12,
      disbursedAmt: 10075000,
      status: "AWARDED",
      pfmsStatus: "CREDITED_VIA_DBT",
      utr: "PFMS2026091488102",
    },
    {
      ulpin: "MH24-2219-4812",
      surveyNo: "105/1",
      owner: "Gangaram Bapu Shinde",
      village: "Musalgaon",
      tehsil: "Sinnar",
      areaHa: 1.8,
      circleRatePerHa: 3200000,
      ruralMultiplier: 1.5,
      assetsValue: 520000,
      solatiumPct: 100,
      interestMonths: 18,
      disbursedAmt: 17450000,
      status: "COMPENSATION_PAID",
      pfmsStatus: "CREDITED_VIA_DBT",
      utr: "PFMS2026082219481",
    },
  ]);

  // Scoping according to RBAC Matrix Row 10:
  // Landowner sees only their own parcel
  const visibleParcels = parcelsState.filter((item) => {
    if (userRole === "LANDOWNER") return item.ulpin === "MH24-0891-4402";
    return true;
  });

  const [selectedUlpin, setSelectedUlpin] = useState("MH24-0891-4402");
  const p = visibleParcels.find((x) => x.ulpin === selectedUlpin) || visibleParcels[0] || parcelsState[0];

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // RFCTLARR Schedule I Formula
  const baseLandValue = p.areaHa * p.circleRatePerHa;
  const multipliedLandValue = baseLandValue * p.ruralMultiplier;
  const marketPlusAssets = multipliedLandValue + p.assetsValue;
  const solatiumAmount = (marketPlusAssets * p.solatiumPct) / 100;
  const additionalInterest = (baseLandValue * 0.12 * p.interestMonths) / 12;
  const totalAssessed = marketPlusAssets + solatiumAmount + additionalInterest;

  const handleAuthorizePayment = async () => {
    setIsAuthorizing(true);
    try {
      const res = await fetch("/api/compensation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ulpin: p.ulpin,
          amount: totalAssessed,
          ownerName: p.owner,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to authorize");

      setParcelsState((prev) =>
        prev.map((item) =>
          item.ulpin === p.ulpin
            ? {
                ...item,
                status: "COMPENSATION_PAID",
                pfmsStatus: "CREDITED_VIA_DBT",
                disbursedAmt: totalAssessed,
                utr: data.utr,
              }
            : item
        )
      );
      setAuthSuccess(data.message);
      setTimeout(() => setAuthSuccess(null), 5000);
    } catch (err: any) {
      setAuthSuccess(`Error: ${err.message}`);
    } finally {
      setIsAuthorizing(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-gov-navy mb-1">
          <Coins className="w-6 h-6 text-amber-500" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {locale === "hi"
              ? "मुआवजा निर्धारण एवं संवितरण अभिलेख"
              : "Compensation Assessment & Disbursement Record"}
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Statutory Schedule I determination and PFMS Direct Benefit Transfer record under RFCTLARR Act 2013.
        </p>
      </div>

      {/* Parcel Selector */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Select Acquired Parcel:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {visibleParcels.map((item) => (
            <button
              key={item.ulpin}
              onClick={() => setSelectedUlpin(item.ulpin)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                item.ulpin === selectedUlpin
                  ? "bg-[#0a2240] text-white font-bold shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Survey {item.surveyNo} ({item.owner.split(" ")[0]})
            </button>
          ))}
        </div>
      </div>

      {authSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{authSuccess}</span>
        </div>
      )}

      {/* 2-Column Record View: Left = Parcel Dossier, Right = Assessment & Disbursement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Beneficiary & Acquisition Dossier */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
              ULPIN: {p.ulpin}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-2">Survey No. {p.surveyNo}</h3>
            <p className="text-xs text-slate-500">
              {p.village} Village, {p.tehsil} Tehsil
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registered Owner</span>
              <span className="font-semibold text-slate-800">{p.owner}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Notified Area</span>
              <span className="font-semibold text-slate-800">{p.areaHa} Hectares</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Circle Rate</span>
              <span className="font-mono text-slate-800">{formatCurrency(p.circleRatePerHa)} / Ha</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Rural Multiplier</span>
              <span className="font-mono font-bold text-slate-800">{p.ruralMultiplier}× (First Schedule)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Acquisition Stage</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {p.status}
              </span>
            </div>
          </div>

          {/* PFMS Settlement Status Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              PFMS Direct Benefit Transfer
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle2
                className={`w-4 h-4 ${
                  p.pfmsStatus === "CREDITED_VIA_DBT" ? "text-emerald-600" : "text-amber-500"
                }`}
              />
              <span className="text-xs font-semibold text-slate-800 font-mono">{p.pfmsStatus}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">UTR: {p.utr}</p>
          </div>

          {/* DC-Only Action to Mark Paid / Authorize PFMS DBT (RBAC Row 11: A for DC, — for all others) */}
          {userRole === "DISTRICT_COLLECTOR" && p.status !== "COMPENSATION_PAID" && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={handleAuthorizePayment}
                disabled={isAuthorizing}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                {isAuthorizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting to PFMS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Authorize PFMS DBT Payout</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">
                CALA Section 77 Statutory Payment Order
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Transparent Statutory Schedule I Breakdown */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              <span>RFCTLARR Act 2013 First Schedule Determination</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Formula Audited
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">1. Base Market Value of Land</p>
                <p className="text-[11px] text-slate-400 font-mono">Area ({p.areaHa} Ha) × Circle Rate</p>
              </div>
              <span className="font-mono text-slate-700 text-sm font-semibold">{formatCurrency(baseLandValue)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">2. Rural Multiplied Value</p>
                <p className="text-[11px] text-slate-400 font-mono">Base Value × Multiplier Factor (1.5×)</p>
              </div>
              <span className="font-mono text-slate-700 text-sm font-semibold">{formatCurrency(multipliedLandValue)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">3. Assets &amp; Trees Enumeration</p>
                <p className="text-[11px] text-slate-400 font-mono">Wells, structures, and timber valuation</p>
              </div>
              <span className="font-mono text-slate-700 text-sm font-semibold">{formatCurrency(p.assetsValue)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 bg-amber-50/50 p-2 rounded-lg">
              <div>
                <p className="font-semibold text-amber-900">4. 100% Mandatory Solatium</p>
                <p className="text-[11px] text-amber-700 font-mono">Section 30(1) compulsory acquisition solatium</p>
              </div>
              <span className="font-mono text-amber-900 text-sm font-bold">{formatCurrency(solatiumAmount)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">5. 12% Additional Statutory Interest</p>
                <p className="text-[11px] text-slate-400 font-mono">Section 30(3) interest for {p.interestMonths} months</p>
              </div>
              <span className="font-mono text-slate-700 text-sm font-semibold">{formatCurrency(additionalInterest)}</span>
            </div>
          </div>

          {/* Total Payable Summary Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                Total Statutory Compensation Award
              </span>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-white mt-0.5">
                {formatCurrency(totalAssessed)}
              </p>
            </div>
            <div className="text-left sm:text-right text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Amount Disbursed</span>
              <span className="font-mono font-bold text-emerald-400 text-base">
                {formatCurrency(p.disbursedAmt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
