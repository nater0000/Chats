let themeOverlayTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme-selector');
  const saved = localStorage.getItem('theme');

  if (selector) {
    // Apply saved theme without overlay
    if (saved) {
      applyTheme(saved, false);
      selector.value = saved;
    }

    selector.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme, true); // Show overlay only on user change
    });
  } else if (saved) {
    applyTheme(saved, false);
  }
});

function applyTheme(themeName, showOverlay = false) {
  const existingLink = document.getElementById('theme-style');
  if (existingLink) existingLink.remove();

  const link = document.createElement('link');
  link.id = 'theme-style';
  link.rel = 'stylesheet';
  link.href = `/assets/css/theme-${themeName}.css`;
  document.head.appendChild(link);

  localStorage.setItem('theme', themeName);

  if (showOverlay) showThemeOverlay(themeName);
}

function showThemeOverlay(themeName) {
  const overlay = document.getElementById('theme-switch-overlay');
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
