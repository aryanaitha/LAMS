"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  User,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Coins,
  MapPin,
  ShieldCheck,
  Calendar,
  Send,
  Upload,
  ShieldAlert,
  Download,
  Check,
  HelpCircle,
  Link as LinkIcon,
  Home,
  Briefcase,
  DollarSign,
  FileCheck,
} from "lucide-react";

function CitizenPortalContent() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") || "dossier";
  const [activeTab, setActiveTab] = useState<"dossier" | "grievance" | "timeline">(
    tabParam === "grievance" ? "grievance" : tabParam === "timeline" ? "timeline" : "dossier"
  );

  useEffect(() => {
    if (tabParam === "grievance") setActiveTab("grievance");
    else if (tabParam === "timeline") setActiveTab("timeline");
    else if (tabParam === "dossier") setActiveTab("dossier");
  }, [tabParam]);

  // Loading & Data State from /api/citizen/data
  const [isLoading, setIsLoading] = useState(true);
  const [citizenData, setCitizenData] = useState<any>(null);
  const [selectedParcelIndex, setSelectedParcelIndex] = useState(0);

  // Search & Claim State
  const [claimSearchQuery, setClaimSearchQuery] = useState("");
  const [claimSearchResult, setClaimSearchResult] = useState<any>(null);
  const [claimSearchError, setClaimSearchError] = useState<string | null>(null);
  const [isSearchingClaim, setIsSearchingClaim] = useState(false);
  const [isLinkingClaim, setIsLinkingClaim] = useState(false);
  const [linkSuccessMessage, setLinkSuccessMessage] = useState<string | null>(null);

  // Search input on top bar for checking parcel / ULPIN
  const [searchQuery, setSearchQuery] = useState("");
  const [isCrossOwnerAttempt, setIsCrossOwnerAttempt] = useState(false);

  // Grievance form state
  const [grievanceCategory, setGrievanceCategory] = useState("Compensation amount dispute");
  const [grievanceDesc, setGrievanceDesc] = useState("");
  const [submittedGrievance, setSubmittedGrievance] = useState<string | null>(null);

  const fetchCitizenData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/citizen/data");
      if (res.ok) {
        const data = await res.json();
        setCitizenData(data);
      }
    } catch (err) {
      console.error("Failed to load citizen data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchCitizenData();
    }
  }, [session]);

  const activeParcel = citizenData?.parcels?.[selectedParcelIndex] || citizenData?.parcels?.[0] || null;

  // Search check: if search is executed, check whether it matches one of own parcels or another owner
  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (!clean) {
      setIsCrossOwnerAttempt(false);
      return;
    }

    if (!citizenData?.parcels || citizenData.parcels.length === 0) {
      setIsCrossOwnerAttempt(true);
      return;
    }

    const matchedOwn = citizenData.parcels.find(
      (p: any) =>
        p.ulpin.toUpperCase() === clean ||
        p.surveyNo.toUpperCase() === clean ||
        p.id.toUpperCase() === clean
    );

    if (matchedOwn) {
      setIsCrossOwnerAttempt(false);
      const idx = citizenData.parcels.findIndex((p: any) => p.id === matchedOwn.id);
      if (idx !== -1) setSelectedParcelIndex(idx);
    } else {
      setIsCrossOwnerAttempt(true);
    }
  };

  // Claim & Link Flow for new self-registered citizens or unlinked accounts
  const handleSearchClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = claimSearchQuery.trim();
    if (!q) return;

    setIsSearchingClaim(true);
    setClaimSearchError(null);
    setClaimSearchResult(null);
    setLinkSuccessMessage(null);

    try {
      const res = await fetch("/api/citizen/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, confirmLink: false }),
      });
      const data = await res.json();

      if (!res.ok || !data.found) {
        setClaimSearchError(data.message || "No matching record found in the acquisition dataset.");
      } else {
        setClaimSearchResult(data);
      }
    } catch (err: any) {
      setClaimSearchError(err.message || "Error searching for record");
    } finally {
      setIsSearchingClaim(false);
    }
  };

  const handleConfirmLink = async () => {
    if (!claimSearchResult?.parcel) return;

    setIsLinkingClaim(true);
    setClaimSearchError(null);

    try {
      const res = await fetch("/api/citizen/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: claimSearchResult.parcel.ulpin,
          confirmLink: true,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setClaimSearchError(data.error || "Failed to link account");
      } else {
        setLinkSuccessMessage(`Account successfully linked to owner record ${data.owner?.name || data.owner?.id}!`);
        setClaimSearchResult(null);
        setClaimSearchQuery("");
        // Reload citizen data
        await fetchCitizenData();
      }
    } catch (err: any) {
      setClaimSearchError(err.message || "Failed to link account");
    } finally {
      setIsLinkingClaim(false);
    }
  };

  const handleFileGrievance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDesc.trim()) return;

    const newTracking = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedGrievance(newTracking);

    try {
      await fetch("/api/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcelId: activeParcel?.id || null,
          parcelUlpin: activeParcel?.ulpin || null,
          surveyNo: activeParcel?.surveyNo || null,
          applicantName: citizenData?.owner?.name || session?.user?.name || "Landowner Applicant",
          applicantPhone: citizenData?.owner?.maskedPhone || "+91 98XXXXX000",
          category: grievanceCategory,
          description: grievanceDesc,
        }),
      });
      setGrievanceDesc("");
      await fetchCitizenData();
    } catch (err) {
      console.error("Grievance submit error:", err);
    }
  };

  const downloadCitizenDoc = (doc: any) => {
    const text =
      `GOVERNMENT OF INDIA - LAND ACQUISITION MONITORING SYSTEM (LAMS)\n` +
      `------------------------------------------------------------------\n` +
      `Document ID: ${doc.documentId || doc.id}\n` +
      `Document Name: ${doc.filename}\n` +
      `Document Type: ${doc.docType}\n` +
      `Associated Parcel: ${doc.parcelId || activeParcel?.id || "N/A"}\n` +
      `Project Code: ${doc.projectId || activeParcel?.projectId || "N/A"}\n` +
      `Uploaded By: ${doc.uploadedByRole}\n` +
      `Upload Date: ${new Date(doc.uploadedDate).toLocaleDateString()}\n` +
      `SHA-256 Hash Seal: ${doc.sha256Hash}\n` +
      `------------------------------------------------------------------\n` +
      `Certified Authentic Statutory Land Record under RFCTLARR Act, 2013.\n`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.filename.endsWith(".pdf") ? doc.filename.replace(".pdf", ".txt") : `${doc.filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Loading landowner dossiers & cadastral holdings...</p>
      </div>
    );
  }

  const isClaimed = Boolean(citizenData?.claimed && citizenData?.owner);

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <User className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi" ? "भू-स्वामी / नागरिक सेवा पोर्टल" : "Landowner & Citizen Portal"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as: <span className="font-bold text-slate-700">{citizenData?.owner?.name || session?.user?.name || "Citizen"}</span>
            {citizenData?.owner && (
              <span className="ml-1 text-slate-600">
                • {citizenData.owner.id} ({citizenData.parcels?.[0]?.villageName || citizenData.owner.villageId})
              </span>
            )}
            <span className={`ml-2 font-mono text-[10px] px-2 py-0.5 rounded font-bold ${isClaimed ? "bg-amber-100 text-amber-900" : "bg-slate-200 text-slate-700"}`}>
              {isClaimed ? "Citizen Verified" : "Unclaimed Account"}
            </span>
          </p>
        </div>

        {/* Search Input for ULPIN */}
        <form onSubmit={handleTopSearchSubmit} className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search My Parcel / ULPIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-gov-navy"
          />
        </form>
      </div>

      {/* CROSS-OWNER PRIVACY VIOLATION BLOCK */}
      {isCrossOwnerAttempt ? (
        <div className="p-6 bg-rose-50 border-2 border-rose-300 rounded-xl space-y-3 animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>
              {locale === "hi"
                ? "पहुंच अवरुद्ध: अनधिकृत भूखंड विवरण"
                : "Access Restricted: Unauthorized Land Parcel Dossier"}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            You are authenticated as <strong>{citizenData?.owner?.name || session?.user?.name}</strong> ({citizenData?.owner?.id || "Citizen Account"}).
            Under Section 43A of the IT Act and Land Acquisition Privacy Regulations, landowners are strictly
            restricted to viewing only their own registered cadastral holdings and compensation awards.
          </p>
          <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-rose-900 font-mono">
            Attempted Query: &quot;{searchQuery}&quot; — Access Blocked.
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setIsCrossOwnerAttempt(false);
            }}
            className="px-4 py-2 bg-gov-navy text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
          >
            Return to My Registered Holding
          </button>
        </div>
      ) : (
        <>
          {/* Claim Box for Unlinked Citizens */}
          {!isClaimed && (
            <div className="p-6 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4">
              <div className="flex items-center gap-2.5 text-gov-navy">
                <LinkIcon className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Claim / Link Your Land Record
                </h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                As a self-registered citizen, link your account to your cadastral parcel by searching with your
                <strong> 14-digit ULPIN</strong> (Bhu-Aadhaar), <strong>Survey Number (Khasra)</strong>, or <strong>Parcel ID</strong>.
              </p>

              {linkSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{linkSuccessMessage}</span>
                </div>
              )}

              {claimSearchError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-900 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{claimSearchError}</span>
                </div>
              )}

              <form onSubmit={handleSearchClaim} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Enter ULPIN (e.g. DZGLAAAW2VBZEM), Survey No (e.g. 21/1) or Parcel ID (PCL-0121)..."
                  value={claimSearchQuery}
                  onChange={(e) => setClaimSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-1 focus:ring-gov-navy"
                />
                <button
                  type="submit"
                  disabled={isSearchingClaim}
                  className="px-4 py-2 bg-gov-navy hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSearchingClaim ? "Searching..." : "Find Land Record"}</span>
                </button>
              </form>

              {claimSearchResult && (
                <div className="p-4 bg-white rounded-lg border border-blue-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-mono text-xs font-bold text-gov-navy bg-amber-100 px-2 py-0.5 rounded">
                      Survey {claimSearchResult.parcel.surveyNo} • {claimSearchResult.parcel.villageName}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Record Found
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Owner Name</span>
                      <p className="font-semibold text-slate-800">{claimSearchResult.owner?.name || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Area</span>
                      <p className="font-semibold text-slate-800">{claimSearchResult.parcel.areaHa} Ha</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">ULPIN</span>
                      <p className="font-mono text-slate-800">{claimSearchResult.parcel.ulpin}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Project</span>
                      <p className="font-semibold text-slate-800">{claimSearchResult.parcel.projectName || claimSearchResult.parcel.projectId}</p>
                    </div>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleConfirmLink}
                      disabled={isLinkingClaim}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isLinkingClaim ? "Linking..." : "Confirm & Link To My Account"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Role Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab("dossier")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "dossier"
                  ? "bg-gov-navy text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{locale === "hi" ? "मेरी भूमि एवं आवेदन" : "My Land & Applications"}</span>
              {citizenData?.parcels?.length > 0 && (
                <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded-full font-mono">
                  {citizenData.parcels.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("grievance")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "grievance"
                  ? "bg-gov-navy text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{locale === "hi" ? "आपत्ति / शिकायत दर्ज करें" : "File Objection/Grievance"}</span>
              {citizenData?.grievances?.length > 0 && (
                <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded-full font-mono">
                  {citizenData.grievances.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === "timeline"
                  ? "bg-gov-navy text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>{locale === "hi" ? "मुआवजा समय-सीमा" : "Compensation Timeline"}</span>
            </button>
          </div>

          {/* 1. My Land & Applications View */}
          {activeTab === "dossier" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left / Center: Parcel Dossier */}
              <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
                {/* Multi-parcel picker if landowner owns more than 1 parcel */}
                {citizenData?.parcels?.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Select Holding:</span>
                    {citizenData.parcels.map((p: any, idx: number) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedParcelIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                          selectedParcelIndex === idx
                            ? "bg-gov-navy text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        Survey {p.surveyNo} ({p.villageName})
                      </button>
                    ))}
                  </div>
                )}

                {activeParcel ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-gov-navy bg-amber-100 px-2.5 py-1 rounded">
                          ULPIN: {activeParcel.ulpin}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 mt-2">
                          Survey Number: {activeParcel.surveyNo} • {activeParcel.villageName}
                        </h2>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase font-mono">
                        {activeParcel.status}
                      </span>
                    </div>

                    {/* Cadastral Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Village & Tehsil</span>
                        <p className="font-bold text-slate-900 mt-0.5">{activeParcel.villageName}</p>
                        <span className="text-[10px] text-slate-500">{activeParcel.tehsil}, {activeParcel.district}</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Parcel Area</span>
                        <p className="font-bold text-slate-900 font-mono mt-0.5">{activeParcel.areaHa} Ha</p>
                        <span className="text-[10px] text-slate-500">{activeParcel.landUse}</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Award</span>
                        <p className="font-bold text-emerald-800 font-mono mt-0.5">
                          ₹{(activeParcel.areaHa * 3500000 * 1.5 * 2.2).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold">Incl. Solatium & Multiplier</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Acquiring Project</span>
                        <p className="font-bold text-slate-900 mt-0.5 truncate">{activeParcel.projectName || activeParcel.projectId}</p>
                        <span className="text-[10px] text-slate-500 font-mono">{activeParcel.projectId}</span>
                      </div>
                    </div>

                    {/* R&R Entitlements if applicable */}
                    {citizenData.rrFamilies?.length > 0 && (
                      <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold">
                          <Home className="w-4 h-4 text-emerald-700" />
                          <span>Rehabilitation & Resettlement (R&R) Second Schedule Package</span>
                        </div>
                        {citizenData.rrFamilies.map((rr: any) => (
                          <div key={rr.familyId} className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                            <div>Family ID: <strong className="text-slate-800">{rr.familyId}</strong></div>
                            <div>Members: <strong className="text-slate-800">{rr.membersCount}</strong></div>
                            <div>Subsistence: <strong className="text-emerald-800">₹{rr.subsistenceAllowanceInr.toLocaleString("en-IN")}</strong></div>
                            <div>House: <strong className="text-slate-800">{rr.entitlementHouse ? "Entitled" : "None"}</strong></div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Documents & Receipts */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Verified Statutory Dossier Documents ({citizenData.documents?.length || 0})
                      </h3>
                      {citizenData.documents?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {citizenData.documents.map((doc: any) => (
                            <div key={doc.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gov-navy shrink-0" />
                                <div className="truncate">
                                  <p className="font-bold text-slate-800 truncate">{doc.filename}</p>
                                  <span className="text-[10px] text-slate-400 font-mono">{doc.docType} • v{doc.version}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => downloadCitizenDoc(doc)}
                                className="p-1.5 rounded hover:bg-slate-200 text-slate-600 shrink-0 ml-2"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                          No uploaded documents attached to this parcel yet.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-slate-700">No Land Holdings Currently Linked</p>
                    <p>Use the search box above to claim your parcel by Survey Number or ULPIN.</p>
                  </div>
                )}
              </div>

              {/* Right: Statutory Progression Stepper */}
              <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                  Acquisition Progress Stepper
                </h3>

                <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {[
                    { name: "Proposal Ingestion", date: "Sep 2025", status: "COMPLETED" },
                    { name: "Preliminary Notification (Sec 11)", date: "Jan 2026", status: "COMPLETED" },
                    { name: "Joint Measurement Survey (JMS)", date: "Mar 2026", status: "COMPLETED" },
                    { name: "Section 15 Objections Hearing", date: "Sep 2026", status: activeParcel?.status === "objections" ? "CURRENT" : "COMPLETED" },
                    { name: "Section 19 Final Declaration", date: "Oct 2026", status: activeParcel?.status === "final_declaration" ? "CURRENT" : "UPCOMING" },
                    { name: "Section 23 Award & Compensation", date: "Nov 2026", status: activeParcel?.status === "awarded" || activeParcel?.status === "compensation_paid" ? "CURRENT" : "UPCOMING" },
                    { name: "Physical Possession Handover", date: "Dec 2026", status: activeParcel?.status === "possessed" ? "COMPLETED" : "UPCOMING" },
                  ].map((m, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                          m.status === "COMPLETED"
                            ? "border-emerald-600 bg-emerald-600"
                            : m.status === "CURRENT"
                            ? "border-amber-500 bg-amber-400"
                            : "border-slate-300"
                        }`}
                      ></div>
                      <p className="font-bold text-slate-900">{m.name}</p>
                      <span className="text-[11px] text-slate-400 font-mono">{m.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. File Objection / Grievance */}
          {activeTab === "grievance" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                  {locale === "hi"
                    ? "धारा 15 के अधीन आपत्ति / शिकायत दर्ज करें"
                    : "Lodge Statutory Objection under Section 15 (RFCTLARR Act, 2013)"}
                </h2>

                {submittedGrievance && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Objection filed successfully! Acknowledgement Tracking ID:{" "}
                      <strong>{submittedGrievance}</strong>. CALA hearing will be notified via SMS.
                    </span>
                  </div>
                )}

                <form onSubmit={handleFileGrievance} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Objection / Grievance Category
                    </label>
                    <select
                      value={grievanceCategory}
                      onChange={(e) => setGrievanceCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                    >
                      <option value="Compensation amount dispute">Compensation amount dispute</option>
                      <option value="Boundary/survey discrepancy">Boundary/survey discrepancy</option>
                      <option value="Ownership/title dispute">Ownership/title dispute</option>
                      <option value="R&R entitlement not honoured">R&R entitlement not honoured</option>
                      <option value="Delay in possession">Delay in possession</option>
                      <option value="Notice not received">Notice not received</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Detailed Grounds of Objection
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Specify your statutory grounds of objection, affected survey numbers, valuation of trees/wells, or boundary concerns..."
                      value={grievanceDesc}
                      onChange={(e) => setGrievanceDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gov-navy text-white font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>Submit Formal Objection</span>
                  </button>
                </form>
              </div>

              {/* History */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                  My Lodged Objections & Grievances ({citizenData?.grievances?.length || 0})
                </h3>

                <div className="space-y-3">
                  {citizenData?.grievances?.length > 0 ? (
                    citizenData.grievances.map((g: any) => (
                      <div
                        key={g.id || g.trackingNo}
                        className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-gov-navy">{g.trackingNo || g.id}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-[10px]">
                            {g.status}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900">{g.category}</p>
                        <p className="text-[11px] text-slate-600">{g.description}</p>
                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 font-semibold">
                          Filed On: {new Date(g.filedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                      No complaints or objections currently lodged for your account.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3. Compensation Timeline & Breakdown */}
          {activeTab === "timeline" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    {locale === "hi"
                      ? "प्रथम अनुसूची मुआवजा विवरण (RFCTLARR Act 2013)"
                      : "Schedule I Statutory Compensation Computation Sheet"}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Formula: (Market Value × Rural Multiplier 1.5x) + 100% Solatium + 12% Interest + Trees/Structures
                  </p>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                  Holding: Survey {activeParcel?.surveyNo || "N/A"} ({activeParcel?.areaHa || 0} Ha)
                </span>
              </div>

              {activeParcel ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">1. Base Market Value ({activeParcel.areaHa} Ha @ ₹35L/Ha)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{(activeParcel.areaHa * 3500000).toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">2. Rural Multiplier Factor (Rural Corridor: 1.5x)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{(activeParcel.areaHa * 3500000 * 1.5).toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">3. Solatium (100% of Statutory Market Value)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{(activeParcel.areaHa * 3500000 * 1.5).toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-semibold text-slate-700">4. Additional Interest (12% p.a. from Preliminary Notice)</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{(activeParcel.areaHa * 3500000 * 0.12).toLocaleString("en-IN")}
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/60 font-bold">
                        <td className="py-3 px-3 text-emerald-950">TOTAL STATUTORY AWARD (Sec 23/30)</td>
                        <td className="py-3 px-3 text-right font-mono text-base text-emerald-800">
                          ₹{(activeParcel.areaHa * 3500000 * (1.5 + 1.5 + 0.12)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500">
                  Please link a land holding to view compensation calculation.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CitizenPortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Citizen Portal...</div>}>
      <CitizenPortalContent />
    </Suspense>
  );
}
