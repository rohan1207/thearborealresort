import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export const useGlobalSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await apiFetch("/settings");
        if (data.success) {
          setSettings(data.settings);
        } else {
          setError(data.message || "Failed to fetch global settings");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch global settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};


