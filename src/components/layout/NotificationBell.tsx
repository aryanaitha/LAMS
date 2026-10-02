"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Bell, AlertTriangle, CheckCircle2, Clock, Check, X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  time: string;
  timeHi: string;
  type: "SLA" | "OBJECTION" | "AWARD" | "PAYMENT";
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "SLA Urgent Alert",
    titleHi: "एसएलए तत्काल चेतावनी",
    message: "Section 11 Preliminary Notification scrutiny deadline in 4 days (NH-2026-084).",
    messageHi: "धारा 11 प्रारंभिक अधिसूचना संवीक्षा की अंतिम तिथि में 4 दिन शेष (एनएच-2026-084)।",
    time: "10 mins ago",
    timeHi: "10 मिनट पहले",
    type: "SLA",
    unread: true,
  },
  {
    id: "notif-2",
    title: "New Objection Registered",
    titleHi: "नई आपत्ति दर्ज",
    message: "Landowner objection submitted for Survey 104/2 regarding horticulture valuation.",
    messageHi: "उद्यानिकी मूल्यांकन के संबंध में सर्वे 104/2 के लिए भू-स्वामी आपत्ति दर्ज।",
    time: "2 hours ago",
    timeHi: "2 घंटे पहले",
    type: "OBJECTION",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Statutory Award Sanctioned",
    titleHi: "वैधानिक अधिनिर्णय स्वीकृत",
    message: "Section 23 Award approved by Competent Authority for Ranwad Village.",
    messageHi: "रानवड गांव हेतु सक्षम प्राधिकारी द्वारा धारा 23 अधिनिर्णय स्वीकृत।",
    time: "Yesterday",
    timeHi: "कल",
    type: "AWARD",
    unread: false,
  },
  {
    id: "notif-4",
    title: "PFMS DBT Credit Verified",
    titleHi: "पीएफएमएस डीबीटी क्रेडिट सत्यापित",
    message: "Direct benefit transfer batch #9042 successfully released to escrow.",
    messageHi: "प्रत्यक्ष लाभ अंतरण बैच #9042 सफलतापूर्वक एस्क्रो में जारी।",
    time: "2 days ago",
    timeHi: "2 दिन पहले",
    type: "PAYMENT",
    unread: false,
  },
];

export function NotificationBell() {
  const { locale } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "SLA":
        return <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
      case "OBJECTION":
        return <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />;
      case "AWARD":
      case "PAYMENT":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        title={locale === "hi" ? "सूचनाएं" : "Notifications"}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 text-slate-800">
          <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {locale === "hi" ? "प्रणाली सूचनाएं" : "System Notifications"}
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-500/80 text-[10px] rounded-full font-mono font-bold">
                  {unreadCount} {locale === "hi" ? "नई" : "new"}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium transition"
              >
                <Check className="w-3 h-3" />
                <span>{locale === "hi" ? "सभी पढ़े हुए चिह्नित करें" : "Mark all read"}</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex gap-3 text-xs transition hover:bg-slate-50 ${
                  item.unread ? "bg-amber-50/40" : "bg-white"
                }`}
              >
                {getIcon(item.type)}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      {locale === "hi" ? item.titleHi : item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {locale === "hi" ? item.timeHi : item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {locale === "hi" ? item.messageHi : item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-mono">
              RFCTLARR Statutory SLA Engine & Event Bus
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
