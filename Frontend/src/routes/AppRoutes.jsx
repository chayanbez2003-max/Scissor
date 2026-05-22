import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for fast initial bundle sizes
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import SignInPage from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import NotFound from '../pages/NotFound';

/**
 * React Router only handles frontend paths here.
 * Short link redirects (e.g. /r/:slug) are NEVER handled by React Router:
 *   - Local dev:    Vite proxy forwards /r/* → Express backend (port 5000)
 *   - Production:   vercel.json rewrite forwards /r/* → backend service
 * This prevents the React catch-all from intercepting shared short links.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Root Wrap */}
      <Route element={<RootLayout />}>
        {/* Public Landing Pages */}
        <Route path="/" element={<Home />} />
        
        {/* Clerk Auth custom views */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Private Dashboard Area */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="analytics/:urlId" element={<Analytics />} />
          {/* Catch-all console path -> redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Full screen Not Found */}
        <Route path="/404" element={<NotFound />} />
        {/* Catch-all global path */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
