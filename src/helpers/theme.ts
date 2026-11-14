/** localStorage key holding the visitor's chosen theme. */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Runs in <head> before first paint and applies the saved theme, so a
 * light-theme visitor never sees the server-rendered dark page first.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;
