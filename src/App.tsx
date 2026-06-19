/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthLayout from "./components/layout/AuthLayout";
import AppShell from "./components/layout/AppShell";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import PMDashboard from "./pages/dashboard/PMDashboard";
import DeveloperDashboard from "./pages/dashboard/DeveloperDashboard";

// New User Management Pages
import UsersList from "./pages/users/UsersList";
import CreateUser from "./pages/users/CreateUser";
import UserDetails from "./pages/users/UserDetails";
import EditUser from "./pages/users/EditUser";

// New Role Management Pages
import RolesList from "./pages/roles/RolesList";
import CreateRole from "./pages/roles/CreateRole";
import EditRole from "./pages/roles/EditRole";
import PermissionMatrix from "./pages/permissions/PermissionMatrix";

// New Project Management Pages
import ProjectsList from "./pages/projects/ProjectsList";
import CreateProject from "./pages/projects/CreateProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import EditProject from "./pages/projects/EditProject";

// New Task Management Pages
import KanbanBoard from "./pages/tasks/KanbanBoard";
import CreateTask from "./pages/tasks/CreateTask";
import TaskDetails from "./pages/tasks/TaskDetails";
import EditTask from "./pages/tasks/EditTask";

// Audit Logs & Hash Chain Pages
import AuditDashboard from "./pages/audit-logs/AuditDashboard";
import AuditDetails from "./pages/audit-logs/AuditDetails";
import HashVerificationCenter from "./pages/audit-logs/HashVerificationCenter";

// SOC & IDS & Alerts Module Pages
import IDSDashboard from "./pages/security/IDSDashboard";
import AlertsCenter from "./pages/security/AlertsCenter";
import AlertDetailsView from "./pages/security/AlertDetailsView";
import SecurityAnalyticsView from "./pages/security/SecurityAnalyticsView";
import SystemHealthDashboard from "./pages/security/SystemHealthDashboard";

// Reports Dashboard
import ReportsDashboard from "./pages/reports/ReportsDashboard";

// Notifications Center
import NotificationsCenter from "./pages/notifications/NotificationsCenter";

// Profile Pages
import ProfileDashboard from "./pages/profile/ProfileDashboard";
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/profile/ChangePassword";

// Settings Pages
import GeneralSettingsPage from "./pages/settings/GeneralSettingsPage";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";

// Error Pages
import AccessDeniedPage from "./pages/errors/AccessDeniedPage";
import NotFoundPage from "./pages/errors/NotFoundPage";
import ServerErrorPage from "./pages/errors/ServerErrorPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ]
  },
  {
    element: <AppShell />,
    children: [
      {
        path: "/dashboard/admin",
        element: <AdminDashboard />,
      },
      {
        path: "/dashboard/pm",
        element: <PMDashboard />,
      },
      {
        path: "/dashboard/developer",
        element: <DeveloperDashboard />,
      },
      {
        path: "/users",
        element: <UsersList />,
      },
      {
        path: "/users/create",
        element: <CreateUser />,
      },
      {
        path: "/users/:id",
        element: <UserDetails />,
      },
      {
        path: "/users/:id/edit",
        element: <EditUser />,
      },
      {
        path: "/roles",
        element: <RolesList />,
      },
      {
        path: "/roles/create",
        element: <CreateRole />,
      },
      {
        path: "/roles/:id/edit",
        element: <EditRole />,
      },
      {
        path: "/permissions",
        element: <PermissionMatrix />,
      },
      // Projects Module
      {
        path: "/projects",
        element: <ProjectsList />,
      },
      {
        path: "/projects/create",
        element: <CreateProject />,
      },
      {
        path: "/projects/:id",
        element: <ProjectDetails />,
      },
      {
        path: "/projects/:id/edit",
        element: <EditProject />,
      },
      // Tasks Module
      {
        path: "/tasks",
        element: <KanbanBoard />,
      },
      {
        path: "/tasks/create",
        element: <CreateTask />,
      },
      {
        path: "/tasks/:id",
        element: <TaskDetails />,
      },
      {
        path: "/tasks/:id/edit",
        element: <EditTask />,
      },
      // Cryptographic Audit Ledger Module
      {
        path: "/audit-logs",
        element: <AuditDashboard />,
      },
      {
        path: "/audit-logs/:id",
        element: <AuditDetails />,
      },
      {
        path: "/audit-logs/verification",
        element: <HashVerificationCenter />,
      },
      // IDS & Incident Alerts Center
      {
        path: "/security/ids",
        element: <IDSDashboard />,
      },
      {
        path: "/security/alerts",
        element: <AlertsCenter />,
      },
      {
        path: "/security/alerts/:id",
        element: <AlertDetailsView />,
      },
      {
        path: "/security/analytics",
        element: <SecurityAnalyticsView />,
      },
      {
        path: "/security/system-health",
        element: <SystemHealthDashboard />,
      },
      // Reports Dashboard
      {
        path: "/reports",
        element: <ReportsDashboard />,
      },
      // Notifications Center
      {
        path: "/notifications",
        element: <NotificationsCenter />,
      },
      // Profile Module Layout Routes
      {
        path: "/profile",
        element: <ProfileDashboard />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/profile/change-password",
        element: <ChangePassword />,
      },
      // Settings Module Layout Routes
      {
        path: "/settings/general",
        element: <GeneralSettingsPage />,
      },
      {
        path: "/settings/security",
        element: <SecuritySettingsPage />,
      },
    ]
  },
  // Error Handling Standalone Out of AppShell Modules
  {
    path: "/403",
    element: <AccessDeniedPage />,
  },
  {
    path: "/500",
    element: <ServerErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  }
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
