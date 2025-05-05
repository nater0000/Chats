let themeOverlayTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme-selector');
  const overlay = document.getElementById('theme-switch-overlay');
  let overlayTimeout = null;

  function applyTheme(theme, showOverlay = true) {
    const existingLink = document.getElementById('dynamic-theme');
    const newHref = `/assets/css/theme-${theme}.css?v=${new Date().getTime()}`;

    // Prevent duplicate loading
    if (existingLink.getAttribute('href').startsWith(`/assets/css/theme-${theme}.css`)) {
      return;
    }

    // Set theme stylesheet
    existingLink.setAttribute('href', newHref);
    localStorage.setItem('selectedTheme', theme);

    // Show overlay if needed
    if (showOverlay && overlay) {
      overlay.style.display = 'block';
      overlay.style.opacity = 1;

      if (overlayTimeout) clearTimeout(overlayTimeout);
      overlayTimeout = setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => (overlay.style.display = 'none'), 500);
      }, 1000);
    }
  }

  // On load, apply saved theme without showing overlay
  const saved = localStorage.getItem('selectedTheme') || 'matrix';
  selector.value = saved;
  applyTheme(saved, false);

  selector.addEventListener('change', () => {
    applyTheme(selector.value, true);
  });
});


function applyTheme(themeName, showOverlay = false) {
  const savedTheme = localStorage.getItem('theme') || 'matrix';
  const selector = document.getElementById('theme-selector');
  selector.value = savedTheme;

  const existingLink = document.getElementById('dynamic-theme');
  const baseHref = `/assets/css/theme-${themeName}.css`;
  const newHref = `${baseHref}?v=${Date.now()}`;

  const stripVersion = (href) => href?.split('?')[0];

  if (existingLink && stripVersion(existingLink.getAttribute('href')) === baseHref) {
    if (showOverlay) showThemeOverlay(themeName);
    return;
  }

  if (existingLink) {
    existingLink.href = newHref;
  } else {
    const link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    link.href = newHref;
    document.head.appendChild(link);
  }

  localStorage.setItem('theme', themeName);
  if (showOverlay) showThemeOverlay(themeName);
}


function showThemeOverlay(themeName) {
  const overlay = document.getElementById('theme-switch-overlay');
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
