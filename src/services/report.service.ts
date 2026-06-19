import { Report } from "../types/security";

const INITIAL_REPORTS: Report[] = [
  {
    id: "REP-001",
    title: "Q2 Federal SDLC Compliance & Pentest Baseline Audit",
    description: "Detailed evaluation of SecureFlow cryptography schemas, HS512 JWT rotation parameters, and Snort WAF posture for SOC-2 Type II audit.",
    type: "Security",
    generatedDate: "2026-06-19T09:12:00Z",
    status: "Ready",
    format: "PDF",
    fileSize: "4.8 MB",
    generatedBy: "admin@secureflow.app"
  },
  {
    id: "REP-002",
    title: "Fedwire Payment Integrity & Liquidity Stress Index",
    description: "Volumetric metrics analysis of core transaction streams and active rate-limiting block count summaries for continuous liquidity tracking.",
    type: "System",
    generatedDate: "2026-06-18T14:30:15Z",
    status: "Ready",
    format: "Excel",
    fileSize: "12.4 MB",
    generatedBy: "pm@secureflow.app"
  },
  {
    id: "REP-003",
    title: "Project Delivery Risk Assortment Profile - H1 2026",
    description: "High-trust milestone compliance progress report with task complexity classifications and delayed critical-path timelines.",
    type: "Project",
    generatedDate: "2026-06-17T11:00:00Z",
    status: "Ready",
    format: "PDF",
    fileSize: "2.1 MB",
    generatedBy: "pm@secureflow.app"
  },
  {
    id: "REP-004",
    title: "Open-source Supply Chain Integrity Scanner Audit Logs",
    description: "Dependency vulnerability logs compiled weekly with cryptographic package checksum confirmation and active CVE alerts.",
    type: "System",
    generatedDate: "2026-06-16T18:22:01Z",
    status: "Ready",
    format: "CSV",
    fileSize: "8.2 MB",
    generatedBy: "admin@secureflow.app"
  },
  {
    id: "REP-005",
    title: "IAM Escalation and Permission Reconciler Audit",
    description: "Periodic role assignments review confirming current Admin, PM, and Developer credential thresholds and active lockouts history.",
    type: "User",
    generatedDate: "2026-06-15T08:15:30Z",
    status: "Ready",
    format: "PDF",
    fileSize: "1.1 MB",
    generatedBy: "admin@secureflow.app"
  }
];

const REPORTS_KEY = "sf_mock_reports_data";

export class ReportService {
  private static reportsList(): Report[] {
    try {
      const stored = localStorage.getItem(REPORTS_KEY);
      return stored ? JSON.parse(stored) : INITIAL_REPORTS;
    } catch (e) {
      return INITIAL_REPORTS;
    }
  }

  private static saveReports(list: Report[]): void {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to save reports data", e);
    }
  }

  // --- 1. Get reports list ---
  public static async getReports(filters: {
    search?: string;
    type?: string;
    format?: string;
  }): Promise<Report[]> {
    let list = this.reportsList();

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        r => 
          r.title.toLowerCase().includes(q) || 
          r.description.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    if (filters.type && filters.type !== "") {
      list = list.filter(r => r.type.toLowerCase() === filters.type?.toLowerCase());
    }

    if (filters.format && filters.format !== "") {
      list = list.filter(r => r.format.toLowerCase() === filters.format?.toLowerCase());
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime());
  }

  // --- 2. Generate a report ---
  public static async generateReport(reportInput: {
    title: string;
    description: string;
    type: "Project" | "Security" | "User" | "Task" | "System";
    format: "PDF" | "CSV" | "Excel";
    generatedBy: string;
  }): Promise<Report> {
    const list = this.reportsList();
    const newId = `REP-${Math.floor(100 + Math.random() * 900)}`;
    const newReport: Report = {
      id: newId,
      title: reportInput.title,
      description: reportInput.description,
      type: reportInput.type,
      generatedDate: new Date().toISOString(),
      status: "Ready", // Simple auto ready on mock resolver response
      format: reportInput.format,
      fileSize: `${(1.0 + Math.random() * 15).toFixed(1)} MB`,
      generatedBy: reportInput.generatedBy
    };

    const updated = [newReport, ...list];
    this.saveReports(updated);

    return newReport;
  }

  // --- 3. Delete a report ---
  public static async deleteReport(id: string): Promise<boolean> {
    const list = this.reportsList();
    const filtered = list.filter(r => r.id !== id);
    this.saveReports(filtered);
    return true;
  }
}
