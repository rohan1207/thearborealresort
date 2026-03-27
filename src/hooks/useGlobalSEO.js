import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

// Default SEO settings to use immediately (prevents blocking)
const DEFAULT_SEO_SETTINGS = {
  defaultMetaTitle: 'The Arboreal Resort | Luxury Nature Retreat in Lonavala',
  defaultMetaDescription: 'Experience luxury in the heart of nature. Private pool rooms, mountain views, premium amenities. Book your stay at The Arboreal Resort, Lonavala.',
  defaultKeywords: ['arboreal resort', 'lonavala resort', 'luxury resort lonavala'],
  defaultOgImage: '',
  siteUrl: 'https://thearborealresort.com',
  siteName: 'The Arboreal Resort',
  siteTagline: 'Experience Luxury and Nature Combined',
};

export const useGlobalSEO = () => {
  // Start with defaults immediately (non-blocking)
  const [seoSettings, setSeoSettings] = useState(DEFAULT_SEO_SETTINGS);
  const [loading, setLoading] = useState(false); // Start as false since we have defaults
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        setLoading(true);
        // Use apiFetch for caching and better error handling
        const data = await apiFetch("/seo");
        if (data.success && data.settings) {
          setSeoSettings(data.settings);
        } else {
          // Keep defaults if API fails
          console.warn('SEO settings fetch failed, using defaults');
        }
      } catch (err) {
        console.error('Failed to fetch global SEO settings:', err);
        setError(err);
        // Keep defaults - don't overwrite with empty object
      } finally {
        setLoading(false);
      }
    };

    // Fetch in background, don't block render
    fetchSEO();
  }, []);

  return { seoSettings, loading, error };
};

