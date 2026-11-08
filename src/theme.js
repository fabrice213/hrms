export function normalizeTheme(value) {
 return value === 'Dark' ? 'Dark' : 'Light';
}
export function applyTheme(value) {
 const theme = normalizeTheme(value);
 document.documentElement.dataset.theme = theme.toLowerCase();
 document.documentElement.style.colorScheme = theme.toLowerCase();
 return theme;
}
export function initializeTheme() {
 try { return applyTheme(JSON.parse(localStorage.getItem('hrms_settings') || '{}').theme); }
 catch { return applyTheme('Light'); }
}
export function saveTheme(value) {
 const theme = normalizeTheme(value);
 const settings = JSON.parse(localStorage.getItem('hrms_settings') || '{}');
 localStorage.setItem('hrms_settings', JSON.stringify({...settings, theme}));
 return applyTheme(theme);
}
