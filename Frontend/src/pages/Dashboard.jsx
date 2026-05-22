import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useUrlStore } from '../store/useUrlStore';
import { useClipboard } from '../hooks/useClipboard';
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  BarChart3, 
  Trash2, 
  Search, 
  Plus, 
  Sparkles, 
  ArrowUpRight, 
  Calendar, 
  MousePointerClick, 
  Info,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { copyToClipboard } = useClipboard();

  const {
    urls,
    summary,
    loading,
    error,
    fetchUrls,
    fetchSummary,
    shortenUrl,
    deleteUrl,
  } = useUrlStore();

  // Create form state
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [title, setTitle] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'clicks' | 'oldest'

  // Load dashboard data on mount
  useEffect(() => {
    const loadData = async () => {
      const token = await getToken();
      fetchUrls(token);
      fetchSummary(token);
    };
    loadData();
  }, [getToken, fetchUrls, fetchSummary]);

  const handleShorten = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = await getToken();
    
    const result = await shortenUrl(
      { originalUrl, customSlug, title },
      token
    );

    setSubmitting(false);

    if (result.success) {
      toast.success('Short link generated!');
      setOriginalUrl('');
      setCustomSlug('');
      setTitle('');
      setShowCreateForm(false);
      // Refresh summary
      fetchSummary(token);
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shortened URL? This action will permanently remove all analytics.')) {
      return;
    }

    const token = await getToken();
    const result = await deleteUrl(id, token);
    if (result.success) {
      toast.success('Short link deleted');
      fetchSummary(token);
    } else {
      toast.error(result.error);
    }
  };

  // Filter and sort URLs
  const filteredUrls = urls
    .filter((url) => {
      const term = searchTerm.toLowerCase();
      return (
        url.title?.toLowerCase().includes(term) ||
        url.slug?.toLowerCase().includes(term) ||
        url.originalUrl?.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'clicks') return b.clickCount - a.clickCount;
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt); // default newest
    });

  return (
    <div className="space-y-8">
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sans text-slate-100 flex items-center gap-2">
            Workspace Console <Sparkles className="h-6 w-6 text-primary-purple animate-pulse" />
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Shorten URLs, customize slugs, and monitor visitor traffic.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary hover:bg-gradient-hover text-white text-sm font-semibold shadow-lg glow-purple transition duration-200"
        >
          <Plus className="h-5 w-5" /> New Short Link
        </button>
      </div>

      {/* Aggregate metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Short Links</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{summary.totalUrls}</h3>
          </div>
          <div className="h-12 w-12 bg-primary-purple/10 border border-primary-purple/20 rounded-xl flex items-center justify-center text-primary-purple">
            <LinkIcon className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Visitor Clicks</span>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{summary.totalClicks}</h3>
          </div>
          <div className="h-12 w-12 bg-primary-blue/10 border border-primary-blue/20 rounded-xl flex items-center justify-center text-primary-blue">
            <MousePointerClick className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-border-glass shadow-md flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Redirection Status</span>
            <h3 className="text-base font-semibold text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
              All Systems Operational
            </h3>
          </div>
          <div className="h-12 w-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Creation Modal / Form Panel */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleShorten}
              className="glass-panel p-6 rounded-2xl border border-border-glass shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 relative"
            >
              <div className="md:col-span-3 flex justify-between items-center border-b border-border-glass pb-3 mb-2">
                <h3 className="text-base font-bold text-slate-200">Configure Short URL</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> All slugs are normalized to lowercase.
                </span>
              </div>

              {/* Destination URL */}
              <div className="md:col-span-3 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Destination URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/very-long-path/or-folders?search=params"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="px-4 py-3 rounded-xl glass-input text-sm text-slate-100 focus:outline-none"
                />
              </div>

              {/* URL Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Friendly Title (Optional)</label>
                <input
                  type="text"
                  placeholder="My Portfolio Site"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 rounded-xl glass-input text-sm text-slate-100 focus:outline-none"
                />
              </div>

              {/* Custom Slug */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase">Custom Slug (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="my-portfolio"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="px-4 py-3 rounded-xl glass-input text-sm text-slate-100 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-end justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-5 py-3 rounded-xl text-sm font-semibold border border-border-glass text-slate-400 hover:text-slate-200 transition duration-200 w-1/2 md:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-primary hover:bg-gradient-hover text-white shadow-lg glow-purple transition duration-200 w-1/2 md:w-auto flex items-center justify-center gap-2"
                >
                  {submitting ? 'Generating...' : 'Create Link'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Layout Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-border-glass pt-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, custom slug, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-200 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 rounded-xl glass-input text-sm text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="newest">Recent Created</option>
            <option value="clicks">Highest Clicks</option>
            <option value="oldest">Oldest Created</option>
          </select>
        </div>
      </div>

      {/* URLs List Container */}
      <div className="space-y-4">
        {loading && urls.length === 0 ? (
          // Skeleton Loaders
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-border-glass animate-pulse flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
              <div className="h-10 bg-slate-800 rounded w-24 md:w-32" />
            </div>
          ))
        ) : filteredUrls.length === 0 ? (
          // Empty State illustration
          <div className="glass-panel rounded-2xl border border-border-glass p-12 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-800/60 border border-border-glass rounded-2xl flex items-center justify-center text-slate-500 mb-4">
              <LinkIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No links matching search criteria</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              Click the "New Short Link" button above to generate a short slug and monitor analytics.
            </p>
          </div>
        ) : (
          // URL Card list
          <motion.div className="space-y-4">
            <AnimatePresence>
              {filteredUrls.map((url) => (
                <motion.div
                  key={url._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel glass-panel-hover p-5 rounded-2xl border border-border-glass flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-200 truncate max-w-xs sm:max-w-md">
                        {url.title || 'Untitled Link'}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-purple/10 border border-primary-purple/20 text-purple-400">
                        <MousePointerClick className="h-3 w-3" /> {url.clickCount} click{url.clickCount === 1 ? '' : 's'}
                      </span>
                    </div>

                    {/* Original URL link */}
                    <div className="text-xs text-slate-400 truncate max-w-xs sm:max-w-lg flex items-center gap-1.5">
                      <span className="text-slate-600">Original:</span>
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-blue hover:underline truncate">
                        {url.originalUrl}
                      </a>
                      <ArrowUpRight className="h-3 w-3 text-slate-500" />
                    </div>

                    {/* Shortened URL display */}
                    <div className="flex items-center gap-2 pt-1.5">
                      <a 
                        href={url.shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm font-semibold text-primary-purple hover:underline"
                      >
                        {url.shortUrl}
                      </a>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 self-start md:self-auto mt-2 md:mt-0">
                    {/* Copy to Clipboard */}
                    <button
                      onClick={() => copyToClipboard(url.shortUrl)}
                      className="p-2.5 rounded-xl border border-border-glass text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition duration-200"
                      title="Copy Short Link"
                    >
                      <Copy className="h-4.5 w-4.5" />
                    </button>

                    {/* View Analytics */}
                    <button
                      onClick={() => navigate(`/analytics/${url._id}`)}
                      className="px-4 py-2.5 rounded-xl border border-border-glass text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition duration-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <BarChart3 className="h-4 w-4 text-primary-blue" /> Analytics
                    </button>

                    {/* Delete Link */}
                    <button
                      onClick={() => handleDelete(url._id)}
                      className="p-2.5 rounded-xl border border-border-glass text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition duration-200"
                      title="Delete Link"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
