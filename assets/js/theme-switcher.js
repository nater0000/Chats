let themeOverlayTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme-selector');
  const overlay = document.getElementById('theme-switch-overlay');

  function showThemeOverlay(themeName) {
    if (!overlay) return;
    overlay.textContent = `Switching to ${themeName} theme...`;
    overlay.classList.add('show');
    overlay.classList.remove('fade-out');
    overlay.style.visibility = 'visible';

    if (themeOverlayTimeout) clearTimeout(themeOverlayTimeout);
    themeOverlayTimeout = setTimeout(() => {
      overlay.classList.add('fade-out');
      themeOverlayTimeout = setTimeout(() => {
        overlay.classList.remove('show', 'fade-out');
        overlay.style.visibility = 'hidden';
      }, 800);
    }, 2000);
  }

  function applyTheme(themeName, showOverlay = false) {
    const existingLink = document.getElementById('dynamic-theme');
    const baseHref = `/assets/css/theme-${themeName}.css`;
    const newHref = `${baseHref}?v=${Date.now()}`;
    const currentHref = existingLink?.getAttribute('href')?.split('?')[0];

    if (currentHref === baseHref) {
      if (showOverlay) showThemeOverlay(themeName);
      return;
    }

    if (existingLink) {
      existingLink.setAttribute('href', newHref);
    } else {
      const link = document.createElement('link');
      link.id = 'dynamic-theme';
      link.rel = 'stylesheet';
      link.href = newHref;
      document.head.appendChild(link);
    }

    localStorage.setItem('theme', themeName);
    if (selector) selector.value = themeName;
    if (showOverlay) showThemeOverlay(themeName);
  }

  // Set saved theme on load
  const savedTheme = localStorage.getItem('theme') || 'matrix';
  applyTheme(savedTheme, false);

  // Wire up dropdown
  if (selector) {
    selector.value = savedTheme;
    selector.addEventListener('change', () => {
      applyTheme(selector.value, true);
    });
  }
});
