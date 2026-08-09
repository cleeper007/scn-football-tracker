/* SCN Football Tracker — renders data.json into the dashboard. */

document.addEventListener('DOMContentLoaded', () => {
  initBanner();
  loadBrandLogos();
  fetch('data.json?cb=' + Date.now())
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(render)
    .catch(err => {
      console.error('Could not load data.json:', err);
      document.querySelectorAll('.note').forEach(n => {
        n.textContent = 'Could not load data.json.';
      });
    });
});

/* Reveal the banner once it loads; if it 404s, the CSS stand-in stays put. */
function initBanner() {
  const media = document.getElementById('hero-media');
  const img = document.getElementById('hero-img');
  if (!media || !img) return;
  const show = () => media.classList.add('has-image');
  if (img.complete && img.naturalWidth > 0) show();
  img.addEventListener('load', show);
  img.addEventListener('error', () => media.classList.remove('has-image'));
}

/* Swap in official logo files if the user drops them into assets/logos/. */
function loadBrandLogos() {
  document.querySelectorAll('.brand[data-logo]').forEach(brand => {
    const img = brand.querySelector('img');
    const src = brand.getAttribute('data-logo');
    if (!img || !src) return;
    img.addEventListener('load', () => brand.classList.remove('no-logo'));
    img.addEventListener('error', () => brand.classList.add('no-logo'));
    img.src = src;
  });
}

function render(data) {
  // Header meta
  setText('season-label', (data.season || '') + ' Season');
  const rec = data.record || {};
  setText('record-label', rec.overall ? rec.overall + ' overall' : '—');
  setText('updated', formatDate(data.lastUpdated));

  // Ranking cards
  const sources = data.sources || {};
  ['maxpreps', 'on3'].forEach(key => {
    const src = sources[key];
    const list = document.querySelector(`[data-ranks="${key}"]`);
    const note = document.querySelector(`[data-note="${key}"]`);
    const link = document.querySelector(`[data-link="${key}"]`);
    if (!src) return;

    if (link && src.url) link.href = src.url;
    if (note) note.textContent = src.note || '';

    if (list) {
      list.innerHTML = '';
      (src.rankings || []).forEach(r => {
        const li = document.createElement('li');

        const label = document.createElement('span');
        label.className = 'rank-label';
        label.textContent = r.label;

        const value = document.createElement('span');
        value.className = 'rank-value';
        if (r.value === null || r.value === undefined || r.value === '') {
          value.classList.add('empty');
          value.textContent = '—';
        } else if (typeof r.value === 'number') {
          const hash = document.createElement('span');
          hash.className = 'hash';
          hash.textContent = '#';
          value.append(hash, document.createTextNode(String(r.value)));
        } else {
          value.textContent = r.value;
        }

        li.append(label, value);
        list.appendChild(li);
      });
    }
  });

  // DuKane standings
  const duk = data.dukane || {};
  const dukLink = document.querySelector('[data-link="dukane"]');
  const dukNote = document.querySelector('[data-note="dukane"]');
  if (dukLink && duk.url) dukLink.href = duk.url;
  if (dukNote) dukNote.textContent = duk.note || '';

  const body = document.getElementById('standings-body');
  if (body) {
    body.innerHTML = '';
    (duk.standings || []).forEach((row, i) => {
      const tr = document.createElement('tr');
      if (isSCN(row.team)) tr.className = 'is-scn';
      tr.append(
        cell(String(i + 1), 'c-rank'),
        cell(row.team, 'c-team'),
        cell(row.conf || '—', 'c-num'),
        cell(row.overall || '—', 'c-num')
      );
      body.appendChild(tr);
    });
  }
}

function isSCN(team) {
  return typeof team === 'string' && /st\.?\s*charles\s*north/i.test(team);
}

function cell(text, cls) {
  const td = document.createElement('td');
  td.className = cls;
  td.textContent = text;
  return td;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function formatDate(iso) {
  if (!iso) return '—';
  const parts = String(iso).split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return iso;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
