document.addEventListener('DOMContentLoaded', function () {
  const theme = localStorage.getItem('theme') || 'matrix';
  applyTheme(theme);

  const selector = document.getElementById('theme-selector');
  if (selector) {
    selector.value = theme;
    selector.addEventListener('change', function () {
      localStorage.setItem('theme', this.value);
      applyTheme(this.value);
    });
  }
});

function applyTheme(themeName) {
  let link = document.getElementById('dynamic-theme');

  if (!link) {
    link = document.createElement('link');
    link.id = 'dynamic-theme';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  link.href = `/assets/css/theme-${themeName}.css`;
}
