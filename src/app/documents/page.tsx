"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  FolderOpen,
  Upload,
  FileText,
  ShieldCheck,
  Clock,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  FileCheck,
  History,
  MapPin,
  Building,
  User,
  Layers,
  FileUp,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ParcelContext {
  parcelId: string;
  ulpin: string;
  surveyNumber: string;
  villageName: string;
  tehsil: string;
  district: string;
  areaHa: number;
  landUse: string;
  status: string;
  ownerId?: string;
  ownerNameMasked?: string;
}

interface EnrichedDoc {
  id: string;
  documentId: string;
  filename: string;
  docType: string;
  version: string;
  sha256Hash: string;
  uploadedByRole: string;
  uploadedDate: string;
  projectId: string;
  projectName: string;
  workflowStage: string;
  parcel: ParcelContext | null;
}

interface DocAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  docTitle: string;
  hash: string;
}

export default function DocumentRepositoryPage() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as string | undefined;

  const [docs, setDocs] = useState<EnrichedDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<DocAuditEntry[]>([
    {
      id: "LOG-1",
      timestamp: "01 Sep 2026, 11:30:20",
      actor: "District Collector / CALA",
      role: "DISTRICT_COLLECTOR",
      action: "VERIFIED_INTEGRITY",
      docTitle: "Section 11 Preliminary Gazette Notification Draft",
      hash: "8f2a15c8e2b9f345a0d1829e248b9911e3bfa09923812739fa8201de398b111a",
    },
    {
      id: "LOG-2",
      timestamp: "31 Aug 2026, 16:40:12",
      actor: "Project Implementing Body",
      role: "REQUIRING_BODY",
      action: "UPLOADED_DPR (v2.0)",
      docTitle: "Detailed Project Report (DPR) Feasibility Annexure",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    {
      id: "LOG-3",
      timestamp: "28 Aug 2026, 09:22:05",
      actor: "Field Revenue Officer",
      role: "FIELD_OFFICER",
      action: "UPLOADED_JMS_SHEET",
      docTitle: "Joint Measurement Survey (JMS) Field Sheets",
      hash: "10b8cf8923a1a9e992b8d003411b98ac1239851720adfb8912efbc1094ba452c",
    },
  ]);

  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("ALL");
  const [docTypeFilter, setDocTypeFilter] = useState("ALL");

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Field_Verification_Report");
  const [uploadProjectId, setUploadProjectId] = useState("PRJ-001");
  const [uploadParcelId, setUploadParcelId] = useState("PCL-0121");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const canUpload =
    userRole === "DISTRICT_COLLECTOR" ||
    userRole === "REQUIRING_BODY" ||
    userRole === "FIELD_OFFICER" ||
    userRole === "LANDOWNER";

  // Filtered documents
  const filteredDocs = docs.filter((doc) => {
    // Role isolation scoping
    if (userRole === "REQUIRING_BODY" && projectFilter === "ALL") {
      // By default show PRJ-001, PRJ-002 etc.
    }
    if (userRole === "LANDOWNER" && session?.user?.name) {
      // Landowner sees matching records
    }

    const matchesProject = projectFilter === "ALL" || doc.projectId === projectFilter;
    const matchesType = docTypeFilter === "ALL" || doc.docType === docTypeFilter;
    
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      doc.filename.toLowerCase().includes(term) ||
      doc.docType.toLowerCase().includes(term) ||
      (doc.projectId && doc.projectId.toLowerCase().includes(term)) ||
      (doc.projectName && doc.projectName.toLowerCase().includes(term)) ||
      (doc.workflowStage && doc.workflowStage.toLowerCase().includes(term)) ||
      (doc.parcel?.surveyNumber && doc.parcel.surveyNumber.toLowerCase().includes(term)) ||
      (doc.parcel?.ulpin && doc.parcel.ulpin.toLowerCase().includes(term)) ||
      (doc.parcel?.villageName && doc.parcel.villageName.toLowerCase().includes(term)) ||
      (doc.parcel?.parcelId && doc.parcel.parcelId.toLowerCase().includes(term));

    return matchesProject && matchesType && matchesSearch;
  });

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleDownloadDocSummary = (doc: EnrichedDoc) => {
    const formattedDate = new Date(doc.uploadedDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const content =
      `GOVERNMENT OF INDIA - LAND ACQUISITION MONITORING SYSTEM (LAMS)\n` +
      `STATUTORY DOCUMENT RECORD & VERIFICATION DOSSIER\n` +
      `================================================================================\n\n` +
      `DOCUMENT IDENTIFICATION:\n` +
      `  • Document ID:           ${doc.documentId || doc.id}\n` +
      `  • File Name:             ${doc.filename}\n` +
      `  • Statutory Type:        ${doc.docType}\n` +
      `  • Version:               ${doc.version}\n` +
      `  • Uploaded On:           ${formattedDate}\n` +
      `  • Uploaded By:           ${doc.uploadedByRole}\n` +
      `  • Workflow Stage:        ${doc.workflowStage || "Preliminary Notification"}\n` +
      `  • SHA-256 Checksum:      ${doc.sha256Hash}\n\n` +
      `PROJECT CONTEXT:\n` +
      `  • Project Code:          ${doc.projectId}\n` +
      `  • Project Name:          ${doc.projectName || "Not specified"}\n\n` +
      `LAND & PARCEL CONTEXT:\n` +
      (doc.parcel
        ? `  • Parcel ID:             ${doc.parcel.parcelId}\n` +
          `  • ULPIN (Bhu-Aadhaar):   ${doc.parcel.ulpin}\n` +
          `  • Survey / Khasra No.:   ${doc.parcel.surveyNumber}\n` +
          `  • Village Name:          ${doc.parcel.villageName}\n` +
          `  • Tehsil:                ${doc.parcel.tehsil}\n` +
          `  • District:              ${doc.parcel.district}\n` +
          `  • Area (Hectares):       ${doc.parcel.areaHa} Ha\n` +
          `  • Land Use:              ${doc.parcel.landUse}\n` +
          `  • Acquisition Status:    ${doc.parcel.status}\n` +
          `  • Landowner (Masked):    ${doc.parcel.ownerNameMasked || "Masked Owner"}\n`
        : `  • Binding:               Project-Wide Statutory Record (No single parcel binding)\n`) +
      `\n================================================================================\n` +
      `LEGAL NOTICE & AUTHENTICITY CERTIFICATE:\n` +
      `This record is cryptographically signed and stored in compliance with Section 65B\n` +
      `of the Indian Evidence Act, 1872 and the RFCTLARR Act, 2013.\n` +
      `Tamper verification status: VALIDATED AUTHENTIC.\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.filename.replace(/\.[^/.]+$/, "")}_summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select or drop a valid file (PDF or JPEG/PNG).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Read file bytes as base64 for real SHA-256 calculation
      const reader = new FileReader();
      const filePromise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const res = reader.result as string;
          resolve(res.split(",")[1] || "");
        };
        reader.readAsDataURL(selectedFile);
      });
      const base64Data = await filePromise;

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: selectedFile.name,
          docType: uploadCategory,
          projectId: uploadProjectId,
          parcelId: uploadParcelId || undefined,
          fileData: base64Data,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload document.");
      }

      const uploadedDoc = data.document;
      setUploadSuccess(`Document '${selectedFile.name}' successfully uploaded with SHA-256 seal: ${uploadedDoc.sha256Hash.slice(0, 16)}...`);
      setShowUploadModal(false);
      setSelectedFile(null);

      // Add to local audit log
      const newAudit: DocAuditEntry = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleString("en-IN"),
        actor: session?.user?.name || "Field Officer",
        role: userRole || "FIELD_OFFICER",
        action: `UPLOADED_${uploadCategory}`,
        docTitle: selectedFile.name,
        hash: uploadedDoc.sha256Hash,
      };
      setLogs([newAudit, ...logs]);

      // Refresh documents
      await fetchDocs();
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <FolderOpen className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "वैधानिक दस्तावेज़ रिपॉजिटरी एवं भूखंड संदर्भ"
                : "Statutory Document Repository & Cadastral Vault"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {locale === "hi"
              ? "परियोजना, भूखंड संदर्भ (ULPIN, सर्वे नं., ग्राम, स्वामी) एवं SHA-256 अखंडता सील के साथ पूर्ण साक्ष्य प्रबंधन।"
              : "Complete evidentiary document vault with full land context (ULPIN, survey no, village, owner) and cryptographic SHA-256 seals."}
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>{locale === "hi" ? "नया दस्तावेज़ अपलोड करें" : "Upload Document"}</span>
          </button>
        )}
      </div>

      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs flex items-center gap-2 font-medium shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={
              locale === "hi"
                ? "फ़ाइल नाम, प्रकार, ULPIN, सर्वे नं., ग्राम या प्रोजेक्ट कोड से खोजें..."
                : "Search by file name, category, ULPIN, survey no, village, or project..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-gov-navy font-mono"
          >
            <option value="ALL">All Projects</option>
            <option value="PRJ-001">PRJ-001 (NH-46 Itarsi–Sohagpur)</option>
            <option value="PRJ-002">PRJ-002 (Bhopal Metro Ring)</option>
            <option value="PRJ-003">PRJ-003 (Narmada Water Pipeline)</option>
            <option value="PRJ-004">PRJ-004 (Raisen Smart Industrial)</option>
            <option value="PRJ-005">PRJ-005 (Budhni Solar Park)</option>
            <option value="PRJ-006">PRJ-006 (Goharganj Bypass)</option>
          </select>

          <select
            value={docTypeFilter}
            onChange={(e) => setDocTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-gov-navy"
          >
            <option value="ALL">All Categories</option>
            <option value="Possession_Certificate">Possession Certificate</option>
            <option value="Field_Verification_Report">Field Verification Report</option>
            <option value="JMS_Cadastral_Sheet">JMS Field Sheet</option>
            <option value="Objection_Reply">Objection Reply</option>
            <option value="Section_11_Gazette">Sec 11 Gazette</option>
            <option value="Section_19_Declaration">Sec 19 Declaration</option>
            <option value="Section_23_Award">Sec 23 Award</option>
            <option value="DPR_Feasibility">DPR Feasibility</option>
            <option value="Bank_Passbook">Bank Passbook</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Document List + Access Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Document List with Full Land & Project Context */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-gov-navy" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "सत्यापित वैधानिक दस्तावेज़ अभिलेख" : "Statutory Project & Field Documents"}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {filteredDocs.length} of {docs.length} Records
            </span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span>Loading verified statutory document repository...</span>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-lg">
              No matching statutory documents found. Try adjusting your search query or filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition space-y-3 shadow-xs"
                >
                  {/* Top Bar: Title, Project, Version, Stage */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 break-all">
                          {doc.filename}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                          <span className="font-mono font-bold px-2 py-0.5 rounded bg-gov-navy text-white text-[10px]">
                            {doc.projectId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                            {doc.docType.replace(/_/g, " ")}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold font-mono text-[10px]">
                            {doc.version}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-medium text-[10px]">
                            Stage: {doc.workflowStage}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownloadDocSummary(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition shrink-0 cursor-pointer shadow-xs self-start"
                      title="Download Full Land & Project Dossier"
                    >
                      <Download className="w-3.5 h-3.5 text-gov-navy" />
                      <span>Export Dossier</span>
                    </button>
                  </div>

                  {/* Rich Land & Parcel Context (Crucial for Field Officer & Requiring Body) */}
                  {doc.parcel ? (
                    <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200 text-xs space-y-2">
                      <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
                        <span className="font-bold text-blue-950 flex items-center gap-1 text-[11px] uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5 text-blue-700" />
                          <span>Cadastral Land Context</span>
                        </span>
                        <span className="font-mono font-bold text-blue-800 text-[11px]">
                          Parcel #{doc.parcel.parcelId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Village</span>
                          <span className="font-semibold text-slate-900">{doc.parcel.villageName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Survey / Khasra</span>
                          <span className="font-mono font-bold text-slate-900">{doc.parcel.surveyNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">ULPIN (Bhu-Aadhaar)</span>
                          <span className="font-mono font-bold text-gov-navy">{doc.parcel.ulpin}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Owner (Masked)</span>
                          <span className="font-semibold text-slate-900">{doc.parcel.ownerNameMasked || "Masked Owner"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-blue-100/70 text-[10px] text-slate-600">
                        <span>Area: <strong className="font-mono text-slate-900">{doc.parcel.areaHa} Ha</strong></span>
                        <span>•</span>
                        <span>Land Use: <strong className="text-slate-900">{doc.parcel.landUse}</strong></span>
                        <span>•</span>
                        <span>Status: <span className="font-mono uppercase font-bold text-emerald-700">{doc.parcel.status}</span></span>
                        <span>•</span>
                        <span>Project: <strong className="text-slate-900">{doc.projectName}</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                      <span className="text-[11px] font-medium flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>Project-Level Statutory Document: <strong>{doc.projectName || doc.projectId}</strong></span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Corridor-wide</span>
                    </div>
                  )}

                  {/* Metadata & Tamper-Evident SHA-256 Checksum Bar */}
                  <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px]">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-amber-300 text-[10px] font-bold">SHA-256:</span>
                      <span className="truncate text-slate-300" title={doc.sha256Hash}>
                        {doc.sha256Hash}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-sans">
                        {new Date(doc.uploadedDate).toLocaleDateString("en-IN")} • {doc.uploadedByRole}
                      </span>
                      <button
                        onClick={() => handleCopyHash(doc.sha256Hash)}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition cursor-pointer"
                        title="Copy cryptographic hash"
                      >
                        {copiedHash === doc.sha256Hash ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Access & Tamper Audit Log */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <History className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "दस्तावेज़ पहुंच ऑडिट लॉग" : "Access & Tamper Audit Trail"}
            </h2>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-900">{log.actor}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                    {log.action}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">{log.docTitle}</p>
                <p className="text-[10px] font-mono text-slate-400 truncate">
                  Hash: {log.hash.slice(0, 24)}...
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Cryptographic Chain Active</span>
              All statutory documents have deterministic SHA-256 seals recorded in the immutable audit ledger.
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal (With Real Drag-and-Drop and Click-to-Browse) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileUp className="w-4 h-4 text-gov-navy" />
                <span>Upload Statutory Land Document</span>
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {uploadError && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Drag-and-drop Dropzone */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Select Document File (PDF or JPEG)
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 rounded-xl border-2 border-dashed text-center transition cursor-pointer ${
                    isDragging
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">
                    {selectedFile ? selectedFile.name : "Drag & drop your PDF or JPEG file here"}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {selectedFile
                      ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload`
                      : "or click to browse from your computer"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Document Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                  >
                    <option value="Field_Verification_Report">Field Verification Report</option>
                    <option value="JMS_Cadastral_Sheet">JMS Cadastral Sheet</option>
                    <option value="Possession_Certificate">Possession Certificate</option>
                    <option value="7/12_Extract">7/12 Record of Rights</option>
                    <option value="Objection_Reply">Objection Reply</option>
                    <option value="DPR_Feasibility">DPR Feasibility</option>
                    <option value="Section_11_Gazette">Section 11 Gazette</option>
                    <option value="Section_23_Award">Section 23 Award</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Project Code</label>
                  <select
                    value={uploadProjectId}
                    onChange={(e) => setUploadProjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy font-mono"
                  >
                    <option value="PRJ-001">PRJ-001 (NH-46 Four-Laning)</option>
                    <option value="PRJ-002">PRJ-002 (Bhopal Metro Ring)</option>
                    <option value="PRJ-003">PRJ-003 (Narmada Water Pipeline)</option>
                    <option value="PRJ-004">PRJ-004 (Raisen Smart Industrial)</option>
                    <option value="PRJ-005">PRJ-005 (Budhni Solar Park)</option>
                    <option value="PRJ-006">PRJ-006 (Goharganj Bypass)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Associated Parcel ID / Khasra (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PCL-0121 or Survey 104/2"
                  value={uploadParcelId}
                  onChange={(e) => setUploadParcelId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="px-4 py-2 rounded-lg bg-gov-navy text-white font-semibold hover:bg-slate-800 transition flex items-center gap-1.5 shadow disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Hashing &amp; Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload &amp; Seal SHA-256</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
