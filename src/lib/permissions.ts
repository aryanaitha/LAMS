import React from "react";
import { UserRole } from "@/types";

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
    "view:calculator",
    "view:reports",
    "view:audit_trail",
  ],
  STATE_OFFICER: [
    "view:state_dashboard",
    "view:national_dashboard",
    "view:gis_explorer",
    "view:calculator",
    "view:reports",
    "view:audit_trail",
  ],
  DISTRICT_COLLECTOR: [
    "view:collector_console",
    "view:gis_explorer",
    "view:calculator",
    "view:reports",
    "view:audit_trail",
    "manage:notices",
    "manage:awards",
    "manage:compensation",
    "manage:possession",
  ],
  REQUIRING_BODY: [
    "view:requiring_body_console",
    "view:gis_explorer",
    "view:calculator",
    "view:reports",
    "create:proposal",
  ],
  FIELD_OFFICER: [
    "view:field_app",
    "view:gis_explorer",
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

/**
 * Check if a given role has a specific permission
 */
export function hasPermission(role: string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  const perms = ROLE_PERMISSIONS[userRole];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Client-side permission guard component
 */
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
