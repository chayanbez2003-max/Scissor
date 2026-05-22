import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { UserButton, useClerk } from '@clerk/clerk-react';
import { 
  Scissors, 
  LayoutDashboard, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Navigation items definition
 */
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

/**
 * Sidebar and frame manager for authenticated dashboard consoles.
 */
export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut(() => navigate('/'));
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Static Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 glass-panel border-r border-border-glass">
        {/* Sidebar Logo Header */}
        <div className="flex items-center h-16 px-6 gap-2 border-b border-border-glass">
          <Scissors className="h-6 w-6 text-primary-purple animate-pulse" />
          <span className="text-xl font-bold font-sans text-gradient">Scissor</span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-primary text-white shadow-lg glow-purple'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-border-glass'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary-purple'
                }`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User button & Logout options */}
        <div className="p-4 border-t border-border-glass flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">Account</span>
              <span className="text-[10px] text-slate-400">Settings</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Top Header navbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 glass-panel border-b border-border-glass md:backdrop-blur-md">
          {/* Mobile Menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Page context status banner */}
          <div className="flex items-center gap-2 md:ml-0 ml-4">
            <LinkIcon className="h-5 w-5 text-primary-blue md:block hidden" />
            <h2 className="text-lg font-semibold text-slate-200">
              {navigation.find((item) => location.pathname.startsWith(item.href))?.name || 'Console'}
            </h2>
          </div>

          {/* Custom Action Controls / User Profile button */}
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Responsive Mobile Drawer Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black md:hidden"
              />

              {/* Sidebar content drawer */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-border-glass flex flex-col md:hidden"
              >
                <div className="flex items-center justify-between h-16 px-6 border-b border-border-glass">
                  <div className="flex items-center gap-2">
                    <Scissors className="h-6 w-6 text-primary-purple" />
                    <span className="text-xl font-bold text-gradient">Scissor</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-primary text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-border-glass flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-xs font-semibold text-slate-200">Account settings</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-slate-400 hover:text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic page outlet container */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
