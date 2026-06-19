import { UserProfile, PasswordChangeRequest } from "../types/profile-settings";
import { SecureFlowApiService } from "./user-role.service";
import { useAuthStore } from "../store/useAuthStore";

const PROFILE_STORE_KEY = "secureflow_user_profiles_ext";

interface ProfileExt {
  bio: string;
  timezone: string;
  location: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
}

const DEFAULT_EXT_PROFILES: Record<string, ProfileExt> = {
  "usr-admin": {
    firstName: "Alex",
    lastName: "Rivera",
    bio: "Chief of Cybersecurity Operations & Key Custodian. Dedicated to zero-trust architecture and high-assurance military-grade network defenses.",
    timezone: "America/New_York",
    location: "New York, USA",
    employeeId: "SF-001-A",
    position: "Chief of Security Operations"
  },
  "usr-pm": {
    firstName: "Sarah",
    lastName: "Jenkins",
    bio: "SaaS Deployment coordinator & program director. Focusing on smooth Federal handshakes, sprint throughput, and pipeline optimizations.",
    timezone: "America/Chicago",
    location: "Chicago, USA",
    employeeId: "SF-045-P",
    position: "SaaS Deployment Coordinator"
  },
  "usr-dev1": {
    firstName: "Kaelen",
    lastName: "Mercer",
    bio: "Senior DevSecOps cryptographer & distributed ledger expert. Passionate about HSM, JWT verification stress limits, and post-quantum algorithms.",
    timezone: "Europe/London",
    location: "London, UK",
    employeeId: "SF-202-D",
    position: "Senior DevSecOps Cryptographer"
  },
  "usr-developer": {
    firstName: "Kaelen",
    lastName: "Mercer",
    bio: "Senior DevSecOps cryptographer & distributed ledger expert. Passionate about HSM, JWT verification stress limits, and post-quantum algorithms.",
    timezone: "Europe/London",
    location: "London, UK",
    employeeId: "SF-202-D",
    position: "Senior DevSecOps Cryptographer"
  },
};

const getExtProfiles = (): Record<string, ProfileExt> => {
  const stored = localStorage.getItem(PROFILE_STORE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_STORE_KEY, JSON.stringify(DEFAULT_EXT_PROFILES));
    return DEFAULT_EXT_PROFILES;
  }
  return JSON.parse(stored);
};

const saveExtProfile = (userId: string, ext: ProfileExt) => {
  const current = getExtProfiles();
  current[userId] = ext;
  localStorage.setItem(PROFILE_STORE_KEY, JSON.stringify(current));
};

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Get currently authenticated user
    const authUser = useAuthStore.getState().user;
    let targetId = authUser?.id || "usr-admin";
    
    // Make sure we resolve the correct ID mapping (if developer is usr-developer, fallback to usr-dev1)
    if (targetId === "usr-developer") {
      targetId = "usr-dev1";
    }

    const baseUser = await SecureFlowApiService.getUserById(targetId);
    if (!baseUser) {
      throw new Error(`User metadata not found for token identifier [${targetId}].`);
    }

    const exts = getExtProfiles();
    const ext = exts[targetId] || {
      firstName: baseUser.fullName.split(" ")[0] || "User",
      lastName: baseUser.fullName.split(" ")[1] || "SecureFlow",
      bio: "SecureFlow core platform enterprise operator.",
      timezone: "America/New_York",
      location: "San Jose, USA",
      employeeId: `SF-${targetId.replace("usr-", "").toUpperCase() || "OP"}-01`,
      position: baseUser.role === "Admin" ? "Chief of Security Operations" : baseUser.role === "Project Manager" ? "SaaS Deployment Coordinator" : "Senior DevSecOps Cryptographer",
    };

    return {
      ...baseUser,
      ...ext,
      id: authUser?.id || baseUser.id // preserve actual auth ID if needed
    };
  },

  async updateProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const authUser = useAuthStore.getState().user;
    let targetId = authUser?.id || "usr-admin";
    
    if (targetId === "usr-developer") {
      targetId = "usr-dev1";
    }

    const baseUser = await SecureFlowApiService.getUserById(targetId);
    if (!baseUser) {
      throw new Error(`Profile target unavailable.`);
    }

    // Prepare update parameters for the User-Role API service (fullName, email, phoneNumber, department, avatar, etc.)
    const userRoleUpdate: any = {};
    if (updated.fullName) userRoleUpdate.fullName = updated.fullName;
    else if (updated.firstName || updated.lastName) {
      const fName = updated.firstName || baseUser.fullName.split(" ")[0] || "";
      const lName = updated.lastName || baseUser.fullName.split(" ")[1] || "";
      userRoleUpdate.fullName = `${fName} ${lName}`.trim();
    }
    
    if (updated.email) userRoleUpdate.email = updated.email;
    if (updated.phoneNumber) userRoleUpdate.phoneNumber = updated.phoneNumber;
    if (updated.department) userRoleUpdate.department = updated.department;
    if (updated.avatar) userRoleUpdate.avatar = updated.avatar;
    if (updated.role) userRoleUpdate.role = updated.role;

    // Apply the update to shared application user db
    const freshBase = await SecureFlowApiService.updateUser(targetId, userRoleUpdate);

    // Save extension details
    const currentExts = getExtProfiles();
    const prevExt = currentExts[targetId] || {
      firstName: "",
      lastName: "",
      bio: "",
      timezone: "America/New_York",
      location: "San Jose, USA",
      employeeId: "SF-OP-01",
      position: baseUser.role === "Admin" ? "Chief of Security Operations" : baseUser.role === "Project Manager" ? "SaaS Deployment Coordinator" : "Senior DevSecOps Cryptographer",
    };

    const newExt: ProfileExt = {
      firstName: updated.firstName !== undefined ? updated.firstName : prevExt.firstName,
      lastName: updated.lastName !== undefined ? updated.lastName : prevExt.lastName,
      bio: updated.bio !== undefined ? updated.bio : prevExt.bio,
      timezone: updated.timezone !== undefined ? updated.timezone : prevExt.timezone,
      location: updated.location !== undefined ? updated.location : prevExt.location,
      employeeId: updated.employeeId !== undefined ? updated.employeeId : prevExt.employeeId,
      position: updated.position !== undefined ? updated.position : prevExt.position,
    };

    saveExtProfile(targetId, newExt);

    // Log the profile update event
    if (freshBase.activities) {
      freshBase.activities.unshift({
        id: "profile-mod-" + Date.now(),
        action: "Updated profile administrative and bio configurations",
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1",
        device: "Account Preferences Hub",
        type: "auth",
        status: "success"
      });
      // Save it back via api service update
      await SecureFlowApiService.updateUser(targetId, { activities: freshBase.activities });
    }

    return {
      ...freshBase,
      ...newExt,
      id: authUser?.id || freshBase.id
    };
  },

  async changePassword(request: PasswordChangeRequest): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const authUser = useAuthStore.getState().user;
    let targetId = authUser?.id || "usr-admin";
    
    if (targetId === "usr-developer") {
      targetId = "usr-dev1";
    }

    const baseUser = await SecureFlowApiService.getUserById(targetId);
    if (!baseUser) {
      throw new Error(`Profile target unavailable.`);
    }

    // Since this is a client simulated HSM vault system:
    // Simply verify that currentPassword is not empty and newPassword matches complexity
    if (!request.currentPassword) {
      throw new Error(`Current password context required to rotate signing credentials.`);
    }

    if (!request.newPassword || request.newPassword.length < 8) {
      throw new Error(`Complexity mismatch: Signing parameters require >= 8 values.`);
    }

    // Audit trace rotational keys
    if (baseUser.activities) {
      baseUser.activities.unshift({
        id: "pwd-rotate-" + Date.now(),
        action: "Rotated master security credential parameters (PBKDF2-HMAC)",
        timestamp: new Date().toISOString(),
        ipAddress: "127.0.0.1",
        device: "Secure Crypto-Vault",
        type: "auth",
        status: "success"
      });
      await SecureFlowApiService.updateUser(targetId, { activities: baseUser.activities });
    }

    // Set last rotation date in localstorage
    localStorage.setItem(`secureflow_last_rotation_${targetId}`, new Date().toISOString());

    return true;
  },

  async getLastPasswordRotation(): Promise<string> {
    const authUser = useAuthStore.getState().user;
    let targetId = authUser?.id || "usr-admin";
    if (targetId === "usr-developer") targetId = "usr-dev1";

    const localVal = localStorage.getItem(`secureflow_last_rotation_${targetId}`);
    if (localVal) return localVal;

    // Default to 45 days ago
    const past = new Date();
    past.setDate(past.getDate() - 45);
    return past.toISOString();
  }
};
