import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigate } from 'react-router-dom';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key in Frontend environment variables');
}

/**
 * Root wrapper integrating Clerk authentication provider,
 * centralized toaster notifications, and route-redirect connections.
 */
export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
      appearance={{
        baseTheme: undefined, // customize manually or let clerk inject dark defaults
        variables: {
          colorPrimary: '#8B5CF6',
          colorBackground: '#111827',
          colorText: '#F3F4F6',
          colorInputBackground: '#1F2937',
          colorInputText: '#F3F4F6',
          colorBorder: 'rgba(255, 255, 255, 0.08)',
        },
        elements: {
          card: 'glass-panel border border-border-glass rounded-2xl shadow-2xl',
          headerTitle: 'text-2xl font-bold font-sans text-gradient',
          headerSubtitle: 'text-slate-400 font-sans',
          socialButtonsBlockButton: 'glass-input hover:bg-slate-800 transition duration-200 text-slate-100',
          formButtonPrimary: 'bg-gradient-primary hover:bg-gradient-hover text-white transition duration-200 shadow-lg glow-purple',
          footerActionText: 'text-slate-400',
          footerActionLink: 'text-primary-purple hover:text-purple-400 hover:underline',
          dividerText: 'text-slate-500',
          dividerLine: 'bg-slate-800',
        }
      }}
    >
      <Outlet />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'glass-panel border border-border-glass text-slate-100',
          style: {
            background: 'rgba(17, 24, 39, 0.85)',
            color: '#F3F4F6',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#111827',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#111827',
            },
          },
        }}
      />
    </ClerkProvider>
  );
}
