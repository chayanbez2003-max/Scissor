import { clerkMiddleware, getAuth } from '@clerk/express';

/**
 * Clerk express middleware - injects auth state into all requests.
 * Must be applied globally in server.js before route handlers.
 */
export const clerkAuth = clerkMiddleware();

/**
 * Route protection middleware.
 * Checks that a valid Clerk session exists before allowing access.
 * Returns a clean 401 JSON response if unauthorized.
 */
export const protectRoute = (req, res, next) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Active session not found or token expired.',
    });
  }
  // Attach auth to req for downstream use
  req.auth = auth;
  next();
};
