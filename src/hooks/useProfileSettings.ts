import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "../services/profile.service";
import { SettingsService } from "../services/settings.service";
import { UserProfile, PasswordChangeRequest, GeneralSettings, SecuritySettings, Session } from "../types/profile-settings";

export const useProfile = () => {
  return useQuery<UserProfile, Error>({
    queryKey: ["user-profile"],
    queryFn: () => ProfileService.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationFn: (updatedData) => ProfileService.updateProfile(updatedData),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Sync administrative panels if open
    }
  });
};

export const useChangePassword = () => {
  return useMutation<boolean, Error, PasswordChangeRequest>({
    mutationFn: (request) => ProfileService.changePassword(request)
  });
};

export const useGeneralSettings = () => {
  return useQuery<GeneralSettings, Error>({
    queryKey: ["general-settings"],
    queryFn: () => SettingsService.getGeneralSettings(),
  });
};

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient();
  return useMutation<GeneralSettings, Error, Partial<GeneralSettings>>({
    mutationFn: (updatedSettings) => SettingsService.updateGeneralSettings(updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["general-settings"] });
    }
  });
};

export const useSecuritySettings = () => {
  return useQuery<SecuritySettings, Error>({
    queryKey: ["security-settings"],
    queryFn: () => SettingsService.getSecuritySettings(),
  });
};

export const useUpdateSecuritySettings = () => {
  const queryClient = useQueryClient();
  return useMutation<SecuritySettings, Error, Partial<SecuritySettings>>({
    mutationFn: (updatedSettings) => SettingsService.updateSecuritySettings(updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security-settings"] });
    }
  });
};

export const useActiveSessions = () => {
  return useQuery<Session[], Error>({
    queryKey: ["active-sessions"],
    queryFn: () => SettingsService.getActiveSessions(),
  });
};

export const useTerminateSession = () => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: (sessionId) => SettingsService.terminateSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
    }
  });
};
