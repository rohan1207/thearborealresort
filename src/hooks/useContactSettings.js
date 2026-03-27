import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const useContactSettings = () => {
  const [contactSettings, setContactSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/contact`);
        if (!response.ok) throw new Error('Failed to fetch contact settings');
        const data = await response.json();
        setContactSettings(data.settings);
      } catch (err) {
        console.error('Failed to fetch contact settings:', err);
        setError(err);
        // Set defaults if fetch fails
        setContactSettings({
          address: 'The Arboreal, Pvt. Road, Gevhande Apati, Lonavala, Maharashtra 412108',
          addressLink: 'https://maps.app.goo.gl/2EL8NXUZgh4An2NL8',
          phone: '+91 8065423948',
          phoneDisplay: '+91 8065423948  *(+91 is essential)',
          email: 'reservations@thearborealresort.com',
          workingHours: '24/7 Reception, Always Available',
          whatsappNumber: '918065423948',
          formEnabled: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  return { contactSettings, loading, error };
};

/**
 * Universal WhatsApp redirect function that works on all platforms
 * @param {string} phoneNumber - WhatsApp number (country code + number, no + or spaces)
 * @param {string} message - Message to send
 */
export const redirectToWhatsApp = (phoneNumber, message) => {
  // Clean phone number (remove +, spaces, dashes, parentheses)
  const cleanPhone = phoneNumber.replace(/[\s\+\-\(\)]/g, '');
  const encodedMessage = encodeURIComponent(message);

  // Detect platform
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;
  const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent);
  const isWindows = /Win32|Win64|Windows/.test(userAgent);

  if (isMobile) {
    // Mobile devices (iOS & Android)
    // Method 1: Try WhatsApp app first (native app)
    const whatsappAppUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    // Method 2: WhatsApp web as fallback
    const whatsappWebUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // For iOS: Use wa.me which automatically opens app if installed
    if (isIOS) {
      window.location.href = whatsappWebUrl;
    } else {
      // For Android: Try app first, then web
      try {
        window.location.href = whatsappAppUrl;
        // Fallback to web after delay if app doesn't open
        setTimeout(() => {
          window.location.href = whatsappWebUrl;
        }, 1000);
      } catch (e) {
        window.location.href = whatsappWebUrl;
      }
    }
  } else {
    // Desktop (Windows, Mac, Linux)
    // Use WhatsApp Web
    const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    // Try to open in new tab/window
    try {
      const newWindow = window.open(whatsappWebUrl, '_blank', 'noopener,noreferrer');
      
      // If popup was blocked, redirect current window
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = whatsappWebUrl;
      }
    } catch (e) {
      // If window.open fails, redirect current window
      window.location.href = whatsappWebUrl;
    }
  }
};

