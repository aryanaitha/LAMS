import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function computeSha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function createAuditEntry(params: {
  actorEmail: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
}) {
  try {
    const lastEntry = await prisma.auditLog.findFirst({
      orderBy: { timestamp: "desc" },
    });

    const prevHash = lastEntry ? lastEntry.hash : "0000000000000000000000000000000000000000000000000000000000000000";
    const timestamp = new Date();
    
    const payload = `${prevHash}|${timestamp.toISOString()}|${params.actorEmail}|${params.actorRole}|${params.action}|${params.entityType}|${params.entityId}|${params.details}`;
    const hash = computeSha256(payload);

    return await prisma.auditLog.create({
      data: {
        timestamp,
        actorEmail: params.actorEmail,
        actorRole: params.actorRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        details: params.details,
        ipAddress: params.ipAddress || "127.0.0.1",
        prevHash,
        hash,
      },
    });
  } catch (err) {
    console.error("Failed to create audit log entry:", err);
    return null;
  }
}

export async function verifyAuditChainIntegrity(): Promise<{
  isValid: boolean;
  totalRecords: number;
  brokenRecordId?: string;
  message: string;
}> {
  const records = await prisma.auditLog.findMany({
    orderBy: { timestamp: "asc" },
  });

  if (records.length === 0) {
    return { isValid: true, totalRecords: 0, message: "Audit trail is empty (genesis pending)." };
  }

  let expectedPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";

  for (const record of records) {
    if (record.prevHash !== expectedPrevHash) {
      return {
        isValid: false,
        totalRecords: records.length,
        brokenRecordId: record.id,
        message: `Hash link broken at record ${record.id}. Expected prevHash: ${expectedPrevHash}, found: ${record.prevHash}`,
      };
    }

    const payload = `${record.prevHash}|${record.timestamp.toISOString()}|${record.actorEmail}|${record.actorRole}|${record.action}|${record.entityType}|${record.entityId}|${record.details}`;
    const recalculatedHash = computeSha256(payload);

    if (recalculatedHash !== record.hash) {
      return {
        isValid: false,
        totalRecords: records.length,
        brokenRecordId: record.id,
        message: `Content tampering detected at record ${record.id}. Stored hash mismatch.`,
      };
    }

    expectedPrevHash = record.hash;
  }

  return {
    isValid: true,
    totalRecords: records.length,
    message: `Cryptographic audit chain verified: all ${records.length} records are authentic and tamper-free.`,
  };
}
