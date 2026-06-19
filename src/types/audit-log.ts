export type SeverityType = "Low" | "Medium" | "High" | "Critical";
export type HashStatus = "Verified" | "Pending" | "Tampered";
export type SystemIntegrityStatusType = "Valid" | "Warning" | "Tampered";

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  resource: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
  verificationStatus: HashStatus;
  severity: SeverityType;
  ipAddress: string;
  // Forensic elements
  device?: string;
  browser?: string;
  sessionId?: string;
  description?: string;
  blockNumber: number;
  chainPosition: number;
}

export interface AuditLogDetails extends AuditLog {
  role: string;
  timeline: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  name: string; // e.g. "Log Created", "Hash Generated", "Verification Performed", "User Activity", "Security Events"
  description: string;
  operator: string;
  status: "success" | "warning" | "failure";
  type: "system" | "security" | "user" | "verification";
}

export interface HashChain {
  blocks: AuditLog[];
  isValid: boolean;
  brokenBlockId?: string;
}

export interface HashVerification {
  id: string;
  timestamp: string;
  verifiedBy: string;
  status: SystemIntegrityStatusType;
  durationMs: number;
  totalBlocks: number;
  verifiedBlocks: number;
  brokenBlocks: number;
  chainHealth: number; // 0 - 100
  notes?: string;
}

export interface IntegrityStatus {
  status: SystemIntegrityStatusType;
  totalBlocks: number;
  verifiedBlocks: number;
  brokenBlocks: number;
  chainHealthScore: number;
  lastVerificationTime: string;
  verificationPercentage: number;
}

export interface VerificationResult {
  logId: string;
  isValid: boolean;
  expectedHash: string;
  actualHash: string;
  mismatchReason?: string;
  recalculatedAt: string;
}

export interface TamperEvent {
  id: string;
  affectedBlockId: string;
  affectedBlockNumber: number;
  expectedHash: string;
  currentHash: string;
  mismatchReason: string;
  detectionTime: string;
  severity: SeverityType;
}
