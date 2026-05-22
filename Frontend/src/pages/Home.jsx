import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { 
  Scissors, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Shield, 
  Globe, 
  Zap 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [mockInput, setMockInput] = useState('');
  const [mockShortened, setMockShortened] = useState('');

  const handleMockShorten = (e) => {
    e.preventDefault();
    if (!mockInput) return;
    // Simple mock URL for demo purposes
    const fakeSlug = Math.random().toString(36).substring(2, 8);
    setMockShortened(`http://scissor.com/${fakeSlug}`);
  };

  const handleCTA = () => {
    if (isSignedIn) {
      navigate('/dashboard');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-purple/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-primary-blue/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Header / Navbar */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-primary-purple" />
          <span className="text-xl font-bold font-sans text-gradient">Scissor</span>
        </div>
        <button
          onClick={handleCTA}
          className="px-5 py-2 text-sm font-semibold rounded-xl glass-panel border border-border-glass hover:bg-slate-800 text-slate-100 transition duration-200"
        >
          {isSignedIn ? 'Dashboard' : 'Sign In'}
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-purple/10 border border-primary-purple/20 text-purple-400 mb-6">
            <Zap className="h-3 w-3 animate-pulse" /> Custom URL Shortener & Analytics
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold font-sans tracking-tight max-w-4xl leading-tight text-slate-100"
        >
          Shorten Your URLs, <br className="hidden sm:inline"/>
          <span className="text-gradient">Maximize Your Reach.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-slate-400 max-w-2xl"
        >
          Scissor is a modern URL management platform designed to help you generate custom, short slugs, and view detailed click analytics in real-time.
        </motion.p>

        {/* Action Button CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleCTA}
            className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-primary hover:bg-gradient-hover flex items-center justify-center gap-2 shadow-lg glow-purple transition duration-200"
          >
            Start Shortening Free <ArrowRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Demo Link Shortener Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 w-full max-w-2xl glass-panel p-6 rounded-2xl border border-border-glass shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/5 to-primary-blue/5 pointer-events-none" />
          
          <h3 className="text-lg font-semibold text-slate-200 text-left mb-4">Try it out</h3>
          <form onSubmit={handleMockShorten} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="Paste a long link (e.g. https://google.com/search?q=scissor)"
              value={mockInput}
              onChange={(e) => setMockInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl glass-input text-slate-100 text-sm focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-sm transition duration-200 border border-border-glass"
            >
              Shorten
            </button>
          </form>

          {mockShortened && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-slate-900/60 border border-border-glass rounded-xl flex items-center justify-between text-left"
            >
              <div className="flex flex-col truncate pr-4">
                <span className="text-[11px] text-slate-500 uppercase font-semibold">Shortened Demo Link</span>
                <span className="text-sm font-medium text-primary-purple truncate">{mockShortened}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(mockShortened);
                  alert('Demo copied! Sign up to customize and save links.');
                }}
                className="px-3 py-1.5 bg-primary-purple/10 hover:bg-primary-purple/20 text-purple-400 text-xs font-semibold rounded-lg transition duration-200"
              >
                Copy
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-6 rounded-2xl text-left border border-border-glass shadow-lg"
          >
            <div className="h-10 w-10 bg-primary-purple/10 border border-primary-purple/20 rounded-xl flex items-center justify-center text-primary-purple mb-4">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-semibold text-slate-200">Real-time Analytics</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Track clicks, referrers, device types, operating systems, and location statistics instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl text-left border border-border-glass shadow-lg"
          >
            <div className="h-10 w-10 bg-primary-blue/10 border border-primary-blue/20 rounded-xl flex items-center justify-center text-primary-blue mb-4">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-semibold text-slate-200">Custom Slugs</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Build custom branded links using custom text slugs instead of messy randomly generated IDs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl text-left border border-border-glass shadow-lg"
          >
            <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-semibold text-slate-200">Secure Redirection</h4>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Fully guarded against rate limiting and spam bots with built-in Express rate-limit filters.
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-glass px-6 py-6 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-1">
            <Scissors className="h-4 w-4 text-slate-500" />
            <span>&copy; {new Date().getFullYear()} Scissor App. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
