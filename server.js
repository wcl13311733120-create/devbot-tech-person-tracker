const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const T = require('./lib/tracker');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tracking.json');

app.use(express.json());
app.use(express.static(__dirname));

function load() { try { const d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); return Array.isArray(d) ? d : []; } catch (e) { return []; } }
function save(d) { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/people', (req, res) => {
  const q = req.query.q || '';
  res.json(T.searchPeople(q));
});
app.get('/api/people/:id', (req, res) => {
  const a = T.analyzePerson(req.params.id);
  if (!a) return res.status(404).json({ error: 'not found' });
  res.json(a);
});
app.get('/api/people/:id/report', (req, res) => {
  const r = T.buildReport(req.params.id);
  if (!r) return res.status(404).json({ error: 'not found' });
  res.json({ report: r });
});
app.get('/api/compare', (req, res) => {
  const ids = (req.query.ids || '').split(',').filter(Boolean);
  res.json(T.comparePeople(ids));
});
app.get('/api/top-events', (req, res) => {
  const n = parseInt(req.query.n) || 10;
  res.json(T.topEvents(n));
});
app.post('/api/track', (req, res) => {
  const { personId = '', note = '' } = req.body || {};
  const a = T.analyzePerson(personId);
  if (!a) return res.status(400).json({ error: '人物不存在' });
  const rec = { id: crypto.randomUUID(), ts: new Date().toISOString(), personId, personName: a.person.name, note, snapshot: { heatTotal: a.heatTotal, riskLevel: a.riskLevel, trend: a.trend } };
  const all = load(); all.unshift(rec); save(all.slice(0, 200));
  res.json(rec);
});
app.get('/api/tracking', (req, res) => res.json(load()));

app.listen(PORT, () => console.log(`Tech Person Tracker running on http://localhost:${PORT}`));
