import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

export const useGallerySettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch('/gallery');
        
        if (mounted) {
          if (data.success && data.settings) {
            setSettings(data.settings);
          } else {
            setError(new Error(data.message || 'Failed to fetch gallery settings'));
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('[useGallerySettings] Error:', err);
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading, error };
};


