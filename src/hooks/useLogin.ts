import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';

// Mock Service Layer
export const authService = {
  login: async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cleanedEmail = email.trim().toLowerCase();
        if (cleanedEmail === "admin@secureflow.app") {
          resolve({
            id: "usr-admin",
            email: "admin@secureflow.app",
            role: "Admin",
          });
        } else if (cleanedEmail === "pm@secureflow.app") {
          resolve({
            id: "usr-pm",
            email: "pm@secureflow.app",
            role: "Project Manager",
          });
        } else if (cleanedEmail === "dev@secureflow.app" || cleanedEmail === "developer@secureflow.app") {
          resolve({
            id: "usr-developer",
            email: "dev@secureflow.app",
            role: "Developer",
          });
        } else {
          reject(new Error("Invalid credentials. Try admin@secureflow.app, pm@secureflow.app, or dev@secureflow.app with password 'password'"));
        }
      }, 1000);
    });
  },
};

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => 
        authService.login(credentials.email, credentials.password),
    onSuccess: (data: any) => {
      login(data);
    },
  });
};
