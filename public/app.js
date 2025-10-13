async function fetchVapidKey() {
  const res = await fetch('/vapidPublicKey');
  const data = await res.json();
  return data.publicKey;
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

document.getElementById('enableBtn').addEventListener('click', async () => {
  if (!('serviceWorker' in navigator)) return alert('Service Worker não suportado');
  const reg = await navigator.serviceWorker.register('/sw.js');
  document.getElementById('status').textContent = 'Service Worker registrado.';

  const permission = await Notification.requestPermission();
  document.getElementById('status').textContent = 'Permissão: ' + permission;

  if (permission !== 'granted') return;

  const publicKey = await fetchVapidKey();
  if (!publicKey) return alert('VAPID public key não configurada no servidor.');

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ subscription: sub })
  });
  document.getElementById('status').textContent = 'Registrado com sucesso.';
});

document.getElementById('sendBtn').addEventListener('click', async () => {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  if (!title) return alert('Preencha o título');
  const res = await fetch('/sendNotification', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title, description })
  });
  const data = await res.json();
  document.getElementById('sendResult').textContent = JSON.stringify(data, null, 2);
});

document.getElementById('testLocalBtn').addEventListener('click', () => {
  const title = document.getElementById('title').value || 'Teste Astrex';
  const description = document.getElementById('description').value || 'Descrição de teste';
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'local-notification', title, description });
  } else {
    new Notification(title, { body: description, icon: '/icons/icon-192.png' });
  }
});

document.getElementById('refreshSubs').addEventListener('click', async () => {
  const res = await fetch('/subscriptions');
  const data = await res.json();
  document.getElementById('subsList').textContent = JSON.stringify(data, null, 2);
});
