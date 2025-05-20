// Register service worker for PWA functionality

// Check if PWA is disabled via environment variable
const isPwaDisabled = import.meta.env.VITE_PLUGIN_PWA_DISABLED === 'true';

if ('serviceWorker' in navigator && !isPwaDisabled) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
} else if (isPwaDisabled) {
  console.log('PWA functionality is disabled via VITE_PLUGIN_PWA_DISABLED environment variable');
  
  // Unregister any existing service workers when PWA is disabled
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for(let registration of registrations) {
        registration.unregister();
        console.log('Service Worker unregistered due to PWA being disabled');
      }
    });
  }
}
