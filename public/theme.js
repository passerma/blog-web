const dark = window.localStorage.getItem('theme-mode')
if (dark) {
  window['theme-mode'] = 'dark'
  document.documentElement.setAttribute('theme-mode', 'dark');
}
