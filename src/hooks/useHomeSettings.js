import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../utils/api";

// Default home settings to prevent blocking
const DEFAULT_HOME_SETTINGS = {
  sliderImages: [],
  sliderHeading: "LONAVALA",
  sliderSubheading: "The Arboreal Resort",
  sliderDescription: "Tucked away in the untouched forests of the Western Ghats, The Arboreal Resort is an eco-luxury retreat overlooking the serene Pawna Lake.",
  accommodations: [],
  heroVideoUrl: "",
  heroPosterUrl: "",
};

export const useHomeSettings = () => {
  // Start with defaults immediately (non-blocking)
  const [settings, setSettings] = useState(DEFAULT_HOME_SETTINGS);
  const [loading, setLoading] = useState(false); // Start as false since we have defaults
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once to prevent duplicate API calls
    if (hasFetchedRef.current) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/home");
        if (data.success && data.settings) {
          // Debug: inspect home settings coming from backend (including sliderImages)
          console.log(
            "[HomeSettings] Loaded settings from backend:",
            data.settings
          );
          console.log(
            "[HomeSettings] sliderImages count:",
            Array.isArray(data.settings.sliderImages)
              ? data.settings.sliderImages.length
              : 0
          );
          // Defer state update to avoid interrupting scroll
          const updateSettings = () => {
            if (!window.isLenisScrolling) {
              setSettings(data.settings);
            } else {
              // Wait for scroll to end before updating
              const checkScroll = setInterval(() => {
                if (!window.isLenisScrolling) {
                  setSettings(data.settings);
                  clearInterval(checkScroll);
                }
              }, 100);
              // Fallback: update after 2 seconds even if still scrolling
              setTimeout(() => {
                clearInterval(checkScroll);
                setSettings(data.settings);
              }, 2000);
            }
          };
          requestAnimationFrame(updateSettings);
        } else {
          // Keep defaults if API fails
          console.warn('Home settings fetch failed, using defaults');
        }
      } catch (err) {
        console.error('Failed to fetch home settings:', err);
        setError(err.message || "Failed to fetch home settings");
        // Keep defaults - don't overwrite with empty object
      } finally {
        setLoading(false);
        hasFetchedRef.current = true;
      }
    };

    // Fetch in background, don't block render
    fetchSettings();
  }, []);

  return { settings, loading, error };
};


