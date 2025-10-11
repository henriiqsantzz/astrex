// PWA register + install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').hidden = false;
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installBtn').hidden = true;
});
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

// UI refs
const appName = document.getElementById('appName');
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const useAppAsTitle = document.getElementById('useAppAsTitle');
const qty = document.getElementById('qty');
const qtyLabel = document.getElementById('qtyLabel');
const gap = document.getElementById('gap');
const askPerm = document.getElementById('askPerm');
const startBtn = document.getElementById('start');
const logoChoices = document.getElementById('logoChoices');
const logoUpload = document.getElementById('logoUpload');
const previewTitle = document.getElementById('previewTitle');
const previewBody = document.getElementById('previewBody');
const previewIcon = document.getElementById('previewIcon');

let unit = 's'; // s|m
let iconDataUrl = '/icons/astrex.png';
let selectedAppName = 'Astrex';

qty.addEventListener('input', () => qtyLabel.textContent = qty.value);

for (const pill of document.querySelectorAll('.pill')) {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active'); unit = pill.dataset.unit;
  });
}

// preset logos
logoChoices.addEventListener('click', (ev) => {
  const btn = ev.target.closest('.logo-btn');
  if (!btn || btn.tagName === 'LABEL') return;
  document.querySelectorAll('.logo-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const type = btn.dataset.builtin;
  const map = {
    default: { icon: '/icons/astrex.png', name: 'Astrex' },
    kiwify: { icon: 'icons/swatch-kiwify.png', name: 'Kiwify' },
    c6: { icon: 'icons/swatch-c6.png', name: 'C6 Bank' },
    e: { icon: 'icons/swatch-e.png', name: 'Ebanx' },
    b: { icon: 'icons/swatch-b.png', name: 'Banco b.' },
    f: { icon: 'icons/swatch-f.png', name: 'FastPay' }
  };
  const cfg = map[type] || map.default;
  iconDataUrl = cfg.icon;
  selectedAppName = btn.dataset.appname || cfg.name;
  appName.value = selectedAppName;
  previewIcon.src = iconDataUrl;
  updatePreview();
});

logoUpload.addEventListener('change', async () => {
  const file = logoUpload.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    iconDataUrl = reader.result;
    previewIcon.src = iconDataUrl;
    const n = prompt('Nome do app para usar nas notificações (ex.: Kiwify):', selectedAppName) || selectedAppName;
    selectedAppName = n; appName.value = n; updatePreview();
  };
  reader.readAsDataURL(file);
});

function updatePreview(){
  selectedAppName = appName.value || selectedAppName || 'Astrex';
  const title = useAppAsTitle.checked ? selectedAppName : (titleInput.value || selectedAppName);
  previewTitle.textContent = title;
  const parts = [];
  if (!useAppAsTitle.checked && titleInput.value) parts.push(titleInput.value);
  if (descInput.value) parts.push(descInput.value);
  previewBody.textContent = parts.join(' • ') || 'Descrição de exemplo';
}
[appName, titleInput, descInput, useAppAsTitle].forEach(el => el.addEventListener('input', updatePreview));
updatePreview();

askPerm.addEventListener('click', async () => {
  const status = await Notification.requestPermission();
  if (status !== 'granted') alert('Ative as notificações para continuar.');
});

startBtn.addEventListener('click', async () => {
  if (!('Notification' in window)) return alert('Seu navegador não suporta Notifications API.');
  if (Notification.permission !== 'granted') {
    const status = await Notification.requestPermission();
    if (status !== 'granted') return alert('Permissão negada.');
  }
  const n = parseInt(qty.value, 10) || 1;
  const delay = Math.max(1, parseInt(gap.value, 10) || 1) * (unit === 'm' ? 60000 : 1000);

  const title = useAppAsTitle.checked ? (appName.value || selectedAppName || 'Astrex') : (titleInput.value || appName.value || selectedAppName || 'Astrex');
  const parts = [];
  if (!useAppAsTitle.checked && titleInput.value) parts.push(titleInput.value);
  if (descInput.value) parts.push(descInput.value);
  const body = parts.join(' • ');

  for (let i=0; i<n; i++) {
    setTimeout(async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      const opts = { body, icon: iconDataUrl, badge: 'icons/badge.png', vibrate: [100,50,100], tag: 'notif-seq', data:{ts:Date.now()} };
      if (reg) reg.showNotification(title, opts); else new Notification(title, opts);
    }, i * delay);
  }
});
