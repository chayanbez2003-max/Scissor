import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useUrlStore } from '../store/useUrlStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ArrowLeft, 
  MousePointerClick, 
  Calendar, 
  ExternalLink,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Share2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

// Chart Theme Colors
const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Analytics() {
  const { urlId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const {
    urls,
    currentStats,
    loading,
    error,
    fetchUrls,
    fetchUrlStats,
  } = useUrlStore();

  const [selectedUrlId, setSelectedUrlId] = useState(urlId || '');

  // Fetch list of links and individual link details
  useEffect(() => {
    const loadUrls = async () => {
      const token = await getToken();
      fetchUrls(token);
    };
    loadUrls();
  }, [getToken, fetchUrls]);

  useEffect(() => {
    const loadStats = async () => {
      if (selectedUrlId) {
        const token = await getToken();
        fetchUrlStats(selectedUrlId, token);
      }
    };
    loadStats();
  }, [selectedUrlId, getToken, fetchUrlStats]);

  // Handle link changes from dropdown selector
  const handleUrlSelect = (e) => {
    const id = e.target.value;
    setSelectedUrlId(id);
    if (id) {
      navigate(`/analytics/${id}`);
    } else {
      navigate('/analytics');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-xl border border-border-glass text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition duration-200"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
              Performance Insights
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Analyze visitor traffic, device breakdowns, and browser referrers.
            </p>
          </div>
        </div>

        {/* Dropdown Link Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedUrlId}
            onChange={handleUrlSelect}
            className="w-full sm:w-64 px-4 py-3 rounded-xl glass-input text-sm text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="">Select a link to analyze...</option>
            {urls.map((u) => (
              <option key={u._id} value={u._id}>
                {u.title || u.slug} ({u.clickCount} click{u.clickCount === 1 ? '' : 's'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedUrlId ? (
        // Empty State: No URL Selected
        <div className="glass-panel rounded-2xl border border-border-glass p-12 text-center flex flex-col items-center max-w-xl mx-auto">
          <div className="h-16 w-16 bg-primary-blue/10 border border-primary-blue/20 rounded-2xl flex items-center justify-center text-primary-blue mb-4">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No link selected</h3>
          <p className="text-slate-400 text-sm mt-1">
            Choose one of your shortened URLs from the dropdown menu in the top right to load click data.
          </p>
        </div>
      ) : loading && !currentStats ? (
        // Loading skeleton
        <div className="space-y-6">
          <div className="h-20 bg-slate-800 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-800 animate-pulse rounded-2xl" />
            <div className="h-64 bg-slate-800 animate-pulse rounded-2xl" />
          </div>
        </div>
      ) : error ? (
        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 bg-red-950/15 text-center">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : currentStats ? (
        // Active Statistics Views
        <div className="space-y-8">
          {/* Metadata Card Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <span className="text-xs text-primary-purple font-semibold uppercase tracking-wider">Analyzing Link</span>
                <h2 className="text-xl font-bold text-slate-100 truncate">{currentStats.title}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                  <span className="text-slate-600">Destination:</span>
                  <a href={currentStats.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue hover:underline truncate">
                    {currentStats.originalUrl}
                  </a>
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>

              {/* Quick display */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block uppercase">Short URL</span>
                  <a href={currentStats.shortUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-purple hover:underline">
                    {currentStats.shortUrl}
                  </a>
                </div>
                <div className="border-l border-border-glass h-10" />
                <div className="text-center bg-primary-purple/10 px-4 py-2 rounded-xl border border-primary-purple/20">
                  <span className="text-xs text-slate-400 block uppercase">Total Clicks</span>
                  <span className="text-lg font-bold text-primary-purple">{currentStats.totalClicks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Performance Area Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md">
            <h3 className="text-base font-bold text-slate-200 mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-purple" /> Link Clicks Over Time
            </h3>
            <div className="h-72">
              {currentStats.timeline.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-slate-500">
                  No clicks registered yet. Click timeline will render once visitors open your shortlink.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentStats.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#475569" fontSize={11} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{
                        background: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        color: '#F3F4F6',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="clicks" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Granular Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Devices Pie Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md">
              <h3 className="text-base font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Laptop className="h-5 w-5 text-primary-blue" /> Device Distributions
              </h3>
              <div className="h-60 flex flex-col sm:flex-row items-center justify-center gap-4">
                {currentStats.devices.length === 0 ? (
                  <div className="text-sm text-slate-500 text-center py-10">No device data available.</div>
                ) : (
                  <>
                    <div className="w-1/2 h-full min-h-[160px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentStats.devices}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {currentStats.devices.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                      {currentStats.devices.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                            <span className="text-slate-300 font-medium">{entry.name}</span>
                          </div>
                          <span className="text-slate-400 font-bold">{entry.value} click{entry.value === 1 ? '' : 's'}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Top Browser Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md">
              <h3 className="text-base font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400" /> Browsers Used
              </h3>
              <div className="h-60">
                {currentStats.browsers.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-slate-500">No browser data.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentStats.browsers} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <XAxis type="number" stroke="#475569" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#475569" fontSize={11} tickLine={false} width={80} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          color: '#F3F4F6',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Referrer list cards (Full-width row span) */}
            <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md md:col-span-2">
              <h3 className="text-base font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Share2 className="h-5 w-5 text-amber-500" /> Top Referrers & Traffic Sources
              </h3>
              <div className="overflow-hidden rounded-xl border border-border-glass">
                <table className="min-w-full divide-y divide-slate-800 text-left">
                  <thead className="bg-slate-900/60">
                    <tr>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-400">Referrer Domain</th>
                      <th className="px-6 py-3.5 text-xs font-semibold uppercase text-slate-400 text-right">Click Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-transparent text-sm">
                    {currentStats.referrers.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                          No referrer entries logged.
                        </td>
                      </tr>
                    ) : (
                      currentStats.referrers.map((ref, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20 transition duration-150">
                          <td className="px-6 py-3.5 font-medium text-slate-200">{ref.name}</td>
                          <td className="px-6 py-3.5 text-right font-bold text-slate-400">{ref.value}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
