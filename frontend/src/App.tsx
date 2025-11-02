import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserRole } from "@/types";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import ManageJobs from "./pages/ManageJobs";
import CreateJob from "./pages/CreateJob";
import Applicants from "./pages/Applicants";
import Interviews from "./pages/Interviews";
import Company from "./pages/Company";
import Statistics from "./pages/Statistics";
import Employers from "./pages/Employers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Common routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Candidate routes */}
            <Route path="/jobs" element={<ProtectedRoute allowedRoles={[UserRole.UNGVIEN]}><Jobs /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<ProtectedRoute><JobDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={[UserRole.UNGVIEN]}><Profile /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute allowedRoles={[UserRole.UNGVIEN]}><Applications /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute allowedRoles={[UserRole.UNGVIEN]}><Notifications /></ProtectedRoute>} />
            
            {/* Employer routes */}
            <Route path="/jobs/manage" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><ManageJobs /></ProtectedRoute>} />
            <Route path="/jobs/create" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><CreateJob /></ProtectedRoute>} />
            <Route path="/jobs/edit/:id" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><CreateJob /></ProtectedRoute>} />
            <Route path="/applicants" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><Applicants /></ProtectedRoute>} />
            <Route path="/interviews" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><Interviews /></ProtectedRoute>} />
            <Route path="/interviews/create" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><Interviews /></ProtectedRoute>} />
            <Route path="/company" element={<ProtectedRoute allowedRoles={[UserRole.NTD]}><Company /></ProtectedRoute>} />
            <Route path="/statistics" element={<ProtectedRoute allowedRoles={[UserRole.NTD, UserRole.ADMIN]}><Statistics /></ProtectedRoute>} />
            
            {/* Admin routes */}
            <Route path="/employers" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><Employers /></ProtectedRoute>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
