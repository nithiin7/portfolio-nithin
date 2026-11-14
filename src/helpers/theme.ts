export const THEME_STORAGE_KEY = 'theme';

/** Inline script that applies the stored theme before paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;
