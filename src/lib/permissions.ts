import React from "react";

export type UserRole =
  | "CENTRAL_MINISTRY"
  | "STATE_OFFICER"
  | "DISTRICT_COLLECTOR"
  | "REQUIRING_BODY"
  | "FIELD_OFFICER"
  | "LANDOWNER"
  | "ADMIN";

export interface RoleConfig {
  role: UserRole;
  label: string;
  labelHi: string;
  scope: string;
  scopeHi: string;
  title: string;
  titleHi: string;
  indicator: string;
  indicatorHi: string;
  defaultPath: string;
  email: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  CENTRAL_MINISTRY: {
    role: "CENTRAL_MINISTRY",
    label: "Central Ministry",
    labelHi: "केंद्रीय मंत्रालय",
    scope: "National (DoLR / MoRD)",
    scopeHi: "राष्ट्रीय (भूमि संसाधन विभाग)",
    title: "Central Ministry – National Overview",
    titleHi: "केंद्रीय मंत्रालय – राष्ट्रीय अवलोकन",
    indicator: "Central Ministry – National (DoLR)",
    indicatorHi: "केंद्रीय मंत्रालय – राष्ट्रीय (डीओएलआर)",
    defaultPath: "/dashboard/central",
    email: "central.ministry@lams.gov.in",
  },
  STATE_OFFICER: {
    role: "STATE_OFFICER",
    label: "State Government",
    labelHi: "राज्य सरकार",
    scope: "Maharashtra State",
    scopeHi: "महाराष्ट्र राज्य",
    title: "State Government – Maharashtra",
    titleHi: "राज्य सरकार – महाराष्ट्र",
    indicator: "State Government – Maharashtra",
    indicatorHi: "राज्य सरकार – महाराष्ट्र",
    defaultPath: "/dashboard/state",
    email: "state.maharashtra@lams.gov.in",
  },
  DISTRICT_COLLECTOR: {
    role: "DISTRICT_COLLECTOR",
    label: "District Collector / CALA",
    labelHi: "जिला कलेक्टर / सीएएलए",
    scope: "Nashik District",
    scopeHi: "नासिक जिला",
    title: "District Collector & CALA – Nashik",
    titleHi: "जिला कलेक्टर एवं सीएएलए – नासिक",
    indicator: "District Collector – Nashik",
    indicatorHi: "जिला कलेक्टर – नासिक",
    defaultPath: "/dashboard/collector",
    email: "collector.nashik@lams.gov.in",
  },
  REQUIRING_BODY: {
    role: "REQUIRING_BODY",
    label: "Project Implementing Body",
    labelHi: "परियोजना क्रियान्वयन निकाय",
    scope: "NHAI Western Region",
    scopeHi: "एनएचएआई पश्चिमी क्षेत्र",
    title: "Project Implementing Body – NHAI",
    titleHi: "परियोजना क्रियान्वयन निकाय – एनएचएआई",
    indicator: "Project Implementing Body – NHAI",
    indicatorHi: "परियोजना निकाय – एनएचएआई",
    defaultPath: "/dashboard/requiring-body",
    email: "nhai.projects@lams.gov.in",
  },
  FIELD_OFFICER: {
    role: "FIELD_OFFICER",
    label: "Field Officer",
    labelHi: "क्षेत्रीय राजस्व अधिकारी",
    scope: "Sinnar Tehsil",
    scopeHi: "सिन्नर तहसील",
    title: "Field Officer – Sinnar Tehsil",
    titleHi: "क्षेत्रीय अधिकारी – सिन्नर तहसील",
    indicator: "Field Officer – Sinnar",
    indicatorHi: "क्षेत्रीय अधिकारी – सिन्नर",
    defaultPath: "/dashboard/field",
    email: "field.sinnar@lams.gov.in",
  },
  LANDOWNER: {
    role: "LANDOWNER",
    label: "Landowner / Citizen",
    labelHi: "भू-स्वामी / नागरिक",
    scope: "Musalgaon, Sinnar",
    scopeHi: "मुसलगांव, सिन्नर",
    title: "Landowner – Musalgaon",
    titleHi: "भू-स्वामी – मुसलगांव",
    indicator: "Landowner – Musalgaon",
    indicatorHi: "भू-स्वामी – मुसलगांव",
    defaultPath: "/dashboard/citizen",
    email: "ramesh.patil@lams.test",
  },
  ADMIN: {
    role: "ADMIN",
    label: "System Administrator",
    labelHi: "सिस्टम प्रशासक",
    scope: "System-wide Control",
    scopeHi: "सिस्टम-स्तरीय नियंत्रण",
    title: "System Administrator – System-wide",
    titleHi: "सिस्टम प्रशासक – प्रणाली-व्यापी",
    indicator: "Administrator – System-wide",
    indicatorHi: "प्रशासक – प्रणाली-व्यापी",
    defaultPath: "/admin",
    email: "admin@lams.gov.in",
  },
};

export interface RoleNavItem {
  href: string;
  label: string;
  labelHi: string;
  iconName: string;
}

/**
 * EXACT Role -> Navigation Mapping as mandated by the LAMS v2 Specification:
 * 
 * Central Ministry: National Dashboard, GIS Map (read-only, national), Reports/MIS Export
 * State Government: State Dashboard, GIS Map (state-scoped), Reports/MIS Export
 * District Collector: District Dashboard, Proposals & Scrutiny Queue, Case Workflow, GIS Map (district), Document Repository
 * Project Implementing Body: My Projects, New Proposal, Project Documents, GIS Map (own project only)
 * Field Officer: My Assigned Tasks, Field Data Capture (GPS + photo + checklist)
 * Landowner / Citizen: My Land & Applications, File Objection/Grievance, Compensation Timeline
 * Admin: User Management, Role Management, Workflow/SLA Config, Master Data, Audit Logs
 */
export const ROLE_NAVIGATION_ITEMS: Record<UserRole, RoleNavItem[]> = {
  CENTRAL_MINISTRY: [
    {
      href: "/dashboard/central",
      label: "National Dashboard",
      labelHi: "राष्ट्रीय डैशबोर्ड",
      iconName: "Building2",
    },
    {
      href: "/gis?scope=national",
      label: "GIS Map (read-only, national)",
      labelHi: "जीआईएस मानचित्र (राष्ट्रीय)",
      iconName: "Map",
    },
    {
      href: "/reports",
      label: "Reports/MIS Export",
      labelHi: "रिपोर्ट्स/एमआईएस",
      iconName: "BarChart3",
    },
  ],
  STATE_OFFICER: [
    {
      href: "/dashboard/state",
      label: "State Dashboard",
      labelHi: "राज्य डैशबोर्ड",
      iconName: "Building",
    },
    {
      href: "/gis?scope=state",
      label: "GIS Map (state-scoped)",
      labelHi: "जीआईएस मानचित्र (राज्य)",
      iconName: "Map",
    },
    {
      href: "/reports",
      label: "Reports/MIS Export",
      labelHi: "रिपोर्ट्स/एमआईएस",
      iconName: "BarChart3",
    },
  ],
  DISTRICT_COLLECTOR: [
    {
      href: "/dashboard/collector",
      label: "District Dashboard",
      labelHi: "जिला डैशबोर्ड",
      iconName: "Building2",
    },
    {
      href: "/dashboard/collector?tab=proposals",
      label: "Proposals & Scrutiny Queue",
      labelHi: "प्रस्ताव एवं संवीक्षा",
      iconName: "ClipboardList",
    },
    {
      href: "/dashboard/collector?tab=cases",
      label: "Case Workflow",
      labelHi: "केस कार्यप्रवाह",
      iconName: "FileText",
    },
    {
      href: "/gis?scope=district",
      label: "GIS Map (district)",
      labelHi: "जीआईएस मानचित्र (जिला)",
      iconName: "Map",
    },
    {
      href: "/calculator",
      label: "Compensation & DBT",
      labelHi: "मुआवजा एवं डीबीटी",
      iconName: "Coins",
    },
    {
      href: "/rr",
      label: "R&R Settlement",
      labelHi: "पुनर्वास एवं पुनर्स्थापन",
      iconName: "Users",
    },
    {
      href: "/documents",
      label: "Document Repository",
      labelHi: "दस्तावेज़ रिपॉजिटरी",
      iconName: "FolderOpen",
    },
    {
      href: "/audit",
      label: "Audit Logs (District)",
      labelHi: "ऑडिट लॉग (जिला)",
      iconName: "ShieldAlert",
    },
  ],
  REQUIRING_BODY: [
    {
      href: "/dashboard/requiring-body?tab=projects",
      label: "My Projects",
      labelHi: "मेरी परियोजनाएं",
      iconName: "Building",
    },
    {
      href: "/dashboard/requiring-body?tab=new-proposal",
      label: "New Proposal",
      labelHi: "नया प्रस्ताव",
      iconName: "FilePlus",
    },
    {
      href: "/documents",
      label: "Project Documents",
      labelHi: "परियोजना दस्तावेज़",
      iconName: "FolderOpen",
    },
    {
      href: "/gis?scope=project",
      label: "GIS Map (own project only)",
      labelHi: "जीआईएस मानचित्र (परियोजना)",
      iconName: "Map",
    },
  ],
  FIELD_OFFICER: [
    {
      href: "/dashboard/field?tab=tasks",
      label: "My Assigned Tasks",
      labelHi: "आवंटित कार्य",
      iconName: "ClipboardList",
    },
    {
      href: "/dashboard/field?tab=capture",
      label: "Field Data Capture (GPS + photo + checklist)",
      labelHi: "फील्ड डेटा प्रविष्टि (जीपीएस + फोटो)",
      iconName: "Camera",
    },
    {
      href: "/gis?scope=assigned",
      label: "Assigned Cadastral Map",
      labelHi: "आवंटित भूकर मानचित्र",
      iconName: "Map",
    },
    {
      href: "/rr",
      label: "R&R Inspection Evidence",
      labelHi: "आर एंड आर सत्यापन साक्ष्य",
      iconName: "Users",
    },
    {
      href: "/documents",
      label: "Field Documents",
      labelHi: "क्षेत्रीय दस्तावेज़",
      iconName: "FolderOpen",
    },
  ],
  LANDOWNER: [
    {
      href: "/dashboard/citizen?tab=dossier",
      label: "My Land & Applications",
      labelHi: "मेरी भूमि एवं आवेदन",
      iconName: "FileText",
    },
    {
      href: "/dashboard/citizen?tab=grievance",
      label: "File Objection/Grievance",
      labelHi: "आपत्ति / शिकायत दर्ज करें",
      iconName: "HelpCircle",
    },
    {
      href: "/dashboard/citizen?tab=timeline",
      label: "Compensation Timeline",
      labelHi: "मुआवजा समय-सीमा",
      iconName: "Coins",
    },
    {
      href: "/calculator",
      label: "My Award Assessment",
      labelHi: "मेरा मुआवजा निर्धारण",
      iconName: "Coins",
    },
    {
      href: "/gis?scope=own",
      label: "My Parcel Boundary Map",
      labelHi: "मेरा भूखंड मानचित्र",
      iconName: "Map",
    },
    {
      href: "/documents",
      label: "My Land Records",
      labelHi: "मेरे भूमि अभिलेख",
      iconName: "FolderOpen",
    },
  ],
  ADMIN: [
    {
      href: "/admin?tab=users",
      label: "User Management",
      labelHi: "उपयोगकर्ता प्रबंधन",
      iconName: "Users",
    },
    {
      href: "/admin?tab=roles",
      label: "Role Management",
      labelHi: "भूमिका प्रबंधन",
      iconName: "ShieldCheck",
    },
    {
      href: "/admin?tab=sla",
      label: "Workflow/SLA Config",
      labelHi: "कार्यप्रवाह/एसएलए विन्यास",
      iconName: "Sliders",
    },
    {
      href: "/admin?tab=master",
      label: "Master Data",
      labelHi: "मास्टर डेटा",
      iconName: "Database",
    },
    {
      href: "/admin?tab=templates",
      label: "Notification Templates",
      labelHi: "अधिसूचना टेम्पलेट्स",
      iconName: "FileText",
    },
    {
      href: "/audit",
      label: "Audit Logs",
      labelHi: "ऑडिट लॉग",
      iconName: "ShieldAlert",
    },
  ],
};

/**
 * STRICT ROUTE ACCESS PERMISSIONS
 * Enforced by Next.js Server-Side Middleware
 * Based on the literal 29-row RBAC Matrix
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/dashboard/central": ["CENTRAL_MINISTRY"],
  "/dashboard/state": ["CENTRAL_MINISTRY", "STATE_OFFICER"],
  "/dashboard/collector": ["DISTRICT_COLLECTOR"],
  "/dashboard/requiring-body": ["REQUIRING_BODY"],
  "/dashboard/field": ["FIELD_OFFICER"],
  "/dashboard/citizen": ["LANDOWNER"],
  "/admin": ["ADMIN"],
  "/audit": ["ADMIN", "DISTRICT_COLLECTOR"],
  "/reports": ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY"],
  "/documents": ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "LANDOWNER"],
  "/gis": ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "LANDOWNER"],
  "/calculator": ["DISTRICT_COLLECTOR", "CENTRAL_MINISTRY", "STATE_OFFICER", "REQUIRING_BODY", "LANDOWNER"],
  "/rr": ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "LANDOWNER"],
  "/integrations": ["CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "ADMIN"],
  "/api/admin": ["ADMIN"],
  "/api/proposals": ["REQUIRING_BODY", "DISTRICT_COLLECTOR"],
  "/api/awards": ["DISTRICT_COLLECTOR"],
  "/api/field-surveys": ["FIELD_OFFICER"],
  "/api/grievances": ["LANDOWNER", "DISTRICT_COLLECTOR"],
  "/api/compensation": ["DISTRICT_COLLECTOR"],
  "/api/possession": ["DISTRICT_COLLECTOR", "FIELD_OFFICER"],
  "/api/rr": ["DISTRICT_COLLECTOR", "FIELD_OFFICER"],
  "/api/documents": ["DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "LANDOWNER"],
};

/**
 * Check if a given role is permitted to access a route pathname
 */
export function canAccessRoute(role: string | null | undefined, pathname: string): boolean {
  if (!role) return false;
  const userRole = role as UserRole;

  for (const [routePrefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === routePrefix || pathname.startsWith(`${routePrefix}/`) || pathname.startsWith(`${routePrefix}?`)) {
      return allowedRoles.includes(userRole);
    }
  }

  // Routes not explicitly restricted default to allowed for authenticated users
  return true;
}

/**
 * Get default dashboard path for any given role
 */
export function getDefaultDashboardPath(role: string | null | undefined): string {
  if (!role) return "/";
  const userRole = role as UserRole;
  return ROLE_CONFIGS[userRole]?.defaultPath || "/";
}

/**
 * Get default dashboard path by user email
 */
export function getDashboardPathByEmail(email: string): string {
  const lower = email.toLowerCase().trim();
  if (lower.includes("central")) return "/dashboard/central";
  if (lower.includes("state")) return "/dashboard/state";
  if (lower.includes("collector")) return "/dashboard/collector";
  if (lower.includes("nhai") || lower.includes("requiring") || lower.includes("project")) return "/dashboard/requiring-body";
  if (lower.includes("field") || lower.includes("sinnar@lams.gov.in")) return "/dashboard/field";
  if (lower.includes("patil") || lower.includes("citizen") || lower.includes("owner") || lower.includes("landowner")) return "/dashboard/citizen";
  if (lower.includes("admin")) return "/admin";
  return "/dashboard/central";
}

/**
 * Get navigation items for a given role
 */
export function getNavItemsForRole(role: string | null | undefined): RoleNavItem[] {
  if (!role) return [];
  const userRole = role as UserRole;
  const items = ROLE_NAVIGATION_ITEMS[userRole] || [];

  // Guarantee strict uniqueness of navigation items by both href and label
  const seenHrefs = new Set<string>();
  const seenLabels = new Set<string>();
  return items.filter((item) => {
    const keyHref = item.href.toLowerCase().trim();
    const keyLabel = item.label.toLowerCase().trim();
    if (seenHrefs.has(keyHref) || seenLabels.has(keyLabel)) {
      return false;
    }
    seenHrefs.add(keyHref);
    seenLabels.add(keyLabel);
    return true;
  });
}

/**
 * Get role indicator string (e.g. "Logged in as: District Collector – Nashik")
 */
export function getRoleIndicator(role: string | null | undefined, locale: "en" | "hi" = "en"): string {
  if (!role) return "";
  const userRole = role as UserRole;
  const cfg = ROLE_CONFIGS[userRole];
  if (!cfg) return role;
  return locale === "hi" ? cfg.indicatorHi : cfg.indicator;
}

/**
 * Fine-grained feature permissions
 */
export type Permission =
  | "view:national_dashboard"
  | "view:state_dashboard"
  | "view:collector_console"
  | "view:requiring_body_console"
  | "view:field_app"
  | "view:citizen_portal"
  | "view:gis_explorer"
  | "view:calculator"
  | "view:audit_trail"
  | "view:reports"
  | "view:admin_panel"
  | "view:documents"
  | "create:proposal"
  | "create:field_survey"
  | "create:grievance"
  | "manage:notices"
  | "manage:awards"
  | "manage:compensation"
  | "manage:possession"
  | "manage:users"
  | "manage:sla_config";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CENTRAL_MINISTRY: [
    "view:national_dashboard",
    "view:gis_explorer",
    "view:reports",
    "view:audit_trail",
  ],
  STATE_OFFICER: [
    "view:state_dashboard",
    "view:gis_explorer",
    "view:reports",
    "view:audit_trail",
  ],
  DISTRICT_COLLECTOR: [
    "view:collector_console",
    "view:gis_explorer",
    "view:calculator",
    "view:documents",
    "view:audit_trail",
    "manage:notices",
    "manage:awards",
    "manage:compensation",
    "manage:possession",
  ],
  REQUIRING_BODY: [
    "view:requiring_body_console",
    "view:gis_explorer",
    "view:documents",
    "create:proposal",
  ],
  FIELD_OFFICER: [
    "view:field_app",
    "create:field_survey",
  ],
  LANDOWNER: [
    "view:citizen_portal",
    "view:calculator",
    "create:grievance",
  ],
  ADMIN: [
    "view:admin_panel",
    "view:audit_trail",
    "manage:users",
    "manage:sla_config",
  ],
};

export function hasPermission(role: string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  const perms = ROLE_PERMISSIONS[userRole];
  if (!perms) return false;
  return perms.includes(permission);
}

interface CanProps {
  role?: string | null;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ role, permission, children, fallback = null }: CanProps): React.ReactElement | null {
  if (hasPermission(role, permission)) {
    return React.createElement(React.Fragment, null, children);
  }
  return fallback ? React.createElement(React.Fragment, null, fallback) : null;
}
