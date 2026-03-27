import { useEffect } from 'react';
import { useGlobalSEO } from '../hooks/useGlobalSEO';

/**
 * Component to inject SEO scripts (analytics, verification codes, custom scripts)
 * This component should be placed in the root App or Layout component
 */
const SEOScripts = () => {
  const { seoSettings } = useGlobalSEO();

  useEffect(() => {
    if (!seoSettings) return;

    // Remove existing scripts to avoid duplicates
    const removeExistingScripts = (selector) => {
      const existing = document.querySelectorAll(selector);
      existing.forEach((el) => el.remove());
    };

    // Google Analytics
    if (seoSettings.googleAnalyticsId) {
      removeExistingScripts('script[data-seo="ga"]');
      
      // Load gtag.js
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${seoSettings.googleAnalyticsId}`;
      gaScript.setAttribute('data-seo', 'ga');
      document.head.appendChild(gaScript);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', seoSettings.googleAnalyticsId);
    }

    // Google Tag Manager
    if (seoSettings.googleTagManagerId) {
      removeExistingScripts('script[data-seo="gtm"]');
      removeExistingScripts('noscript[data-seo="gtm"]');

      // GTM Script
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${seoSettings.googleTagManagerId}');`;
      gtmScript.setAttribute('data-seo', 'gtm');
      document.head.appendChild(gtmScript);

      // GTM Noscript
      const gtmNoscript = document.createElement('noscript');
      gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${seoSettings.googleTagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      gtmNoscript.setAttribute('data-seo', 'gtm');
      document.body.insertBefore(gtmNoscript, document.body.firstChild);
    }

    // Facebook Pixel
    if (seoSettings.facebookPixelId) {
      removeExistingScripts('script[data-seo="fb-pixel"]');

      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${seoSettings.facebookPixelId}');
        fbq('track', 'PageView');
      `;
      fbScript.setAttribute('data-seo', 'fb-pixel');
      document.head.appendChild(fbScript);

      // Facebook Pixel noscript
      const fbNoscript = document.createElement('noscript');
      fbNoscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${seoSettings.facebookPixelId}&ev=PageView&noscript=1"/>`;
      fbNoscript.setAttribute('data-seo', 'fb-pixel');
      document.body.appendChild(fbNoscript);
    }

    // Google Search Console Verification
    if (seoSettings.googleSearchConsoleCode) {
      removeExistingScripts('meta[name="google-site-verification"]');
      
      const verificationMeta = document.createElement('meta');
      verificationMeta.name = 'google-site-verification';
      verificationMeta.content = seoSettings.googleSearchConsoleCode;
      document.head.appendChild(verificationMeta);
    }

    // Bing Webmaster Verification
    if (seoSettings.bingWebmasterCode) {
      removeExistingScripts('meta[name="msvalidate.01"]');
      
      const bingMeta = document.createElement('meta');
      bingMeta.name = 'msvalidate.01';
      bingMeta.content = seoSettings.bingWebmasterCode;
      document.head.appendChild(bingMeta);
    }

    // Custom Tracking Scripts
    if (seoSettings.customTrackingScripts) {
      removeExistingScripts('script[data-seo="custom"]');
      
      const customScriptContainer = document.createElement('div');
      customScriptContainer.innerHTML = seoSettings.customTrackingScripts;
      customScriptContainer.setAttribute('data-seo', 'custom');
      
      // Extract and execute scripts
      const scripts = customScriptContainer.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.innerHTML = oldScript.innerHTML;
        }
        newScript.setAttribute('data-seo', 'custom');
        document.head.appendChild(newScript);
      });
    }
  }, [seoSettings]);

  return null; // This component doesn't render anything
};

export default SEOScripts;

