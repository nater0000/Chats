let themeOverlayTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme-selector');
  const saved = localStorage.getItem('theme') || 'matrix';

  if (selector) {
    selector.value = saved;

    // Only inject theme if not already applied
    const currentHref = document.getElementById('dynamic-theme')?.href;
    const expectedHref = `${location.origin}/assets/css/theme-${saved}.css`;
    if (!currentHref || !currentHref.includes(`theme-${saved}.css`)) {
      applyTheme(saved, false); // No overlay
    } else {
      // Theme is already applied, but set dropdown value
      selector.value = saved;
    }

    selector.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme, true); // Only show overlay on change
    });
  } else {
    applyTheme(saved, false);
  }
});

function applyTheme(themeName, showOverlay = false) {
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
