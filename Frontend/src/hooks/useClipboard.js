import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook to copy text to clipboard.
 * Provides copied state and auto-resets after a timeout.
 */
export const useClipboard = (resetDelay = 2000) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((text) => {
    if (!navigator.clipboard) {
      toast.error('Clipboard copy not supported by your browser');
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), resetDelay);
      })
      .catch((err) => {
        console.error('Failed to copy text:', err);
        toast.error('Failed to copy link');
      });
  }, [resetDelay]);

  return { copied, copyToClipboard };
};
export default useClipboard;
