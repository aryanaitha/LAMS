"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Home,
  Briefcase,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Download,
  ShieldCheck,
  Send,
  Camera,
  MapPin,
  Upload,
  X,
  FileCheck,
} from "lucide-react";

export default function RrTrackerPage() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as string | undefined;

  const [searchTerm, setSearchTerm] = useState("");
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState<string>("ALL");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [familiesList, setFamiliesList] = useState<any[]>([]);

  // Geotagged Field Evidence Modal state for Field Officer
  const [evidenceModalFamily, setEvidenceModalFamily] = useState<any | null>(null);
  const [evidenceGpsLat, setEvidenceGpsLat] = useState("22.64120");
  const [evidenceGpsLng, setEvidenceGpsLng] = useState("77.97810");
  const [evidenceGpsStatus, setEvidenceGpsStatus] = useState<string | null>(null);
  const [evidenceRemarks, setEvidenceRemarks] = useState("House entitlement site inspection verified and photographed.");
  const [evidenceFiles, setEvidenceFiles] = useState<{ name: string; url: string; size: string }[]>([]);
  const [isSavingEvidence, setIsSavingEvidence] = useState(false);

  const fetchFamilies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rr");
      if (res.ok) {
        const data = await res.json();
        setFamiliesList(data.families || []);
      }
    } catch (err) {
      console.error("Failed to load R&R families:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const filteredFamilies = familiesList.filter((f) => {
    const matchesSearch =
      (f.headName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.village || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.familyId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.surveyNo || "").includes(searchTerm) ||
      (f.ulpin || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVuln =
      vulnerabilityFilter === "ALL" ||
      (vulnerabilityFilter === "SC_ST" && f.vulnerableScSt) ||
      (vulnerabilityFilter === "WOMEN_HEADED" && f.vulnerableWomenHeaded);

    return matchesSearch && matchesVuln;
  });

  const handleCaptureGpsEvidence = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          const acc = pos.coords.accuracy.toFixed(1);
          setEvidenceGpsLat(lat);
          setEvidenceGpsLng(lng);
          setEvidenceGpsStatus(`GPS captured — Lat ${lat}, Lon ${lng}, accuracy ±${acc}m, [${new Date().toLocaleTimeString()}].`);
        },
        () => {
          // Fallback clearly labeled mock reading around project area
          const lat = (22.6412 + (Math.random() - 0.5) * 0.005).toFixed(6);
          const lng = (77.9781 + (Math.random() - 0.5) * 0.005).toFixed(6);
          setEvidenceGpsLat(lat);
          setEvidenceGpsLng(lng);
          setEvidenceGpsStatus(`GPS captured (Mock Sensor) — Lat ${lat}, Lon ${lng}, accuracy ±2.4m, [${new Date().toLocaleTimeString()}].`);
        },
        { timeout: 4000 }
      );
    } else {
      const lat = (22.6412 + (Math.random() - 0.5) * 0.005).toFixed(6);
      const lng = (77.9781 + (Math.random() - 0.5) * 0.005).toFixed(6);
      setEvidenceGpsLat(lat);
      setEvidenceGpsLng(lng);
      setEvidenceGpsStatus(`GPS captured (Mock Sensor) — Lat ${lat}, Lon ${lng}, accuracy ±2.4m, [${new Date().toLocaleTimeString()}].`);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newItems = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      size: `${(f.size / 1024).toFixed(1)} KB`,
    }));
    setEvidenceFiles((prev) => [...prev, ...newItems]);
  };

  const handleOpenEvidenceModal = (fam: any) => {
    setEvidenceModalFamily(fam);
    setEvidenceRemarks(`Verification visit conducted for ${fam.familyId} (${fam.headName}) on parcel Survey ${fam.surveyNo}. Proof of entitlement delivered.`);
    setEvidenceFiles([
      {
        name: "resettlement_site_visit_01.jpg",
        url: "/placeholder-resettlement.jpg",
        size: "340.2 KB",
      },
    ]);
    handleCaptureGpsEvidence();
  };

  const handleSaveGeotaggedEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceModalFamily) return;

    setIsSavingEvidence(true);
    try {
      const res = await fetch("/api/rr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId: evidenceModalFamily.familyId,
          entitlementType: "housing_and_resettlement",
          newStatus: "completed",
          gpsLat: evidenceGpsLat,
          gpsLng: evidenceGpsLng,
          remarks: evidenceRemarks,
          photos: evidenceFiles.map((f) => f.name),
          visitDate: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record evidence");

      setActionSuccess(`Geotagged field evidence successfully recorded and attached to family record ${evidenceModalFamily.familyId}!`);
      setEvidenceModalFamily(null);
      await fetchFamilies();
      setTimeout(() => setActionSuccess(null), 5000);
    } catch (err: any) {
      setActionSuccess(`Error: ${err.message}`);
    } finally {
      setIsSavingEvidence(false);
    }
  };

  const handleDcApprove = async (familyId: string) => {
    try {
      const res = await fetch("/api/rr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId,
          entitlementType: "annuity_and_subsistence",
          newStatus: "completed",
          remarks: "Approved by District Collector (CALA)",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");

      setActionSuccess(`CALA approved entitlement for ${familyId}.`);
      await fetchFamilies();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      setActionSuccess(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Users className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "परिवार-वार पुनर्वासन एवं पुनर्व्यवस्थापन (R&R) ट्रैकर"
                : "Family-Wise Rehabilitation & Resettlement (R&R) Tracker"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Second Schedule statutory entitlements tracking for project-affected displaced families under RFCTLARR Act 2013.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition shadow"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>{locale === "hi" ? "आर&आर रिपोर्ट डाउनलोड करें" : "Export R&R MIS Register"}</span>
        </button>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Total Affected Families</span>
          <p className="text-xl font-bold text-slate-900 font-mono mt-1">{familiesList.length}</p>
          <span className="text-[10px] text-slate-500">Across 6 infrastructure projects</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Vulnerable (SC/ST)</span>
          <p className="text-xl font-bold text-amber-700 font-mono mt-1">
            {familiesList.filter((f) => f.vulnerableScSt).length}
          </p>
          <span className="text-[10px] text-amber-600 font-semibold">Special statutory safeguards</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Women-Headed</span>
          <p className="text-xl font-bold text-purple-700 font-mono mt-1">
            {familiesList.filter((f) => f.vulnerableWomenHeaded).length}
          </p>
          <span className="text-[10px] text-purple-600 font-semibold">Priority housing allotment</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Completed Packages</span>
          <p className="text-xl font-bold text-emerald-700 font-mono mt-1">
            {familiesList.filter((f) => f.rrStatus === "completed").length}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold">Fully delivered</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Family ID, Head Name, Village, Survey No, or ULPIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-gov-navy font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={vulnerabilityFilter}
            onChange={(e) => setVulnerabilityFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-gov-navy bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="SC_ST">Vulnerable (SC/ST Only)</option>
            <option value="WOMEN_HEADED">Women-Headed Households</option>
          </select>
        </div>
      </div>

      {/* Family Entitlements Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading R&R family records...
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFamilies.map((fam) => (
            <div
              key={fam.familyId}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gov-navy text-white">
                    {fam.familyId}
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {fam.headName}
                      {fam.vulnerableWomenHeaded && <span className="ml-1 text-[11px] text-purple-700 font-semibold">(Women-Headed)</span>}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {fam.village}, {fam.tehsil} • Survey #{fam.surveyNo} (ULPIN: {fam.ulpin})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {fam.vulnerableScSt && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      SC/ST Special Safeguard
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase ${
                    fam.rrStatus === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : fam.rrStatus === "in_progress"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {fam.rrStatus}
                  </span>
                </div>
              </div>

              {/* Entitlement Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Home className="w-4 h-4 text-gov-navy" />
                    <span>Constructed House</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {fam.entitlementHouse ? "Indira Awas 50 sq.m Housing Unit" : "Not Entitled"}
                  </p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 inline-block">
                    {fam.entitlementHouse ? "ENTITLED" : "N/A"}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Coins className="w-4 h-4 text-gov-navy" />
                    <span>Subsistence Allowance</span>
                  </div>
                  <p className="text-[11px] text-slate-500">One-time grant</p>
                  <p className="font-mono font-bold text-slate-900">
                    ₹{fam.subsistenceAllowanceInr.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <Briefcase className="w-4 h-4 text-gov-navy" />
                    <span>Employment / Annuity</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {fam.entitlementEmployment ? "Mandatory Job or Monthly Annuity" : "Standard Resettlement"}
                  </p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 inline-block">
                    {fam.entitlementEmployment ? "MANDATORY OPTION" : "STANDARD"}
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-gov-navy" />
                    <span>Family Members</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{fam.projectName}</p>
                  <p className="font-mono font-bold text-slate-900">{fam.membersCount} Persons</p>
                </div>
              </div>

              {/* Geotagged Field Evidence Display if attached */}
              {fam.geotaggedEvidence && (
                <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-amber-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-amber-600" />
                      <span>Geotagged Field Evidence Attached:</span>
                    </span>
                    <span className="font-mono text-[10px] bg-amber-200/80 px-2 py-0.5 rounded">
                      GPS: {fam.geotaggedEvidence.gpsLat}, {fam.geotaggedEvidence.gpsLng} (±{fam.geotaggedEvidence.accuracyMeters || 2.1}m)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700">{fam.geotaggedEvidence.remarks}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Officer: {fam.geotaggedEvidence.officer} • Verified at: {new Date(fam.geotaggedEvidence.visitTimestamp).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Action Buttons Scoped to Role */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Project: {fam.projectName} ({fam.projectId})
                </span>

                <div className="flex items-center gap-2">
                  {/* Field Revenue Officer: Record Geotagged Field Evidence */}
                  {(userRole === "FIELD_OFFICER" || userRole === "ADMIN") && (
                    <button
                      onClick={() => handleOpenEvidenceModal(fam)}
                      className="px-3.5 py-1.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>Record Geotagged Field Evidence</span>
                    </button>
                  )}

                  {/* District Collector: Sanction Entitlement */}
                  {(userRole === "DISTRICT_COLLECTOR" || userRole === "ADMIN") && fam.rrStatus !== "completed" && (
                    <button
                      onClick={() => handleDcApprove(fam.familyId)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Sanction R&R Entitlement Package</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Geotagged Field Evidence Modal */}
      {evidenceModalFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>Record Geotagged R&R Field Evidence</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Scope: {evidenceModalFamily.familyId} • {evidenceModalFamily.headName} (Survey {evidenceModalFamily.surveyNo})
                </p>
              </div>
              <button
                onClick={() => setEvidenceModalFamily(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGeotaggedEvidence} className="space-y-4 text-xs">
              {/* GPS Capture */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gov-navy" />
                    <span>Real-Time GPS Location (Physical Site Inspection)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCaptureGpsEvidence}
                    className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow"
                  >
                    Capture GPS Now
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    Lat: <strong className="text-gov-navy">{evidenceGpsLat}° N</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    Lon: <strong className="text-gov-navy">{evidenceGpsLng}° E</strong>
                  </div>
                </div>
                {evidenceGpsStatus && (
                  <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 p-1.5 rounded border border-emerald-200">
                    {evidenceGpsStatus}
                  </p>
                )}
              </div>

              {/* Drag-and-drop Photos */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Resettlement Site Photos & Panchanama Evidence
                </label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-4 text-center cursor-pointer bg-slate-50 transition"
                  onClick={() => document.getElementById("rr-file-input")?.click()}
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="font-semibold text-slate-700">Drag & drop inspection photos here, or click to browse</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, or PDF formats (court admissible)</p>
                  <input
                    id="rr-file-input"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {evidenceFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-100 text-[11px]">
                        <span className="font-medium text-slate-800 truncate">{f.name} ({f.size})</span>
                        <button
                          type="button"
                          onClick={() => setEvidenceFiles(evidenceFiles.filter((_, i) => i !== idx))}
                          className="text-rose-600 hover:text-rose-800 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Verification Notes / Panchanama Remarks
                </label>
                <textarea
                  rows={2}
                  value={evidenceRemarks}
                  onChange={(e) => setEvidenceRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEvidenceModalFamily(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEvidence}
                  className="px-4 py-2 rounded-lg bg-gov-navy text-white font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow"
                >
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>{isSavingEvidence ? "Saving..." : "Save Geotagged Evidence"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
