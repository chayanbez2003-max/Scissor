import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

/**
 * Route guard wrapper that redirects user to Sign-In page if they are unauthenticated.
 */
export default function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn signInForceRedirectUrl="/dashboard" />
      </SignedOut>
    </>
  );
}
