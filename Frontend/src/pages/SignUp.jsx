import { SignUp } from '@clerk/clerk-react';
import { Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Centered sign up portal frame wrapping Clerk SignUp components
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-primary-purple/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-primary-blue/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <Scissors className="h-7 w-7 text-primary-purple animate-bounce" />
          <span className="text-2xl font-bold tracking-tight text-gradient">Scissor</span>
        </Link>
        <p className="text-slate-400 text-sm">Create an account to start tracking link clicks</p>
      </div>

      {/* Clerk component */}
      <SignUp 
        signInUrl="/sign-in" 
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
