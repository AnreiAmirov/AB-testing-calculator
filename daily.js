/* daily.js — вкладка «Анализ результатов»: дашборд по дням (по умолчанию) с выбором метрики, α и гипотезы в правой панели.
   Среднее на пользователя — t-тест Уэлча (графики по дням), конверсия — Z-тест для долей (интервалы). Chart.js грузится лениво.
   Statistics come from stats.js (welchT, twoPropZTest, normCDF, normInvCDF) — the same functions as "Final totals". */
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
    value: ['revenue', 'value', 'metric', 'amount', 'converted', 'conversion', 'значение', 'выручка', 'метрика', 'конверсия'],
    users: ['users', 'n', 'count', 'exposed', 'пользователи', 'пользователей'], mean: ['mean', 'avg', 'average', 'среднее'],
    sd: ['sd', 'std', 'stdev', 'std_dev', 'отклонение'], conv: ['conversions', 'converted_users', 'buyers', 'конверсии', 'покупатели'] };
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
    const iV = findCol(head, H.value), iN = findCol(head, H.users), iM = findCol(head, H.mean), iS = findCol(head, H.sd), iK = findCol(head, H.conv);
    const days = new Map(); let bad = 0, rows = 0;
    // n users, s sum, q sum of squares, k users with a value above zero (= converted)
    const cell = (d, g) => { if (!days.has(d)) days.set(d, {}); const o = days.get(d); return o[g] || (o[g] = { n: 0, s: 0, q: 0, k: 0 }); };
    let hasMean = true, hasConv = true;
    if (iV >= 0) {
      for (const r of body) { const d = toISO(r[iD]), g = String(r[iG]).trim(), v = num(r[iV]);
        if (!d || !g || !isFinite(v)) { bad++; continue; } const c = cell(d, g); c.n++; c.s += v; c.q += v * v; c.k += v > 0 ? 1 : 0; rows++; }
    } else if (iN >= 0 && ((iM >= 0 && iS >= 0) || iK >= 0)) {
      hasMean = iM >= 0 && iS >= 0; hasConv = iK >= 0;
      for (const r of body) { const d = toISO(r[iD]), g = String(r[iG]).trim(), n = num(r[iN]);
        const m = hasMean ? num(r[iM]) : 0, sd = hasMean ? num(r[iS]) : 0, k = hasConv ? num(r[iK]) : 0;
        if (!d || !g || !(n > 1) || !isFinite(m) || !isFinite(sd) || !isFinite(k) || k < 0 || k > n) { bad++; continue; }
        const c = cell(d, g); c.n += n; c.s += n * m; c.q += (n - 1) * sd * sd + n * m * m; c.k += k; rows++; }
    } else throw new UserError(L('dy_e_val'));
    const groups = [...new Set([...days.values()].flatMap(o => Object.keys(o)))];
    if (groups.length !== 2) throw new UserError(L('dy_e_groups', { k: groups.length, g: groups.slice(0, 5).join(', ') }));
    return { days, groups, rows, bad, mode: iV >= 0 ? 'users' : 'agg', hasMean, hasConv };
  }
  function pickControl(groups) {
    const names = ['a', 'control', 'контроль', 'ctrl', 'c'];
    const c = groups.find(g => names.includes(g.toLowerCase())) || [...groups].sort()[0];
    return [c, groups.find(g => g !== c)];
  }

  /* ── state & series ── */
  const st = { agg: null, file: null, isSample: true, rows: null, ctrl: null, test: null, alpha: 0.05, tails: 2, metric: 'mean',
    plan: 21, day: 21, mode: 'daily', series: null, timer: null };
  const isConv = () => st.metric === 'conv';
  // one-sided test (H1: test > control) is matched by the (1 − 2α) two-sided interval: its lower end is the one-sided bound
  const ciLevel = () => Math.round((1 - st.alpha * (3 - st.tails)) * 100);
  function buildSeries() {
    const { days } = st.agg, A = st.ctrl, B = st.test, dates = [...days.keys()].sort();
    const zero = () => ({ n: 0, s: 0, q: 0, k: 0 }), acc = { A: zero(), B: zero() }, z = normInvCDF(1 - st.alpha / st.tails);
    const add = (t, x) => { t.n += x.n; t.s += x.s; t.q += x.q; t.k += x.k; };
    return dates.map((d, i) => {
      const o = days.get(d), a = o[A] || zero(), b = o[B] || zero();
      add(acc.A, a); add(acc.B, b);
      const s = g => { const x = acc[g], m = x.s / x.n; return { n: x.n, k: x.k, mean: m, cr: x.k / x.n,
        sd: Math.sqrt(Math.max(0, (x.q - x.n * m * m) / (x.n - 1))) }; };
      const cA = s('A'), cB = s('B'), N = cA.n + cB.n;
      const srmP = 2 * (1 - normCDF(Math.abs((cB.n - N / 2) / Math.sqrt(N / 4))));
      // mean per user — Welch's t-test
      const okM = cA.n > 1 && cB.n > 1 && cA.sd > 0 && cB.sd > 0 && cA.mean !== 0;
      const w = okM ? welchT(cA, cB, st.tails) : null, dM = cB.mean - cA.mean;
      const m = { p: w ? w.p : null, lift: w ? w.liftPct : null, stat: w ? w.t : null, se: w ? w.se : null,
        lo: w ? (dM - z * w.se) / cA.mean * 100 : null, hi: w ? (dM + z * w.se) / cA.mean * 100 : null,
        dA: a.n ? a.s / a.n : null, dB: b.n ? b.s / b.n : null, vA: cA.mean, vB: cB.mean };
      // conversion — Z-test for two proportions (same function as "Final totals")
      const okC = cA.n > 1 && cB.n > 1 && cA.k > 0 && cA.k < cA.n && cB.k > 0 && cB.k < cB.n;
      const zt = okC ? twoPropZTest({ n: cA.n, c: cA.k }, { n: cB.n, c: cB.k }, st.tails) : null, dC = cB.cr - cA.cr;
      const c = { p: zt ? zt.p : null, lift: zt ? zt.liftPct : null, stat: zt ? zt.z : null, se: zt ? zt.se : null,
        lo: zt ? (dC - z * zt.se) / cA.cr * 100 : null, hi: zt ? (dC + z * zt.se) / cA.cr * 100 : null,
        dA: a.n ? a.k / a.n * 100 : null, dB: b.n ? b.k / b.n * 100 : null, vA: cA.cr, vB: cB.cr, z };
      return { i, date: d, nA: a.n, nB: b.n, cA, cB, srmP, m, c };
    });
  }
  const pick = s => (isConv() ? s.c : s.m);

  /* ── charts (Chart.js, loaded lazily) ── */
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
    if (st.plan <= st.series.length) { const px = x.getPixelForValue(st.plan - 1); ctx.strokeStyle = css('--ink-faint');
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
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
    const el = $(id); if (!el || !el.offsetParent) return; // hidden view: drawn when shown
    charts[id] = new Chart(el, { type, data: { labels, datasets }, options: o, plugins: [markers] });
  }
  function liftChart(id, S, labels) {
    const B = css('--dy-b'), Bs = css('--dy-b-soft'), faint = css('--ink-faint');
    // the first two days have huge intervals: scale the axis to the rest so the later days stay readable (the band is clipped)
    const vals = S.slice(Math.min(2, S.length - 1)).flatMap(s => [pick(s).lo, pick(s).hi]).filter(v => v !== null && isFinite(v));
    let y = {};
    if (vals.length) { const lo = Math.min(0, ...vals), hi = Math.max(0, ...vals), step = hi - lo > 40 ? 10 : 5;
      y = { min: Math.floor((lo - 1e-9) / step) * step, max: Math.ceil((hi + 1e-9) / step) * step }; }
    draw(id, 'line', labels, [
      { data: S.map(s => pick(s).hi), borderColor: 'transparent', pointRadius: 0, fill: false },
      { data: S.map(s => pick(s).lo), borderColor: 'transparent', backgroundColor: Bs, pointRadius: 0, fill: '-1' },
      { data: S.map(s => pick(s).lift), borderColor: B, backgroundColor: B, pointRadius: 2, borderWidth: 2, tension: 0.25 },
      { data: S.map(() => 0), borderColor: faint, borderDash: [4, 4], borderWidth: 1, pointRadius: 0 }],
      opts({ y, root: { plugins: { legend: { display: false }, dyMarkers: { weekends: true },
        tooltip: { filter: i => i.datasetIndex === 2, callbacks: { label: c => { const s = pick(S[c.dataIndex]); return ` ${sign(s.lift)}  (${sign(s.lo)} … ${sign(s.hi)})`; } } } } } },
        { callback: v => sign(v, 0) }));
  }

  /* ── render ── */
  function render() {
    if (!st.series || !window.Chart) return;
    const S = st.series, cur = S[st.day - 1], M = pick(cur), labels = S.map(s => dayLab(s.date));
    const A = css('--dy-a'), B = css('--dy-b'), lvl = ciLevel();
    const sig = M.p !== null && M.p < st.alpha, early = st.day < st.plan;
    const ci = M.lo === null ? '' : L('dy_ci', { lvl, lo: sign(M.lo), hi: sign(M.hi) });
    renderVerdict(cur, M, sig, early, ci);
    renderPanel(cur);
    $('dy-view-t').hidden = isConv(); $('dy-view-z').hidden = !isConv();
    $('dy-day-lab').textContent = L('dy_day', { d: st.day, date: labels[st.day - 1] });
    $('dy-lgA').textContent = L('dy_lg_a', { g: st.ctrl }); $('dy-lgB').textContent = L('dy_lg_b', { g: st.test });
    const strip = S.map(s => { const P = pick(s).p, on = P !== null && P < st.alpha;
      return `<span class="dy-cell${on ? ' on' : ''}${s.i === st.day - 1 ? ' cur' : ''}" title="${esc(L('dy_strip_tip', { date: dayLab(s.date), p: P === null ? '—' : fmtP(P) }))}"></span>`; }).join('');
    document.querySelectorAll('.dy-strip').forEach(el => { el.style.gridTemplateColumns = `repeat(${S.length}, minmax(0, 1fr))`; el.innerHTML = strip; });
    if (!isConv()) {
      const cum = st.mode === 'cum';
      $('dy-c1-sub').textContent = L(cum ? 'dy_c1_sub_cum' : 'dy_c1_sub_daily');
      $('dy-c2-sub').textContent = L('dy_c2_sub', { t: st.test, c: st.ctrl, lvl });
      draw('dy-c1', 'line', labels, [
        { data: S.map(s => cum ? s.m.vA : s.m.dA), borderColor: A, backgroundColor: A, pointRadius: 2.5, borderWidth: 2, tension: 0.25 },
        { data: S.map(s => cum ? s.m.vB : s.m.dB), borderColor: B, backgroundColor: B, pointRadius: 2.5, borderWidth: 2, tension: 0.25 }],
        opts({ root: { plugins: { legend: { display: false }, dyMarkers: { weekends: true },
          tooltip: { callbacks: { label: c => ` ${c.datasetIndex ? st.test : st.ctrl}: ${fmt(c.parsed.y, 1)}` } } } } }));
      liftChart('dy-c2', S, labels);
      if (charts['dy-c3']) { charts['dy-c3'].destroy(); delete charts['dy-c3']; }
    } else {
      renderIntervals(cur, lvl);
      $('dy-c3-sub').textContent = L('dy_c2_sub', { t: st.test, c: st.ctrl, lvl });
      ['dy-c1', 'dy-c2'].forEach(id => { if (charts[id]) { charts[id].destroy(); delete charts[id]; } });
      if ($('dy-zdays').open) liftChart('dy-c3', S, labels);
    }
    renderRef(cur);
    renderTable();
  }
  const pctTxt = (v, d = 2) => fmt(v * 100, d) + '%';
  const valTxt = (v) => (isConv() ? pctTxt(v) : fmt(v, 1));
  function renderVerdict(cur, M, sig, early, ci) {
    const S = st.series, last = Math.min(st.plan, S.length) - 1;
    const interim = S.slice(0, Math.max(0, last)).filter(s => { const P = pick(s).p; return P !== null && P < st.alpha; });
    const v = { t: esc(st.test), c: esc(st.ctrl), d: st.day, p: st.plan, pv: M.p === null ? '' : fmtP(M.p),
      lift: M.lift === null ? '' : sign(M.lift), ci, a: fmt(st.alpha, 2), left: st.plan - st.day };
    let cls = 'neutral', h, body;
    if (M.p === null) { h = L('dy_v_few_h'); body = L('dy_v_few'); }
    else if (early) { cls = 'warn'; h = L('dy_v_early_h', v); body = L(sig ? 'dy_v_early_sig' : 'dy_v_early_ns', v); }
    else if (sig) { cls = 'good'; h = L(M.lift > 0 ? 'dy_v_win_h' : 'dy_v_lose_h', v); body = L('dy_v_sig', v); }
    else { h = L('dy_v_ns_h'); body = L('dy_v_ns', v); }
    const vals = M.p === null ? '' : `<p class="dy-vals">${L('dy_v_vals', { t: esc(st.test), c: esc(st.ctrl), vb: valTxt(M.vB), va: valTxt(M.vA) })}</p>`;
    let peek = '';
    if (interim.length && !early) peek = `<p class="dy-peek">${L('dy_v_peek', { k: interim.length, m: last, d1: interim[0].i + 1, l1: sign(pick(interim[0]).lift), lift: v.lift })}</p>`;
    const el = $('dy-verdict');
    el.className = 'dy-verdict ' + cls;
    el.innerHTML = `<div class="dy-verdict-k">${L('dy_v_kicker', { d: st.day, p: st.plan, m: L(isConv() ? 'dy_mt_z' : 'dy_mt_t') })}</div><h3>${h}</h3>${vals}<p>${body}</p>${peek}`;
  }
  function renderPanel(cur) {
    const a = st.agg, srmBad = cur.srmP < 0.001;
    document.querySelectorAll('[data-dy-metric]').forEach(b => {
      const m = b.dataset.dyMetric, na = (m === 'conv' && !a.hasConv) || (m === 'mean' && !a.hasMean);
      b.classList.toggle('on', m === st.metric); b.setAttribute('aria-pressed', String(m === st.metric)); b.disabled = na;
      const sub = b.querySelector('.dy-m-na'); if (sub) sub.hidden = !na;
    });
    document.querySelectorAll('[data-dy-alpha]').forEach(b => b.classList.toggle('on', +b.dataset.dyAlpha === st.alpha));
    document.querySelectorAll('[data-dy-tails]').forEach(b => b.classList.toggle('on', +b.dataset.dyTails === st.tails));
    $('dy-one').textContent = L('dy_one', { t: st.test, c: st.ctrl });
    const srm = $('dy-chk-srm'); srm.textContent = L(srmBad ? 'dy_bad' : 'dy_ok'); srm.className = srmBad ? 'bad' : 'good';
    srm.title = L('dy_srm', { p: fmtP(cur.srmP) });
    $('dy-chk-days').textContent = L('dy_of', { d: st.day, p: st.plan });
    $('dy-chk-users').textContent = fmt(cur.cA.n + cur.cB.n);
  }
  // Z-test view: dot = estimate, bar = CI, for each group and for the relative difference
  function niceTicks(lo, hi, n) {
    const raw = (hi - lo) / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(x => x * mag).find(x => x >= raw);
    const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
    return { ticks: out, step };
  }
  function scaleBox(lo, hi) {
    const pad = (hi - lo) * 0.12 || 1, t = niceTicks(lo - pad, hi + pad, 5);
    const a = Math.min(t.ticks[0], lo - pad), b = Math.max(t.ticks[t.ticks.length - 1], hi + pad);
    return { x: v => (v - a) / (b - a) * 100, ticks: t.ticks, step: t.step };
  }
  function renderIntervals(cur, lvl) {
    const z = cur.c.z, grp = x => { const s = Math.sqrt(x.cr * (1 - x.cr) / x.n) * z; return { p: x.cr * 100, lo: (x.cr - s) * 100, hi: (x.cr + s) * 100 }; };
    const gA = grp(cur.cA), gB = grp(cur.cB), sc = scaleBox(Math.min(gA.lo, gB.lo), Math.max(gA.hi, gB.hi));
    const dec = sc.step < 0.1 ? 2 : sc.step < 1 ? 1 : 0;
    const row = (name, cls, g, x) => `<div class="dy-iv-row"><div class="dy-iv-name"><b class="${cls}">${esc(name)}</b><span>${L('dy_z_n', { n: fmt(x.n), k: fmt(x.k) })}</span></div>
      <div class="dy-iv-track"><span class="dy-iv-bar ${cls}" style="left:${sc.x(g.lo)}%;width:${sc.x(g.hi) - sc.x(g.lo)}%"></span><span class="dy-iv-dot ${cls}" style="left:${sc.x(g.p)}%"></span></div>
      <div class="dy-iv-val"><b>${fmt(g.p, 2)}%</b> <span>[${fmt(g.lo, 2)}; ${fmt(g.hi, 2)}]</span></div></div>`;
    const axis = (s, f) => `<div class="dy-iv-row dy-iv-axis"><div></div><div class="dy-iv-ticks">${s.ticks.map(v => `<span style="left:${s.x(v)}%">${f(v)}</span>`).join('')}</div><div></div></div>`;
    const M = cur.c;
    let diff = '';
    if (M.p !== null) {
      const ds = scaleBox(Math.min(M.lo, 0), Math.max(M.hi, 0)), cls = M.p < st.alpha ? (M.lift > 0 ? 'good' : 'bad') : 'neutral';
      diff = `<div class="dy-iv-row dy-iv-diff"><div class="dy-iv-name"><b>${L('dy_z_diff', { t: esc(st.test), c: esc(st.ctrl) })}</b><span>${L('dy_z_rel')}</span></div>
        <div class="dy-iv-track"><span class="dy-iv-zero" style="left:${ds.x(0)}%"></span><span class="dy-iv-bar ${cls}" style="left:${ds.x(M.lo)}%;width:${ds.x(M.hi) - ds.x(M.lo)}%"></span><span class="dy-iv-dot ${cls}" style="left:${ds.x(M.lift)}%"></span></div>
        <div class="dy-iv-val"><b>${sign(M.lift)}</b> <span>[${sign(M.lo)}; ${sign(M.hi)}]</span></div></div>` + axis(ds, v => sign(v, ds.step < 1 ? 1 : 0));
    }
    $('dy-z-sub').textContent = L('dy_z_sub', { lvl, d: st.day });
    $('dy-iv').innerHTML = row(st.ctrl, 'a', gA, cur.cA) + row(st.test, 'b', gB, cur.cB) + axis(sc, v => fmt(v, dec) + '%') + diff;
  }
  function renderRef(cur) {
    const conv = isConv(), M = pick(cur);
    const h = conv ? [L('dy_r_k'), L('dy_r_cr')] : [L('dy_r_mean'), L('dy_r_sd')];
    const r = (g, x) => `<tr><td>${esc(g)}</td><td>${fmt(x.n)}</td><td>${conv ? fmt(x.k) : fmt(x.mean, 1)}</td><td>${conv ? pctTxt(x.cr) : fmt(x.sd, 1)}</td></tr>`;
    $('dy-ref-tbl').innerHTML = `<thead><tr><th>${L('dy_r_g')}</th><th>${L('dy_r_n')}</th><th>${h[0]}</th><th>${h[1]}</th></tr></thead><tbody>${r(st.ctrl, cur.cA)}${r(st.test, cur.cB)}</tbody>`;
    const stat = M.stat === null ? '' : L(conv ? 'dy_r_stat_z' : 'dy_r_stat_t', { s: fmt(M.stat, 2), se: conv ? fmt(M.se * 100, 3) : fmt(M.se, 2) });
    $('dy-ref-line').innerHTML = `<span>${L('dy_srm', { p: fmtP(cur.srmP) })}</span>${stat ? `<span>${stat}</span>` : ''}<span>${esc($('dy-meta').textContent)}</span>`;
  }
  function renderTable() {
    const S = st.series, conv = isConv(), col = conv ? 'dy_t_cr' : 'dy_t_mean';
    const d = (v) => v === null ? '—' : conv ? fmt(v, 2) + '%' : fmt(v, 1);
    $('dy-tbl').innerHTML = `<thead><tr><th>${L('dy_t_date')}</th><th>${L('dy_t_users', { g: esc(st.ctrl) })}</th><th>${L('dy_t_users', { g: esc(st.test) })}</th>` +
      `<th>${L(col, { g: esc(st.ctrl) })}</th><th>${L(col, { g: esc(st.test) })}</th><th>${L('dy_t_lift')}</th><th>p-value</th></tr></thead><tbody>` +
      S.map(s => { const M = pick(s); return `<tr class="${s.i === st.day - 1 ? 'sel' : ''}${isWeekend(s.date) ? ' wk' : ''}"><td>${dayLab(s.date)}</td><td>${fmt(s.nA)}</td><td>${fmt(s.nB)}</td>` +
        `<td>${d(M.dA)}</td><td>${d(M.dB)}</td><td>${M.lift === null ? '—' : sign(M.lift)}</td>` +
        `<td class="${M.p !== null && M.p < st.alpha ? 'sig' : ''}">${M.p === null ? '—' : fmtP(M.p)}</td></tr>`; }).join('') + '</tbody>';
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
    if (st.metric === 'conv' && !parsed.hasConv) st.metric = 'mean';
    if (st.metric === 'mean' && !parsed.hasMean) st.metric = 'conv';
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

  /* "Final totals": the metric choice moves into the right column, next to α and the hypothesis (wide screens) */
  const classicBtns = [...document.querySelectorAll('#tab-analyse .plan-metric-btn')];
  const classicCard = classicBtns.length ? classicBtns[0].closest('.card') : null;
  const classicHome = classicCard ? { parent: classicCard.parentNode, next: classicCard.nextSibling } : null;
  const wide = window.matchMedia('(min-width: 781px)');
  function placeClassic() {
    if (!classicCard) return;
    const sec = ['conversion', 'continuous', 'ratio'].map(k => $('analyse-section-' + k)).find(s => s && !s.classList.contains('hidden'));
    const target = sec && sec.querySelector('.analyse-main');
    if (wide.matches && target) { if (classicCard.parentNode !== target) target.insertBefore(classicCard, target.firstChild); classicCard.classList.add('dy-side-metric'); }
    else { if (classicCard.parentNode !== classicHome.parent) classicHome.parent.insertBefore(classicCard, classicHome.next); classicCard.classList.remove('dy-side-metric'); }
  }
  if (classicCard) {
    if (typeof selectAnalyseMetric === 'function') {
      const prevSel = selectAnalyseMetric;
      selectAnalyseMetric = function (type, btn) { prevSel(type, btn); placeClassic(); };
    }
    if (wide.addEventListener) wide.addEventListener('change', placeClassic);
    placeClassic();
  }
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
  document.querySelectorAll('[data-dy-metric]').forEach(b => b.addEventListener('click', () => {
    const m = b.dataset.dyMetric;
    if (m === 'ratio') { // ratio metrics need numerator and denominator per user: the "Final totals" form handles them
      stop(); setView('classic');
      const rb = classicBtns.find(x => (x.getAttribute('onclick') || '').includes("'ratio'"));
      if (rb && typeof selectAnalyseMetric === 'function') selectAnalyseMetric('ratio', rb);
      const tab = $('tab-analyse'); if (tab) tab.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }
    if (b.disabled || !st.agg) return; st.metric = m; render();
  }));
  document.querySelectorAll('[data-dy-alpha]').forEach(b => b.addEventListener('click', () => { st.alpha = +b.dataset.dyAlpha; if (st.agg) recompute(false); }));
  document.querySelectorAll('[data-dy-tails]').forEach(b => b.addEventListener('click', () => { st.tails = +b.dataset.dyTails; if (st.agg) recompute(false); }));
  document.querySelectorAll('[data-dy-mode]').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('[data-dy-mode]').forEach(x => x.classList.toggle('on', x === b)); st.mode = b.dataset.dyMode; render(); }));
  $('dy-zdays').addEventListener('toggle', () => { if (st.agg && $('dy-zdays').open) render(); });
  $('dy-plan').addEventListener('change', e => { const v = Math.round(+e.target.value); st.plan = v >= 1 ? v : 1; e.target.value = st.plan; render(); });
  $('dy-swap').addEventListener('click', () => { if (!st.agg) return; [st.ctrl, st.test] = [st.test, st.ctrl]; recompute(false); renderSource(); });
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
  window.__dyState = () => ({ metric: st.metric, alpha: st.alpha, tails: st.tails, day: st.day, plan: st.plan });
  window.__dySampleCSV = () => sampleCSV(st.rows || generateSample());
})();
