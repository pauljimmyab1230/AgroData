let container: HTMLDivElement | null = null;

function getContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 4000) {
  const el = document.createElement('div');
  const colors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-gray-800 text-white',
  };
  el.className = `px-4 py-3 rounded-lg shadow-lg text-sm font-medium pointer-events-auto animate-[slideIn_0.2s_ease-out] ${colors[type]}`;
  el.textContent = message;
  el.style.cssText = 'max-width:360px;word-break:break-word;';

  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
  if (!document.querySelector('#toast-styles')) {
    style.id = 'toast-styles';
    document.head.appendChild(style);
  }

  getContainer().appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 0.2s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 200);
  }, duration);
}

export const toast = {
  success: (msg: string) => showToast(msg, 'success'),
  error: (msg: string) => showToast(msg, 'error'),
  info: (msg: string) => showToast(msg, 'info'),
};
