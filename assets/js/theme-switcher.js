let themeOverlayTimeout;

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme-selector');
  if (selector) {
    selector.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme);
    });
  }

  // Apply saved theme or default
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = saved;
  }
});

function applyTheme(themeName) {
  const existingLink = document.getElementById('theme-style');
  if (existingLink) existingLink.remove();

  const link = document.createElement('link');
  link.id = 'theme-style';
  link.rel = 'stylesheet';
  link.href = `/assets/css/theme-${themeName}.css`;
  document.head.appendChild(link);

  localStorage.setItem('theme', themeName);
  showThemeOverlay(themeName);
}

function showThemeOverlay(themeName) {
  const overlay = document.getElementById('theme-switch-overlay');
  overlay.textContent = `Switching to ${themeName} theme...`;
  overlay.classList.add('show');
  overlay.classList.remove('fade-out');
  overlay.style.visibility = 'visible';

  // Clear any previous timeout so switching is smooth
  if (themeOverlayTimeout) clearTimeout(themeOverlayTimeout);

  // Start new timer for fade-out
  themeOverlayTimeout = setTimeout(() => {
    overlay.classList.add('fade-out');

    // Remove after animation
    themeOverlayTimeout = setTimeout(() => {
      overlay.classList.remove('show', 'fade-out');
      overlay.style.visibility = 'hidden';
    }, 800);
  }, 2000);
}
