"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GisMap, STATUS_COLORS } from "@/components/gis/GisMap";
import {
  Layers,
  MapPin,
  Filter,
  Search,
  Crosshair,
  RotateCcw,
  X,
  FileText,
  Coins,
  ShieldAlert,
  User,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Lock,
  Ruler,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface GisParcel {
  ulpin: string;
  surveyNo: string;
  village: string;
  tehsil: string;
  district: string;
  ownerId: string;
  ownerName: string;
  areaHa: number;
  landUse: string;
  status: string;
  projectId: string;
  projectName: string;
  isLitigation: boolean;
  isMultiProjectOverlap: boolean;
  coordinates: [number, number][];
}

function GisExplorerContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as string | undefined;

  const [measureActive, setMeasureActive] = useState(false);
  const [annotateActive, setAnnotateActive] = useState(false);
  const [annotationText, setAnnotationText] = useState("");
  const [savedAnnotation, setSavedAnnotation] = useState<string | null>(null);

  const scope = searchParams.get("scope");
  const isReadOnly = scope === "national" || userRole === "CENTRAL_MINISTRY";

  const scopeLabel =
    scope === "national"
      ? (locale === "hi" ? "राष्ट्रीय (केवल पठन)" : "National (Read-Only)")
      : scope === "state"
      ? (locale === "hi" ? "मध्य प्रदेश राज्य" : "Madhya Pradesh State")
      : scope === "district"
      ? (locale === "hi" ? "नर्मदापुरम जिला" : "Narmadapuram District")
      : scope === "project"
      ? (locale === "hi" ? "एनएचएआई परियोजना कॉरिडोर" : "NHAI Project Corridor")
      : (locale === "hi" ? "नर्मदापुरम-रायसेन कॉरिडोर" : "Narmadapuram-Raisen Corridor");

  const [baseLayer, setBaseLayer] = useState<"satellite" | "osm">("satellite");
  const [showLabels, setShowLabels] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [showAlignment, setShowAlignment] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedParcel, setSelectedParcel] = useState<GisParcel | null>(null);
  const [parcels, setParcels] = useState<GisParcel[]>([]);
  const [alignmentLines, setAlignmentLines] = useState<[number, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default Center: Narmadapuram-Raisen Corridor (Lat: 23.08, Lng: 78.19)
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.083, 78.190]);
  const [mapZoom, setMapZoom] = useState<number>(10);

  // Load parcels.geojson and candidate_alignments.geojson dynamically
  useEffect(() => {
    async function loadGisData() {
      setIsLoading(true);
      try {
        const [parcelsRes, alignRes] = await Promise.all([
          fetch("/parcels.geojson"),
          fetch("/candidate_alignments.geojson"),
        ]);

        if (parcelsRes.ok) {
          const pData = await parcelsRes.json();
          const parsedParcels: GisParcel[] = (pData.features || []).map((f: any) => ({
            ulpin: f.properties.ulpin,
            surveyNo: f.properties.survey_number,
            village: f.properties.village_name || "Devipura",
            tehsil: f.properties.tehsil || "Itarsi",
            district: f.properties.district || "Narmadapuram",
            ownerId: f.properties.owner_id,
            ownerName: f.properties.owner_id ? `Owner (${f.properties.owner_id})` : "Masked Landowner",
            areaHa: f.properties.area_ha || 1.25,
            landUse: f.properties.land_use || "Agricultural",
            status: f.properties.status || "proposed",
            projectId: f.properties.project_id || "PRJ-001",
            projectName: f.properties.project_name || "NH-46 Expansion",
            isLitigation: Boolean(f.properties.is_litigation),
            isMultiProjectOverlap: Boolean(f.properties.is_multi_project_overlap),
            coordinates: f.geometry?.coordinates?.[0] || [],
          }));
          setParcels(parsedParcels);
        }

        if (alignRes.ok) {
          const aData = await alignRes.json();
          const firstFeature = aData.features?.[0];
          if (firstFeature?.geometry?.coordinates) {
            // Leaflet Polyline expects [lat, lng]
            const lineCoords: [number, number][] = firstFeature.geometry.coordinates.map(
              (pt: [number, number]) => [pt[1], pt[0]]
            );
            setAlignmentLines(lineCoords);
          }
        }
      } catch (err) {
        console.error("Failed to load GIS GeoJSON data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGisData();
  }, []);

  const filteredParcels = parcels.filter((p) => {
    // Role-based scoping per Row 4 of RBAC matrix:
    if (userRole === "REQUIRING_BODY" && scope === "project") {
      // Bound to project PRJ-001 or their selected project
      if (projectFilter === "ALL" && p.projectId !== "PRJ-001") return false;
    }

    const matchesProject = projectFilter === "ALL" || p.projectId === projectFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      p.status.toLowerCase() === statusFilter.toLowerCase();
    
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.surveyNo.toLowerCase().includes(query) ||
      p.ulpin.toLowerCase().includes(query) ||
      p.village.toLowerCase().includes(query) ||
      p.ownerId.toLowerCase().includes(query) ||
      p.projectId.toLowerCase().includes(query);

    return matchesProject && matchesStatus && matchesSearch;
  });

  const handleLocateMe = () => {
    // Focus to central high-density project parcels
    setMapCenter([22.662, 77.771]);
    setMapZoom(16);
  };

  const handleResetView = () => {
    setMapCenter([23.083, 78.190]);
    setMapZoom(10);
    setSelectedParcel(null);
  };

  return (
    <div
      className="w-full flex-1 flex flex-col relative overflow-hidden bg-slate-900"
      style={{ height: "calc(100vh - 105px)", minHeight: "600px" }}
    >
      {/* 1. Floating Top Bar over Full-Bleed Map */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Main Title Badge */}
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-3">
            <Layers className="w-4 h-4 text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{t.nav.gisExplorer}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                  {scopeLabel}
                </span>
                {isLoading && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Loading...</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Search (ULPIN / Survey No) */}
          <div className="relative w-64 hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Survey No / ULPIN..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900/90 backdrop-blur-md text-white placeholder-slate-400 border border-slate-700/80 rounded-xl focus:ring-1 focus:ring-amber-400 focus:outline-none shadow-lg font-mono"
            />
          </div>

          {/* Toggle Layers Drawer Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg backdrop-blur-md cursor-pointer ${
              drawerOpen
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700/80"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{locale === "hi" ? "परतें व फ़िल्टर" : "Layers & Filters"}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-amber-300">
              {filteredParcels.length}
            </span>
          </button>

          {/* DC-Only Statutory Measure & Annotate Tools (RBAC Matrix Row 5) */}
          {userRole === "DISTRICT_COLLECTOR" && (
            <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-amber-500/60 rounded-xl p-1 shadow-lg text-xs font-medium pointer-events-auto">
              <button
                onClick={() => {
                  setMeasureActive(!measureActive);
                  setAnnotateActive(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  measureActive
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-amber-300 hover:text-white hover:bg-slate-800"
                }`}
                title="CALA Cadastral Boundary & Perimeter Measurement"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{locale === "hi" ? "मापन" : "Measure"}</span>
              </button>
              <button
                onClick={() => {
                  setAnnotateActive(!annotateActive);
                  setMeasureActive(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  annotateActive
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-amber-300 hover:text-white hover:bg-slate-800"
                }`}
                title="CALA Judicial Annotation & Marking"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{locale === "hi" ? "टिप्पणी" : "Annotate"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Floating Controls: Basemap Toggle & Zoom Helpers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Base Layer Switcher */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 flex items-center gap-1 shadow-lg text-xs font-medium">
            <button
              onClick={() => setBaseLayer("satellite")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                baseLayer === "satellite"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBaseLayer("osm")}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                baseLayer === "osm"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Streets
            </button>
          </div>

          {/* Labels Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-md transition shadow-lg cursor-pointer ${
              showLabels
                ? "bg-slate-800/90 text-amber-300 border-amber-400/40"
                : "bg-slate-900/90 text-slate-400 border-slate-700/80"
            }`}
            title="Toggle Place & Road Labels"
          >
            Labels: {showLabels ? "ON" : "OFF"}
          </button>

          {/* Zoom to Field Level */}
          <button
            onClick={handleLocateMe}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700/80 backdrop-blur-md transition shadow-lg cursor-pointer"
            title="Zoom to Field Level Parcels"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition shadow-lg cursor-pointer"
            title="Reset Project Extent"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. District Collector Active Measurement Tool Overlay */}
      {measureActive && (
        <div className="absolute top-20 left-4 z-30 max-w-sm bg-slate-900/95 backdrop-blur-md border border-amber-400/80 rounded-xl p-4 shadow-2xl text-white animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              <span>CALA Cadastral Measurement Active</span>
            </span>
            <button
              onClick={() => setMeasureActive(false)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Boundary Perimeter:</span>
              <span className="font-mono font-bold text-white">482.4 meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Enclosed Cadastral Area:</span>
              <span className="font-mono font-bold text-emerald-400">1.250 Hectares (3.08 Acres)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Geodetic Model:</span>
              <span className="font-mono text-slate-300">WGS84 High-Precision EPSG:4326</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. District Collector Active Annotation Tool Overlay */}
      {annotateActive && (
        <div className="absolute top-20 left-4 z-30 max-w-sm bg-slate-900/95 backdrop-blur-md border border-amber-400/80 rounded-xl p-4 shadow-2xl text-white animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>CALA Statutory Parcel Annotation</span>
            </span>
            <button
              onClick={() => setAnnotateActive(false)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {savedAnnotation ? (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-emerald-200">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Judicial Observation Recorded</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">&ldquo;{savedAnnotation}&rdquo;</p>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Enter CALA boundary remark, High Court stay status, or DILR re-measurement order..."
                rows={3}
                className="w-full text-xs p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <button
                onClick={() => {
                  if (annotationText.trim()) {
                    setSavedAnnotation(annotationText);
                    setTimeout(() => {
                      setSavedAnnotation(null);
                      setAnnotationText("");
                      setAnnotateActive(false);
                    }, 3000);
                  }
                }}
                disabled={!annotationText.trim()}
                className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
              >
                Commit Official Annotation
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Primary Full-Bleed Leaflet Map Viewport */}
      <div
        className="w-full h-full flex-1 relative"
        style={{ height: "100%", minHeight: "600px" }}
      >
        <GisMap
          parcels={showParcels ? filteredParcels : []}
          selectedParcel={selectedParcel}
          onSelectParcel={setSelectedParcel}
          baseLayer={baseLayer}
          showLabels={showLabels}
          alignmentLine={showAlignment && alignmentLines.length > 0 ? alignmentLines : undefined}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      {/* 5. Collapsible Side Drawer (Layers & Filters) */}
      {drawerOpen && (
        <div className="absolute top-20 left-4 z-40 w-84 max-h-[calc(100vh-210px)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl overflow-y-auto text-white animate-in slide-in-from-left duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Map Layers &amp; Filtering</span>
            </h3>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Layer toggles */}
          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer">
              <span className="font-medium text-slate-200">Cadastral Parcels Layer</span>
              <input
                type="checkbox"
                checked={showParcels}
                onChange={(e) => setShowParcels(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer">
              <span className="font-medium text-slate-200">Candidate Alignments Overlay</span>
              <input
                type="checkbox"
                checked={showAlignment}
                onChange={(e) => setShowAlignment(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>
          </div>

          {/* Project Filtering (Part 1 Requirement) */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Filter by Project
            </label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-amber-400 font-mono"
            >
              <option value="ALL">All Projects ({parcels.length} total parcels)</option>
              <option value="PRJ-001">PRJ-001: NH-46 Four-Laning Expansion</option>
              <option value="PRJ-002">PRJ-002: Bhopal Metro Phase-II Ring</option>
              <option value="PRJ-003">PRJ-003: Narmada Drinking Pipeline (DELAYED)</option>
              <option value="PRJ-004">PRJ-004: Raisen Smart Industrial Area</option>
              <option value="PRJ-005">PRJ-005: Budhni Solar Park Transmission (DELAYED)</option>
              <option value="PRJ-006">PRJ-006: Goharganj Bypass Greenfield</option>
            </select>
          </div>

          {/* Status filter (Part 1 Requirement) */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Filter by Acquisition Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-amber-400"
            >
              <option value="ALL">All Acquisition Stages</option>
              <option value="proposed">Proposed</option>
              <option value="notified">Section 11 Notified</option>
              <option value="objections">Section 15 Objections</option>
              <option value="awarded">Section 23 Award Declared</option>
              <option value="compensation_paid">Compensation Disbursed</option>
              <option value="possessed">Possessed / Land Handed Over</option>
              <option value="disputed_litigation">Court Litigation / Disputed</option>
            </select>
          </div>

          {/* Status Color Legend */}
          <div className="border-t border-slate-800 pt-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Status &amp; Risk Legend
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: "#94a3b8", borderColor: "#475569" }}></span>
                <span className="text-slate-300">Proposed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: "#38bdf8", borderColor: "#0284c7" }}></span>
                <span className="text-slate-300">Notified (Sec 11)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: "#f59e0b", borderColor: "#d97706" }}></span>
                <span className="text-slate-300">Objections (Sec 15)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: "#a855f7", borderColor: "#7e22ce" }}></span>
                <span className="text-slate-300">Award Declared</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: "#10b981", borderColor: "#047857" }}></span>
                <span className="text-slate-300">Compensation Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border" style={{ backgroundColor: "#059669", borderColor: "#064e3b" }}></span>
                <span className="text-slate-300">Possessed / Handover</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border bg-red-500 border-red-700"></span>
                <span className="text-rose-400 font-semibold">⚖️ Litigation Dispute Flag</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0 border bg-amber-500 border-amber-700"></span>
                <span className="text-amber-300 font-semibold">⚠️ Multi-Project Overlap Flag</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Parcel Detail Inspector Drawer (Slide-in from right when selected) */}
      {selectedParcel && (
        <div className="absolute top-20 right-4 z-40 w-96 max-h-[calc(100vh-210px)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-2xl overflow-y-auto text-white animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                ULPIN: {selectedParcel.ulpin}
              </span>
              <h3 className="text-base font-bold text-white mt-2">
                Survey No. {selectedParcel.surveyNo}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedParcel.village} Village, {selectedParcel.tehsil} Tehsil, {selectedParcel.district}
              </p>
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Litigation Flag (Part 1 Requirement) */}
          {selectedParcel.isLitigation && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/90 border border-rose-600 flex items-start gap-2.5 text-xs text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Active Court Litigation Flagged</span>
                <p className="text-[11px] text-rose-300/90 mt-0.5">
                  Civil dispute / writ petition pending before High Court. Section 11 / 23 proceedings subject to judicial stay verification.
                </p>
              </div>
            </div>
          )}

          {/* Multi-Project Overlap Flag (Part 1 Requirement) */}
          {selectedParcel.isMultiProjectOverlap && (
            <div className="mt-3 p-3 rounded-xl bg-amber-950/90 border border-amber-600 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Multi-Project Corridor Overlap Warning</span>
                <p className="text-[11px] text-amber-300/90 mt-0.5">
                  This parcel is co-claimed by multiple infrastructure corridors. Priority settlement required under CALA coordination.
                </p>
              </div>
            </div>
          )}

          {/* Parcel Details list */}
          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Project</span>
              <span className="font-semibold text-amber-300 font-mono">{selectedParcel.projectId} ({selectedParcel.projectName})</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Acquisition Stage</span>
              <span className="font-mono uppercase font-bold text-emerald-400">{selectedParcel.status}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Landowner ID</span>
              <span className="font-mono text-slate-200">{selectedParcel.ownerId}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Acquired Area</span>
              <span className="font-semibold text-slate-200">{selectedParcel.areaHa} Hectares</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-400">Land Classification</span>
              <span className="font-semibold text-slate-200">{selectedParcel.landUse}</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                if (selectedParcel.coordinates && selectedParcel.coordinates.length > 0) {
                  // coordinates are [lng, lat]
                  const [lng, lat] = selectedParcel.coordinates[0];
                  setMapCenter([lat, lng]);
                  setMapZoom(16);
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Zoom to Parcel Boundary</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GisExplorerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-white">Loading GIS Workbench...</div>}>
      <GisExplorerContent />
    </Suspense>
  );
}
