'use client';

import { useState, useCallback } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (apiFn, options = {}) => {
    const { onSuccess, onError, showError = true } = options;
    setLoading(true);
    setError(null);
    try {
      const response = await apiFn();
      const data = response.data;
      if (onSuccess) onSuccess(data);
      return { data, error: null };
    } catch (err) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Something went wrong';
      if (showError) setError(message);
      if (onError) onError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => setError(null);

  return { loading, error, call, reset };
}