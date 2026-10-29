/* daily.js — «Динамика теста по дням» (вкладка «Анализ результатов» → непрерывная метрика).
   Optional block: opens on demand, lazy-loads Chart.js, starts with a seeded sample dataset.
   Statistics come from stats.js (welchT, normCDF, normInvCDF) — the same functions the Analyse tab uses. */
(function () {
  'use strict';
  const CHART_URL = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
  const $ = id => document.getElementById(id);
  if (!$('dy-card')) return;

  /* ── i18n helpers ── */
  const L = (k, vars) => {
    let s = (typeof T !== 'undefined' && T[currentLang] && T[currentLang][k]) || (T && T.en && T.en[k]) || k;
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  };
  const loc = () => (currentLang === 'ru' ? 'ru-RU' : 'en-US');
  const fmt = (x, d = 0) => x.toLocaleString(loc(), { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtP = p => (p < 0.001 ? '< ' + fmt(0.001, 3) : fmt(p, 3));
  const sign = (x, d = 1) => (x > 0 ? '+' : x < 0 ? '−' : '') + fmt(Math.abs(x), d) + '%';
  const dayLab = d => new Date(d + 'T00:00:00Z').toLocaleDateString(loc(), { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const isWeekend = d => { const w = new Date(d + 'T00:00:00Z').getUTCDay(); return w === 0 || w === 6; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ── seeded sample: revenue per visitor, 21 days, true +6% conversion lift + novelty in week 1 ── */
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function generateSample() {
    const c = { seed: 29, days: 21, perDay: 1500, conv: 0.075, aov: 2400, sigma: 0.8, lift: 0.06, novelty: 0.10, tau: 3, start: '2026-09-07' };
    const r = mulberry32(c.seed);
    const norm = () => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
    const rows = []; let uid = 100000; const start = Date.parse(c.start + 'T00:00:00Z');
    for (let d = 0; d < c.days; d++) {
      const date = new Date(start + d * 86400000), dow = date.getUTCDay(), wknd = (dow === 0 || dow === 6);
      const traffic = Math.round(2 * c.perDay * (wknd ? 0.78 : 1) * (1 + 0.06 * norm()));
      const convBase = c.conv * (wknd ? 1.12 : 1), lift = c.lift + c.novelty * Math.exp(-d / c.tau), iso = date.toISOString().slice(0, 10);
      for (let i = 0; i < traffic; i++) {
        const g = r() < 0.5 ? 'A' : 'B'; const p = g === 'B' ? convBase * (1 + lift) : convBase;
        let v = 0; if (r() < p) v = Math.round(Math.exp(Math.log(c.aov) - c.sigma * c.sigma / 2 + c.sigma * norm()));
        rows.push([iso, 'u' + (uid++), g, v]);
      }
    }
    return rows;
  }
  const sampleCSV = rows => 'date,user_id,group,revenue\n' + rows.map(r => r.join(',')).join('\n') + '\n';

  /* ── parsing: per-user rows or daily totals ── */
  const H = { date: ['date', 'day', 'дата', 'день'], group: ['group', 'variant', 'arm', 'группа', 'вариант'],
    value: ['revenue', 'value', 'metric', 'amount', 'значение', 'выручка', 'метрика'],
    users: ['users', 'n', 'count', 'пользователи', 'пользователей'], mean: ['mean', 'avg', 'average', 'среднее'],
    sd: ['sd', 'std', 'stdev', 'std_dev', 'отклонение'] };
  const findCol = (head, keys) => head.map(x => String(x).trim().toLowerCase()).findIndex(x => keys.includes(x));
  function toISO(v) {
    if (v instanceof Date && !isNaN(v)) return new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate())).toISOString().slice(0, 10);
    const s = String(v).trim(); let m;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
    if ((m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})/))) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
    return null;
  }
  const num = v => (typeof v === 'number' ? v : parseFloat(String(v).replace(/\s/g, '').replace(',', '.')));
  class UserError extends Error {}
  function parseTable(table) {
    if (table.length < 2) throw new UserError(L('dy_e_norows'));
    const head = table[0], body = table.slice(1).filter(r => r.some(c => String(c).trim() !== ''));
    const iD = findCol(head, H.date), iG = findCol(head, H.group);
    if (iD < 0 || iG < 0) throw new UserError(L('dy_e_cols'));
    const iV = findCol(head, H.value), iN = findCol(head, H.users), iM = findCol(head, H.mean), iS = findCol(head, H.sd);
    const days = new Map(); let bad = 0, rows = 0;
    const cell = (d, g) => { if (!days.has(d)) days.set(d, {}); const o = days.get(d); return o[g] || (o[g] = { n: 0, s: 0, q: 0 }); };
    if (iV >= 0) {
      for (const r of body) { const d = toISO(r[iD]), g = String(r[iG]).trim(), v = num(r[iV]);
        if (!d || !g || !isFinite(v)) { bad++; continue; } const c = cell(d, g); c.n++; c.s += v; c.q += v * v; rows++; }
    } else if (iN >= 0 && iM >= 0 && iS >= 0) {
      for (const r of body) { const d = toISO(r[iD]), g = String(r[iG]).trim(), n = num(r[iN]), m = num(r[iM]), sd = num(r[iS]);
        if (!d || !g || !(n > 1) || !isFinite(m) || !isFinite(sd)) { bad++; continue; }
        const c = cell(d, g); c.n += n; c.s += n * m; c.q += (n - 1) * sd * sd + n * m * m; rows++; }
    } else throw new UserError(L('dy_e_val'));
    const groups = [...new Set([...days.values()].flatMap(o => Object.keys(o)))];
    if (groups.length !== 2) throw new UserError(L('dy_e_groups', { k: groups.length, g: groups.slice(0, 5).join(', ') }));
    return { days, groups, rows, bad, mode: iV >= 0 ? 'users' : 'agg' };
  }
  function pickControl(groups) {
    const names = ['a', 'control', 'контроль', 'ctrl', 'c'];
    const c = groups.find(g => names.includes(g.toLowerCase())) || [...groups].sort()[0];
    return [c, groups.find(g => g !== c)];
  }

  /* ── state & series ── */
  const st = { agg: null, file: null, isSample: true, rows: null, ctrl: null, test: null, alpha: 0.05, plan: 21, day: 21, mode: 'daily', series: null, timer: null };
  function buildSeries() {
    const { days } = st.agg, A = st.ctrl, B = st.test, dates = [...days.keys()].sort();
    const acc = { A: { n: 0, s: 0, q: 0 }, B: { n: 0, s: 0, q: 0 } }, z = normInvCDF(1 - st.alpha / 2);
    return dates.map((d, i) => {
      const o = days.get(d), a = o[A] || { n: 0, s: 0, q: 0 }, b = o[B] || { n: 0, s: 0, q: 0 };
      acc.A.n += a.n; acc.A.s += a.s; acc.A.q += a.q; acc.B.n += b.n; acc.B.s += b.s; acc.B.q += b.q;
      const s = g => { const x = acc[g], m = x.s / x.n; return { n: x.n, mean: m, sd: Math.sqrt(Math.max(0, (x.q - x.n * m * m) / (x.n - 1))) }; };
      const cA = s('A'), cB = s('B'), ok = cA.n > 1 && cB.n > 1 && cA.sd > 0 && cB.sd > 0;
      const w = ok ? welchT(cA, cB) : null, diff = cB.mean - cA.mean;
      const N = cA.n + cB.n, srmP = 2 * (1 - normCDF(Math.abs((cB.n - N / 2) / Math.sqrt(N / 4))));
      return { i, date: d, dA: a.n ? a.s / a.n : null, dB: b.n ? b.s / b.n : null, nA: a.n, nB: b.n, cA, cB,
        p: w ? w.p : null, lift: w ? w.liftPct : null,
        lo: w ? (diff - z * w.se) / cA.mean * 100 : null, hi: w ? (diff + z * w.se) / cA.mean * 100 : null, srmP };
    });
  }

  /* ── charts (Chart.js, loaded only when the block is opened) ── */
  let chartLib = null;
  function loadChart() {
    if (window.Chart) return Promise.resolve();
    if (chartLib) return chartLib;
    chartLib = new Promise((res, rej) => { const s = document.createElement('script'); s.src = CHART_URL; s.onload = res;
      s.onerror = () => { chartLib = null; rej(new Error('chart')); }; document.head.appendChild(s); });
    return chartLib;
  }
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const charts = {};
  const markers = { id: 'dyMarkers', beforeDatasetsDraw(chart, _, o) {
    const { ctx, chartArea: a, scales: { x } } = chart; if (!st.series) return; ctx.save();
    if (o.weekends) { ctx.fillStyle = css('--dy-weekend'); const w = (a.right - a.left) / Math.max(1, st.series.length - 1);
      st.series.forEach((s, i) => { if (isWeekend(s.date)) { const cx = x.getPixelForValue(i); const l = Math.max(a.left, cx - w / 2);
        ctx.fillRect(l, a.top, Math.min(cx + w / 2, a.right) - l, a.bottom - a.top); } }); }
    if (o.plan && st.plan <= st.series.length) { const px = x.getPixelForValue(st.plan - 1); ctx.strokeStyle = css('--ink-faint');
      ctx.setLineDash([3, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.stroke(); ctx.setLineDash([]); }
    const sx = x.getPixelForValue(st.day - 1); ctx.strokeStyle = css('--accent'); ctx.lineWidth = 1.5; ctx.globalAlpha = 0.55;
    ctx.beginPath(); ctx.moveTo(sx, a.top); ctx.lineTo(sx, a.bottom); ctx.stroke(); ctx.restore(); } };
  const FONT_UI = 'Inter, system-ui, sans-serif', FONT_NUM = "'JetBrains Mono', ui-monospace, Menlo, monospace";
  function opts(extra, yTicks) {
    const ink = css('--ink-muted'), grid = css('--dy-grid');
    return Object.assign({ responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
      onClick: (e, els, chart) => { const pts = chart.getElementsAtEventForMode(e, 'index', { intersect: false }, true); if (pts.length) setDay(pts[0].index + 1); },
      plugins: { legend: { display: false } },
      scales: { x: { grid: { display: false }, ticks: { color: ink, maxRotation: 0, autoSkipPadding: 14, font: { family: FONT_UI, size: 11 } } },
        y: Object.assign({ grid: { color: grid }, ticks: Object.assign({ color: ink, font: { family: FONT_NUM, size: 11 }, callback: v => fmt(v, 0) }, yTicks || {}) }, (extra && extra.y) || {}) } },
      extra && extra.root);
  }
  function draw(id, type, labels, datasets, o) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart($(id), { type, data: { labels, datasets }, options: o, plugins: [markers] });
  }

  /* ── render ── */
  function render() {
    if (!st.series || !window.Chart) return;
    const S = st.series, cur = S[st.day - 1], labels = S.map(s => dayLab(s.date));
    const A = css('--dy-a'), B = css('--dy-b'), As = css('--dy-a-soft'), Bs = css('--dy-b-soft'), acc = css('--accent'), good = css('--success'), faint = css('--ink-faint');
    const lvl = Math.round((1 - st.alpha) * 100), sig = cur.p !== null && cur.p < st.alpha, early = st.day < st.plan, srmBad = cur.srmP < 0.001;
    const ci = cur.lo === null ? '' : L('dy_ci', { lvl, lo: sign(cur.lo), hi: sign(cur.hi) });

    renderVerdict(cur, sig, early, ci);
    const pChip = cur.p === null ? `<span class="dy-chip neutral">${L('dy_ch_few')}</span>`
      : early ? `<span class="dy-chip ${sig ? 'warn' : 'neutral'}">${L(sig ? 'dy_ch_early_sig' : 'dy_ch_nsig')}</span>`
      : `<span class="dy-chip ${sig ? 'good' : 'neutral'}">${L(sig ? 'dy_ch_sig' : 'dy_ch_nsig')}</span>`;
    $('dy-kpis').innerHTML = `
      <div class="dy-kpi"><div class="dy-kpi-l">${L('dy_k_users')}</div><div class="dy-kpi-v">${fmt(cur.cA.n + cur.cB.n)}</div>
        <div class="dy-kpi-s"><span class="dy-dot a"></span>${fmt(cur.cA.n)} · <span class="dy-dot b"></span>${fmt(cur.cB.n)}</div>
        <span class="dy-chip ${srmBad ? 'bad' : 'good'}">${L(srmBad ? 'dy_ch_srm_bad' : 'dy_ch_srm_ok')}</span></div>
      <div class="dy-kpi"><div class="dy-kpi-l">${L('dy_k_mean')}</div><div class="dy-kpi-v"><span class="dy-dot a"></span>${fmt(cur.cA.mean, 1)}</div>
        <div class="dy-kpi-s"><span class="dy-dot b"></span>${L('dy_k_mean_s', { v: fmt(cur.cB.mean, 1), g: esc(st.test) })}</div></div>
      <div class="dy-kpi"><div class="dy-kpi-l">${L('dy_k_lift', { t: esc(st.test), c: esc(st.ctrl) })}</div>
        <div class="dy-kpi-v${cur.lift > 0 && sig ? ' up' : ''}">${cur.lift === null ? '—' : sign(cur.lift)}</div>
        <div class="dy-kpi-s">${cur.lo === null ? '' : L('dy_k_ci', { lvl, lo: sign(cur.lo), hi: sign(cur.hi) })}</div></div>
      <div class="dy-kpi"><div class="dy-kpi-l">${L('dy_k_p', { d: st.day, p: st.plan })}</div><div class="dy-kpi-v">${cur.p === null ? '—' : fmtP(cur.p)}</div>
        <div class="dy-kpi-s">α = ${fmt(st.alpha, 2)}</div>${pChip}</div>`;
    $('dy-day-lab').textContent = L('dy_day', { d: st.day, date: labels[st.day - 1] });
    $('dy-srm').className = 'dy-chip ' + (srmBad ? 'bad' : 'good');
    $('dy-srm').textContent = L('dy_srm', { p: fmtP(cur.srmP) });
    $('dy-c2-sub').textContent = L('dy_c2_sub', { t: st.test, c: st.ctrl, lvl });
    $('dy-lgA').textContent = L('dy_lg_a', { g: st.ctrl }); $('dy-lgB').textContent = L('dy_lg_b', { g: st.test });
    const cum = st.mode === 'cum';
    $('dy-c1-sub').textContent = L(cum ? 'dy_c1_sub_cum' : 'dy_c1_sub_daily');

    draw('dy-c1', 'line', labels, [
      { data: S.map(s => cum ? s.cA.mean : s.dA), borderColor: A, backgroundColor: A, pointRadius: 2.5, borderWidth: 2, tension: 0.25 },
      { data: S.map(s => cum ? s.cB.mean : s.dB), borderColor: B, backgroundColor: B, pointRadius: 2.5, borderWidth: 2, tension: 0.25 }],
      opts({ root: { plugins: { legend: { display: false }, dyMarkers: { weekends: !cum },
        tooltip: { callbacks: { label: c => ` ${c.datasetIndex ? st.test : st.ctrl}: ${fmt(c.parsed.y, 1)}` } } } } }));
    draw('dy-c2', 'line', labels, [
      { data: S.map(s => s.hi), borderColor: 'transparent', pointRadius: 0, fill: false },
      { data: S.map(s => s.lo), borderColor: 'transparent', backgroundColor: Bs, pointRadius: 0, fill: '-1' },
      { data: S.map(s => s.lift), borderColor: B, backgroundColor: B, pointRadius: 2, borderWidth: 2, tension: 0.25 },
      { data: S.map(() => 0), borderColor: faint, borderDash: [4, 4], borderWidth: 1, pointRadius: 0 }],
      opts({ root: { plugins: { legend: { display: false }, dyMarkers: {},
        tooltip: { filter: i => i.datasetIndex === 2, callbacks: { label: c => { const s = S[c.dataIndex]; return ` ${sign(s.lift)}  (${sign(s.lo)} … ${sign(s.hi)})`; } } } } } },
        { callback: v => sign(v, 0) }));
    draw('dy-c3', 'line', labels, [
      { data: S.map(s => s.p === null ? null : Math.max(s.p, 1e-4)), borderColor: acc, backgroundColor: S.map(s => s.p !== null && s.p < st.alpha ? good : acc),
        pointRadius: S.map(s => s.p !== null && s.p < st.alpha ? 3.5 : 2.5), borderWidth: 2, tension: 0.2 },
      { data: S.map(() => st.alpha), borderColor: good, borderDash: [5, 4], borderWidth: 1.2, pointRadius: 0 }],
      opts({ y: { type: 'logarithmic', min: 1e-4, max: 1 }, root: { plugins: { legend: { display: false }, dyMarkers: { plan: true },
        tooltip: { filter: i => i.datasetIndex === 0, callbacks: { label: c => ` p = ${fmtP(S[c.dataIndex].p)}` } } } } },
        { callback: v => { const k = +(+v).toPrecision(1); return [1, 0.1, 0.01, 0.001, 0.0001].includes(k) && Math.abs(v - k) < 1e-12 ? fmt(k, Math.max(0, -Math.floor(Math.log10(k)))) : ''; } }));
    draw('dy-c4', 'bar', labels, [
      { data: S.map(s => s.nA), backgroundColor: As, borderColor: A, borderWidth: 1 }, { data: S.map(s => s.nB), backgroundColor: Bs, borderColor: B, borderWidth: 1 }],
      opts({ root: { plugins: { legend: { display: false }, dyMarkers: {},
        tooltip: { callbacks: { label: c => ` ${c.datasetIndex ? st.test : st.ctrl}: ${fmt(c.parsed.y)}` } } } } }));
    renderTable();
  }
  function renderVerdict(cur, sig, early, ci) {
    const S = st.series, last = Math.min(st.plan, S.length) - 1;
    const interim = S.slice(0, Math.max(0, last)).filter(s => s.p !== null && s.p < st.alpha);
    const v = { t: esc(st.test), c: esc(st.ctrl), d: st.day, p: st.plan, pv: cur.p === null ? '' : fmtP(cur.p),
      lift: cur.lift === null ? '' : sign(cur.lift), ci, a: fmt(st.alpha, 2), left: st.plan - st.day };
    let cls = 'neutral', h, body;
    if (cur.p === null) { h = L('dy_v_few_h'); body = L('dy_v_few'); }
    else if (early) { cls = 'warn'; h = L('dy_v_early_h', v); body = L(sig ? 'dy_v_early_sig' : 'dy_v_early_ns', v); }
    else if (sig) { cls = 'good'; h = L(cur.lift > 0 ? 'dy_v_win_h' : 'dy_v_lose_h', v); body = L('dy_v_sig', v); }
    else { h = L('dy_v_ns_h'); body = L('dy_v_ns', v); }
    let peek = '';
    if (interim.length && !early) peek = `<p class="dy-peek">${L('dy_v_peek', { k: interim.length, m: last, d1: interim[0].i + 1, l1: sign(interim[0].lift), lift: v.lift })}</p>`;
    const el = $('dy-verdict');
    el.className = 'dy-verdict ' + cls;
    el.innerHTML = `<div class="dy-verdict-k">${L('dy_v_kicker', { d: st.day, p: st.plan })}</div><h3>${h}</h3><p>${body}</p>${peek}`;
  }
  function renderTable() {
    const S = st.series;
    $('dy-tbl').innerHTML = `<thead><tr><th>${L('dy_t_date')}</th><th>${L('dy_t_users', { g: esc(st.ctrl) })}</th><th>${L('dy_t_users', { g: esc(st.test) })}</th>` +
      `<th>${L('dy_t_mean', { g: esc(st.ctrl) })}</th><th>${L('dy_t_mean', { g: esc(st.test) })}</th><th>${L('dy_t_lift')}</th><th>p-value</th></tr></thead><tbody>` +
      S.map(s => `<tr class="${s.i === st.day - 1 ? 'sel' : ''}${isWeekend(s.date) ? ' wk' : ''}"><td>${dayLab(s.date)}</td><td>${fmt(s.nA)}</td><td>${fmt(s.nB)}</td>` +
        `<td>${s.dA === null ? '—' : fmt(s.dA, 1)}</td><td>${s.dB === null ? '—' : fmt(s.dB, 1)}</td><td>${s.lift === null ? '—' : sign(s.lift)}</td>` +
        `<td class="${s.p !== null && s.p < st.alpha ? 'sig' : ''}">${s.p === null ? '—' : fmtP(s.p)}</td></tr>`).join('') + '</tbody>';
  }
  function renderSource() {
    const a = st.agg; if (!a) return;
    $('dy-src').textContent = st.isSample ? L('dy_src_sample') : st.file;
    $('dy-meta').textContent = L(a.mode === 'users' ? 'dy_meta_users' : 'dy_meta_agg', { days: a.days.size, rows: fmt(a.rows) }) + (a.bad ? L('dy_meta_bad', { n: fmt(a.bad) }) : '');
    $('dy-groups').innerHTML = L('dy_groups', { c: `<b>${esc(st.ctrl)}</b>`, t: `<b>${esc(st.test)}</b>` });
  }

  /* ── loading ── */
  function useTable(table, file, isSample) {
    const parsed = parseTable(table);
    st.agg = parsed; st.file = file; st.isSample = isSample;
    [st.ctrl, st.test] = pickControl(parsed.groups);
    st.plan = isSample ? 21 : parsed.days.size; $('dy-plan').value = st.plan;
    recompute(true);
  }
  function loadSample() {
    st.rows = st.rows || generateSample();
    useTable([['date', 'user_id', 'group', 'revenue'], ...st.rows], null, true);
    $('dy-reset').hidden = true; $('dy-err').hidden = true;
  }
  function recompute(toLast) {
    st.series = buildSeries();
    const D = st.series.length; $('dy-day').max = D;
    if (toLast || st.day > D) st.day = D; $('dy-day').value = st.day;
    renderSource(); render();
  }
  function setDay(d) { st.day = Math.max(1, Math.min(st.series.length, d)); $('dy-day').value = st.day; render(); }
  function stop() { if (st.timer) { clearInterval(st.timer); st.timer = null; $('dy-play').textContent = '▶'; } }
  function showError(msg) { const e = $('dy-err'); e.hidden = false; e.textContent = msg; }

  /* ── view switch: "Dynamics by day" (default, prefilled) or "Final totals" ── */
  const VIEW_KEY = 'abcalc-analyse-view';
  let built = false;
  function ensure() {
    const tab = $('tab-analyse');
    if (!tab || !tab.classList.contains('active') || !tab.classList.contains('dy-daily')) return;
    loadChart().then(() => {
      if (!built) { built = true; Chart.defaults.locale = loc(); loadSample(); } else render();
    }).catch(() => showError(L('dy_e_chart')));
  }
  function setView(v) {
    const tab = $('tab-analyse'); if (!tab) return;
    tab.classList.toggle('dy-daily', v === 'daily');
    document.querySelectorAll('[data-dy-view]').forEach(b => b.classList.toggle('on', b.dataset.dyView === v));
    try { localStorage.setItem(VIEW_KEY, v); } catch (e) {}
    if (v === 'daily') ensure(); else stop();
  }
  document.querySelectorAll('[data-dy-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.dyView)));
  try { if (localStorage.getItem(VIEW_KEY) === 'classic') setView('classic'); } catch (e) {}
  // build the dashboard whenever the Analyse tab is shown (tab buttons, bottom bar, shared ?tab=analyse links)
  if (typeof showTab === 'function') {
    const prevShow = showTab;
    showTab = function (name, btn) { prevShow(name, btn); if (name === 'analyse') ensure(); };
  }
  const boot = () => { ensure(); const idle = window.requestIdleCallback || (f => setTimeout(f, 1500)); idle(() => loadChart().catch(() => {})); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 0)); else setTimeout(boot, 0);

  /* ── controls ── */
  $('dy-day').addEventListener('input', e => { stop(); setDay(+e.target.value); });
  $('dy-play').addEventListener('click', () => {
    if (st.timer) return stop();
    if (st.day >= st.series.length) setDay(1);
    $('dy-play').textContent = '❚❚';
    st.timer = setInterval(() => { if (st.day >= st.series.length) return stop(); setDay(st.day + 1); }, 420);
  });
  document.querySelectorAll('[data-dy-alpha]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-dy-alpha]').forEach(x => x.classList.toggle('on', x === b)); st.alpha = +b.dataset.dyAlpha; if (st.agg) recompute(false); }));
  document.querySelectorAll('[data-dy-mode]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-dy-mode]').forEach(x => x.classList.toggle('on', x === b)); st.mode = b.dataset.dyMode; render(); }));
  $('dy-plan').addEventListener('change', e => { const v = Math.round(+e.target.value); st.plan = v >= 1 ? v : 1; e.target.value = st.plan; render(); });
  $('dy-swap').addEventListener('click', () => { if (!st.agg) return; [st.ctrl, st.test] = [st.test, st.ctrl]; recompute(false); });
  $('dy-reset').addEventListener('click', () => { stop(); loadSample(); });
  $('dy-file').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return; stop();
    const rd = new FileReader(), xls = /\.xlsx?$/i.test(f.name);
    rd.onload = () => {
      try {
        let table;
        if (xls) {
          if (typeof XLSX === 'undefined') throw new UserError(L('dy_e_xlsx'));
          const wb = XLSX.read(rd.result, { type: 'array', cellDates: true });
          table = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: true, defval: '' });
        } else {
          const text = rd.result.replace(/^﻿/, ''), first = text.split(/\r?\n/)[0];
          const sep = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : (first.includes('\t') ? '\t' : ',');
          table = text.split(/\r?\n/).filter(l => l.trim()).map(l => l.split(sep).map(c => c.replace(/^"|"$/g, '')));
        }
        useTable(table, f.name, false);
        $('dy-err').hidden = true; $('dy-reset').hidden = false; $('dy-dl-note').hidden = true;
      } catch (ex) { showError(L('dy_e_read', { f: f.name, m: ex.message })); }
      e.target.value = '';
    };
    rd.onerror = () => showError(L('dy_e_read', { f: f.name, m: L('dy_e_file') }));
    if (xls) rd.readAsArrayBuffer(f); else rd.readAsText(f);
  });
  $('dy-dl').addEventListener('click', () => {
    st.rows = st.rows || generateSample();
    const csv = sampleCSV(st.rows), blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ab_test_daily_sample.csv';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    const n = $('dy-dl-note'); n.hidden = false; n.textContent = L('dy_dl_note', { n: fmt(st.rows.length), mb: fmt(csv.length / 1048576, 1) });
  });

  /* re-render on language and theme switches */
  if (typeof applyLang === 'function') {
    const prev = applyLang;
    applyLang = function (lang) { prev(lang); if (window.Chart) Chart.defaults.locale = loc(); if (st.agg) { renderSource(); render(); } };
  }
  new MutationObserver(() => { if (st.agg) render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // test hooks (used by the site's own checks)
  window.__dySeries = () => st.series;
  window.__dySampleCSV = () => sampleCSV(st.rows || generateSample());
})();
