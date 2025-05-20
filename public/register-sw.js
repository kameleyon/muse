// Register service worker for PWA functionality

// Check if PWA is disabled via environment variable
// Using a safer check that won't throw an error if import.meta.env is undefined
const isPwaDisabled = typeof import.meta !== 'undefined' && 
                     import.meta.env && 
                     import.meta.env.VITE_PLUGIN_PWA_DISABLED === 'true';

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
