import { Link } from 'react-router-dom';
import { Scissors, AlertCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel max-w-md w-full p-8 rounded-2xl border border-border-glass shadow-2xl text-center flex flex-col items-center"
      >
        <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-4xl font-extrabold font-sans text-slate-100 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-300 mb-4">Page Not Found</h2>
        
        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          The link you are trying to visit does not exist, has been deleted, or the route was mistyped.
        </p>

        <div className="flex gap-4 w-full">
          <Link
            to="/"
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-border-glass rounded-xl text-sm font-semibold transition duration-200 flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 py-3 bg-gradient-primary hover:bg-gradient-hover text-white rounded-xl text-sm font-semibold transition duration-200 shadow-lg glow-purple flex items-center justify-center gap-2"
          >
            <Scissors className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
