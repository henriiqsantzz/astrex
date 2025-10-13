require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const { join } = require('path');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// simple JSON DB for subscriptions and notifications
const dbFile = join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);
async function initDb() {
  await db.read();
  db.data = db.data || { subscriptions: [], notifications: [] };
  await db.write();
}

initDb();

// VAPID keys must be set in .env or generated with `npm run gen-keys`
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || '';
if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.warn('VAPID keys not found. Run `npm run gen-keys` or set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env');
} else {
  webpush.setVapidDetails('mailto:astrex@example.com', VAPID_PUBLIC, VAPID_PRIVATE);
}

app.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC });
});

app.post('/register', async (req, res) => {
  const sub = req.body.subscription;
  if (!sub) return res.status(400).json({ error: 'Missing subscription' });
  await db.read();
  // avoid duplicates (by endpoint)
  const exists = db.data.subscriptions.find(s => s.endpoint === sub.endpoint);
  if (!exists) {
    db.data.subscriptions.push({ id: nanoid(), subscription: sub });
    await db.write();
  }
  res.json({ ok: true });
});

app.post('/sendNotification', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });
  await db.read();
  const payload = JSON.stringify({ title, description });
  const subs = db.data.subscriptions || [];
  const results = [];
  for (const s of subs) {
    try {
      await webpush.sendNotification(s.subscription, payload);
      results.push({ id: s.id, status: 'ok' });
    } catch (err) {
      // remove invalid subscriptions
      results.push({ id: s.id, status: 'error', message: err.message });
    }
  }
  // store notification
  db.data.notifications = db.data.notifications || [];
  db.data.notifications.unshift({ id: nanoid(), title, description, date: new Date().toISOString(), sentTo: subs.length });
  await db.write();
  res.json({ results, sentTo: subs.length });
});

app.get('/subscriptions', async (req, res) => {
  await db.read();
  res.json(db.data.subscriptions || []);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Astrex server running on http://localhost:${port}`));
