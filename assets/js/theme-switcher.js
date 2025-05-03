document.addEventListener('DOMContentLoaded', function () {
  const theme = localStorage.getItem('theme') || 'matrix';
  applyTheme(theme, false);

  const selector = document.getElementById('theme-selector');
  if (selector) {
    selector.value = theme;
    selector.addEventListener('change', function () {
      localStorage.setItem('theme', this.value);
      applyTheme(this.value, true);
    });
  }
});

function applyTheme(themeName, animate = true) {
  const link = document.getElementById('dynamic-theme');
  const overlay = document.getElementById('theme-switch-overlay');

  if (animate && overlay) {
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    overlay.textContent = `⚙️ Switching to ${themeName} theme...`;
  }

  if (link) {
    const baseHref = link.href.split('?')[0];
    const newHref = baseHref.replace(/theme-[^.]+\.css/, `theme-${themeName}.css`);
    const versionParam = link.href.includes('?') ? '?' + link.href.split('?')[1] : '';
    link.href = `${newHref}${versionParam}`;
  }

  if (animate && overlay) {
    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
        overlay.classList.remove('fade-out');
      }, 600);
    }, 1000); // delay before fade-out
  }
}
