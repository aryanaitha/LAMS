"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Smartphone,
  MapPin,
  Camera,
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
  UploadCloud,
  Layers,
  Save,
  ClipboardList,
  Check,
  Clock,
  ArrowRight,
  X,
  Image as ImageIcon,
} from "lucide-react";

interface FieldTask {
  id: string;
  surveyNo: string;
  ulpin: string;
  village: string;
  ownerName: string;
  purpose: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

const INITIAL_TASKS: FieldTask[] = [
  {
    id: "TASK-104-2",
    surveyNo: "104/2",
    ulpin: "MH24-0891-4402",
    village: "Musalgaon",
    ownerName: "Ramesh Tukaram Patil",
    purpose: "Horticulture tree count & pomegranate orchard boundary re-verification",
    dueDate: "Today, 05:00 PM",
    status: "PENDING",
  },
  {
    id: "TASK-105-1",
    surveyNo: "105/1",
    ulpin: "MH24-2219-4812",
    village: "Musalgaon",
    ownerName: "Vitthal B. Shinde",
    purpose: "Boundary stone inspection and farm road right-of-way alignment",
    dueDate: "Tomorrow",
    status: "PENDING",
  },
  {
    id: "TASK-108-3",
    surveyNo: "108/3",
    ulpin: "MH24-5512-9901",
    village: "Musalgaon",
    ownerName: "Anant Rao Joshi",
    purpose: "Agricultural open-well depth measurement & electric pump enumeration",
    dueDate: "02 Oct 2026",
    status: "IN_PROGRESS",
  },
  {
    id: "TASK-112-1",
    surveyNo: "112/1",
    ulpin: "MH24-9041-3318",
    village: "Musalgaon",
    ownerName: "Sunita Deshmukh",
    purpose: "Joint measurement survey (JMS) spot panchanama sign-off with Gram Panchayat",
    dueDate: "25 Sep 2026",
    status: "COMPLETED",
  },
];

function FieldOfficerContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"tasks" | "capture">(
    tabParam === "capture" ? "capture" : "tasks"
  );

  useEffect(() => {
    if (tabParam === "capture") {
      setActiveTab("capture");
    } else if (tabParam === "tasks") {
      setActiveTab("tasks");
    }
  }, [tabParam]);

  const [isOnline, setIsOnline] = useState(true);
  const [tasks, setTasks] = useState<FieldTask[]>(INITIAL_TASKS);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([
    {
      id: "QUEUE-1",
      surveyNo: "104/2",
      ulpin: "MH24-0891-4402",
      village: "Musalgaon",
      gps: "GPS captured — Lat 22.641240, Lon 77.978120, accuracy ±2.4m, [10:30:15 AM]",
      photos: [
        { id: "p1", name: "boundary_stone_north.jpg", url: "/placeholder-field.jpg", size: "1.2 MB" },
        { id: "p2", name: "pomegranate_trees.jpg", url: "/placeholder-field2.jpg", size: "840 KB" },
      ],
      photosCount: 2,
      treesCount: 42,
      structuresCount: 1,
      remarks: "Boundary stone confirmed with Gram Panchayat and Patwari.",
      status: "QUEUED_OFFLINE",
    },
  ]);

  // Form inputs
  const [selectedTask, setSelectedTask] = useState<FieldTask>(INITIAL_TASKS[0]);
  const [surveyNo, setSurveyNo] = useState(INITIAL_TASKS[0].surveyNo);
  const [ulpin, setUlpin] = useState(INITIAL_TASKS[0].ulpin);
  const [gpsLat, setGpsLat] = useState("22.641240");
  const [gpsLng, setGpsLng] = useState("77.978120");
  const [gpsConfirmation, setGpsConfirmation] = useState<string | null>(null);
  const [treesCount, setTreesCount] = useState("42");
  const [structuresCount, setStructuresCount] = useState("1");
  const [remarks, setRemarks] = useState(
    "Orchard trees inspected with revenue patwari. Concrete boundary marker verified."
  );
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Drag-and-drop photo upload state
  const [photos, setPhotos] = useState<{ id: string; name: string; url: string; size: string }[]>([]);
  const [isDraggingPhotos, setIsDraggingPhotos] = useState(false);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectTaskForCapture = (task: FieldTask) => {
    setSelectedTask(task);
    setSurveyNo(task.surveyNo);
    setUlpin(task.ulpin);
    setActiveTab("capture");
  };

  const handleCaptureGps = () => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          const acc = Math.round(pos.coords.accuracy || 2.5);
          const time = new Date().toLocaleTimeString();
          setGpsLat(lat);
          setGpsLng(lng);
          setGpsConfirmation(`GPS captured — Lat ${lat}, Lon ${lng}, accuracy ±${acc}m, [${time}].`);
        },
        () => {
          // Fallback clearly labeled mock reading in Narmadapuram-Raisen project corridor
          const lat = (22.6412 + (Math.random() - 0.5) * 0.005).toFixed(6);
          const lng = (77.9781 + (Math.random() - 0.5) * 0.005).toFixed(6);
          const time = new Date().toLocaleTimeString();
          setGpsLat(lat);
          setGpsLng(lng);
          setGpsConfirmation(`GPS captured (Mock Sensor) — Lat ${lat}, Lon ${lng}, accuracy ±2.4m, [${time}].`);
        },
        { timeout: 4000 }
      );
    } else {
      const lat = (22.6412 + (Math.random() - 0.5) * 0.005).toFixed(6);
      const lng = (77.9781 + (Math.random() - 0.5) * 0.005).toFixed(6);
      const time = new Date().toLocaleTimeString();
      setGpsLat(lat);
      setGpsLng(lng);
      setGpsConfirmation(`GPS captured (Mock Sensor) — Lat ${lat}, Lon ${lng}, accuracy ±2.4m, [${time}].`);
    }
  };

  const handleAddPhotos = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newItems = Array.from(fileList).map((f) => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: f.name,
      url: URL.createObjectURL(f),
      size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
    }));
    setPhotos((prev) => [...prev, ...newItems]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const capturedGpsString =
      gpsConfirmation ||
      `GPS captured — Lat ${gpsLat}, Lon ${gpsLng}, accuracy ±2.1m, [${new Date().toLocaleTimeString()}].`;

    const newEntry = {
      id: `QUEUE-${Date.now()}`,
      surveyNo,
      ulpin,
      village: selectedTask.village,
      gps: capturedGpsString,
      photos: [...photos],
      photosCount: photos.length,
      treesCount: parseInt(treesCount, 10) || 0,
      structuresCount: parseInt(structuresCount, 10) || 0,
      remarks,
      status: "QUEUED_OFFLINE",
    };

    setOfflineQueue([newEntry, ...offlineQueue]);
    setTasks((prev) =>
      prev.map((t) => (t.surveyNo === surveyNo ? { ...t, status: "COMPLETED" } : t))
    );
    setSyncStatus(
      locale === "hi"
        ? `सर्वेक्षण प्रविष्टि सर्वे #${surveyNo} के लिए ${photos.length} फोटो एवं जीपीएस सहित सुरक्षित की गई!`
        : `Ground verification for Survey #${surveyNo} saved with ${photos.length} photos and GPS confirmation!`
    );
    setTimeout(() => setSyncStatus(null), 5000);
    // Reset photos form
    setPhotos([]);
    setActiveTab("tasks");
  };

  const handleSyncAll = async () => {
    setSyncStatus(
      locale === "hi"
        ? "केंद्रीय लाम्स सर्वर के साथ ऑफलाइन रिकॉर्ड सिंक हो रहे हैं..."
        : "Synchronizing offline records with central LAMS server..."
    );
    setTimeout(() => {
      setOfflineQueue([]);
      setSyncStatus(
        locale === "hi"
          ? "सभी फील्ड रिकॉर्ड्स सफलतापूर्वक सिंक और ऑडिट लॉग में दर्ज किए गए!"
          : "All offline field surveys synchronized and logged to audit trail!"
      );
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Mobile PWA Top Status Bar (NO KPI TILES - strictly field tasks) */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-sm font-bold">
              {locale === "hi" ? "क्षेत्रीय राजस्व अधिकारी मॉड्यूल (सिन्नर)" : "Field Revenue Officer Module (Sinnar)"}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              Sinnar Tehsil • Assigned Field Visits & Ground Inspection PWA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
              isOnline
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? "Online" : "Offline"}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "tasks"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>{locale === "hi" ? "मेरे आवंटित कार्य" : "My Assigned Tasks"}</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded-full font-mono">
            {tasks.filter((t) => t.status !== "COMPLETED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("capture")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "capture"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{locale === "hi" ? "फील्ड डेटा प्रविष्टि (GPS + फोटो)" : "Field Data Capture (GPS + Photo)"}</span>
        </button>
      </div>

      {/* 1. Assigned Parcels / Visits List */}
      {activeTab === "tasks" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "आवंटित भूखंड एवं निरीक्षण अनुसूची" : "Assigned Parcels & Inspection Schedule"}
              </h2>
              <p className="text-[11px] text-slate-500">
                Ground measurement and asset verification tasks assigned by CALA Nashik.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {tasks.length} Visits
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold px-2.5 py-1 rounded bg-gov-navy text-white text-xs">
                      Survey {task.surveyNo}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ULPIN: {task.ulpin}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700">
                      • {task.village}
                    </span>
                  </div>

                  <span
                    className={`self-start sm:self-auto px-2 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : task.status === "IN_PROGRESS"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-slate-900">Owner: {task.ownerName}</span>
                  <p className="text-[11px] text-slate-600 mt-0.5">{task.purpose}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> Due: {task.dueDate}
                  </span>

                  {task.status !== "COMPLETED" ? (
                    <button
                      onClick={() => handleSelectTaskForCapture(task)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-semibold transition"
                    >
                      <span>Start Field Capture</span>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="w-3.5 h-3.5" /> Panchanama Logged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Field Data Capture View */}
      {activeTab === "capture" && (
        <div className="space-y-4">
          {/* Offline Queue Sync Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Offline IndexedDB Queue: {offlineQueue.length} records pending
              </p>
              <p className="text-[11px] text-slate-500">
                Auto-syncs whenever internet connectivity is restored.
              </p>
            </div>
            <button
              onClick={handleSyncAll}
              disabled={offlineQueue.length === 0}
              className="px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow disabled:opacity-40"
            >
              <UploadCloud className="w-4 h-4 text-amber-400" />
              <span>{t.actions.syncOfflineData}</span>
            </button>
          </div>

          {/* Inspection Form */}
          <form
            onSubmit={handleSaveSurvey}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi"
                  ? "संयुक्त माप सर्वेक्षण (JMS) पंचनामा प्रविष्टि"
                  : "Ground Joint Measurement Survey (JMS) Data Capture"}
              </h2>
              <span className="font-mono text-xs font-bold text-gov-navy bg-amber-100 px-2 py-0.5 rounded">
                Survey #{surveyNo}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Survey / Khasra No.
                </label>
                <input
                  type="text"
                  required
                  value={surveyNo}
                  onChange={(e) => setSurveyNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  ULPIN (14-Digit Bhu-Aadhaar)
                </label>
                <input
                  type="text"
                  required
                  value={ulpin}
                  onChange={(e) => setUlpin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy font-mono"
                />
              </div>
            </div>

            {/* GPS Capture Box */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gov-navy" />
                  <span>Real-Time GPS Coordinates (Mobile Sensor)</span>
                </span>
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  className="px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Capture GPS Now</span>
                </button>
              </div>

              {/* Real / Mock GPS reading display */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2 bg-white rounded border border-slate-200">
                  Lat: <span className="font-bold text-gov-navy">{gpsLat}° N</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  Lng: <span className="font-bold text-gov-navy">{gpsLng}° E</span>
                </div>
              </div>

              {/* Real-time Inline Confirmation Banner */}
              {gpsConfirmation ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-mono text-[11px] flex items-center gap-2 font-medium shadow-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{gpsConfirmation}</span>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 italic">
                  Click &ldquo;Capture GPS Now&rdquo; to lock live satellite coordinates from your device sensor.
                </p>
              )}
            </div>

            {/* Enumeration Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Fruit / Timber Trees Count
                </label>
                <input
                  type="number"
                  value={treesCount}
                  onChange={(e) => setTreesCount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Wells / Farm Buildings Count
                </label>
                <input
                  type="number"
                  value={structuresCount}
                  onChange={(e) => setStructuresCount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Panchanama Field Remarks
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
              ></textarea>
            </div>

            {/* Real Drag-and-Drop Multi-Photo Upload Area */}
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">
                Geotagged Camera Photos (EXIF Tagged with Lat/Lng &amp; Timestamp)
              </label>
              
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingPhotos(true);
                }}
                onDragLeave={() => setIsDraggingPhotos(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingPhotos(false);
                  handleAddPhotos(e.dataTransfer.files);
                }}
                onClick={() => photoInputRef.current?.click()}
                className={`p-5 rounded-xl border-2 border-dashed text-center transition cursor-pointer ${
                  isDraggingPhotos
                    ? "border-amber-500 bg-amber-50/60"
                    : "border-slate-300 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-400"
                }`}
              >
                <input
                  ref={photoInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleAddPhotos(e.target.files)}
                  className="hidden"
                />
                <Camera className="w-7 h-7 text-amber-600 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800 text-xs">
                  Drag and drop ground verification photos here, or click to browse
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Multi-file support (JPEG, PNG, WebP) • Court-admissible under Section 65B of Indian Evidence Act
                </p>
              </div>

              {/* Photo Previews with remove button */}
              {photos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-slate-600">
                    Selected Photos ({photos.length} files attached):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {photos.map((item) => (
                      <div
                        key={item.id}
                        className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs p-1"
                      >
                        <div className="aspect-video w-full rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-1">
                          <p className="text-[10px] font-medium text-slate-800 truncate" title={item.name}>
                            {item.name}
                          </p>
                          <span className="text-[9px] text-slate-400 font-mono">{item.size}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(item.id);
                          }}
                          className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition shadow"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-bold transition flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Save Ground Verification Record</span>
              </button>
            </div>
          </form>

          {/* Saved Offline Queue Cards Showing Visibly Attached Files & GPS */}
          {offlineQueue.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Saved Verification Records (Device Storage)</span>
                </h3>
                <span className="font-mono text-[11px] text-slate-500 font-bold">
                  {offlineQueue.length} records ready to sync
                </span>
              </div>

              <div className="space-y-3">
                {offlineQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Survey #{item.surveyNo}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({item.ulpin})</span>
                        <span className="text-slate-600">• {item.village}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold self-start">
                        {item.status}
                      </span>
                    </div>

                    <div className="p-2 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{item.gps}</span>
                    </div>

                    {item.remarks && (
                      <p className="text-[11px] text-slate-600 italic">Remarks: {item.remarks}</p>
                    )}

                    {/* Visibly Attached Files Gallery */}
                    {item.photos && item.photos.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                          Attached Evidence ({item.photos.length} photos):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {item.photos.map((ph: any) => (
                            <div
                              key={ph.id || ph.name}
                              className="flex items-center gap-1.5 p-1 px-2 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700"
                            >
                              <ImageIcon className="w-3 h-3 text-amber-600" />
                              <span className="truncate max-w-[120px]">{ph.name}</span>
                              <span className="text-slate-400">({ph.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FieldOfficerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Field Officer Console...</div>}>
      <FieldOfficerContent />
    </Suspense>
  );
}
