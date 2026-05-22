import dotenv from 'dotenv';
// Load env vars FIRST before any other imports use process.env
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/db.js';
import { clerkAuth } from './middleware/auth.middleware.js';
import urlRoutes from './routes/url.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Environment already loaded at top of file

// Connect Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and Logging Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP during development if needed
  crossOriginEmbedderPolicy: false,
}));
// Allowed origins — localhost for dev, Vercel deployment for production.
// FRONTEND_URL env var should be set to your Vercel URL on Render's dashboard.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173', // vite preview
  process.env.FRONTEND_URL,
].filter(Boolean); // remove undefined if FRONTEND_URL not set

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Also allow any *.vercel.app preview URL for your project
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Explicitly handle all OPTIONS preflight requests
app.options('*', cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Apply Clerk authentication middleware globally (injects req.auth on all requests)
app.use(clerkAuth);

// Apply rate limiting globally to general routes
app.use('/api', apiLimiter);

// Healthcheck — placed before redirect routes to ensure it's never shadowed
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Scissor URL Shortener' });
});

// API Resource Endpoints (protected — Clerk auth required)
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Public Redirect Endpoint — /r/:slug (NO auth required, accessible by anyone)
// Must be registered AFTER /api routes to avoid pattern conflicts.
app.use('/', redirectRoutes);

// Centralized error handler fallback
app.use(errorHandler);

// Launch Application Server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
