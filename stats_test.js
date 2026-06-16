/**
 * stats.test.js - Tests for stats.js (production functions)
 * Run with:  node stats.test.js
 */

const {
  normInvCDF, normCDF, normPDF, mean, variance,
  twoPropZTest, chiSquaredConversion, holmBonferroni, welchT
} = require('./stats.js');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log('  OK  ' + name); pass++; }
  catch(e) { console.log('  FAIL  ' + name + '\n     -> ' + e.message); fail++; }
}
function expect(actual) {
  return {
    toBeCloseTo(exp, dec=4) {
      const tol = 0.5 * Math.pow(10, -dec);
      if (Math.abs(actual - exp) > tol)
        throw new Error('Expected ~' + exp + ' (+/-' + tol + '), got ' + actual);
    },
    toBe(exp) { if (actual !== exp) throw new Error('Expected ' + exp + ', got ' + actual); },
    toBeGreaterThan(n) { if (actual <= n) throw new Error('Expected > ' + n + ', got ' + actual); },
    toBeLessThan(n)    { if (actual >= n) throw new Error('Expected < ' + n + ', got ' + actual); },
  };
}

// normCDF
console.log('\nnormCDF');
test('P(Z <= 0) = 0.5',            () => expect(normCDF(0)).toBeCloseTo(0.5, 4));
test('P(Z <= 1.96) ~= 0.975',      () => expect(normCDF(1.96)).toBeCloseTo(0.975, 3));
test('P(Z <= -1.96) ~= 0.025',     () => expect(normCDF(-1.96)).toBeCloseTo(0.025, 3));
test('P(Z <= 2.576) ~= 0.995',     () => expect(normCDF(2.576)).toBeCloseTo(0.995, 2));
test('P(Z <= 1.645) ~= 0.95',      () => expect(normCDF(1.645)).toBeCloseTo(0.95, 2));

// normInvCDF
console.log('\nnormInvCDF');
test('normInvCDF(0.975) ~= 1.96',  () => expect(normInvCDF(0.975)).toBeCloseTo(1.96, 2));
test('normInvCDF(0.5) = 0',        () => expect(normInvCDF(0.5)).toBeCloseTo(0, 4));
test('normInvCDF(0.8) ~= 0.842',   () => expect(normInvCDF(0.8)).toBeCloseTo(0.842, 2));
test('normInvCDF(0.025) ~= -1.96', () => expect(normInvCDF(0.025)).toBeCloseTo(-1.96, 2));
test('round-trip 1.5',             () => expect(normInvCDF(normCDF(1.5))).toBeCloseTo(1.5, 3));
test('round-trip 2.8',             () => expect(normInvCDF(normCDF(2.8))).toBeCloseTo(2.8, 2));

// normPDF
console.log('\nnormPDF');
test('normPDF(0,0,1) = 1/sqrt(2pi)', () => expect(normPDF(0,0,1)).toBeCloseTo(1/Math.sqrt(2*Math.PI), 4));
test('symmetric: f(x) = f(-x)',      () => expect(normPDF(1.5,0,1)).toBeCloseTo(normPDF(-1.5,0,1), 8));
test('peak at mu',                   () => expect(normPDF(5,5,1)).toBeCloseTo(normPDF(0,0,1), 8));
test('normPDF always >= 0',          () => { if (normPDF(-100,0,1) < 0) throw new Error('negative'); });

// mean / variance
console.log('\nmean / variance');
test('mean([1,2,3,4,5]) = 3',      () => expect(mean([1,2,3,4,5])).toBe(3));
test('mean of constants',          () => expect(mean([7,7,7,7])).toBe(7));
test('mean of [-1,0,1] = 0',       () => expect(mean([-1,0,1])).toBe(0));
test('variance([5,5,5]) = 0',      () => expect(variance([5,5,5])).toBe(0));
test('variance uses n-1',          () => expect(variance([2,4,4,4,5,5,7,9])).toBeCloseTo(4.571, 2));
test('variance([0,2]) = 2',        () => expect(variance([0,2])).toBe(2));

// Integration
console.log('\nIntegration: as used in the calculator');
test('Z-test sample size in range (p=5%, MDE=10%)', () => {
  const p1 = 0.05, p2 = 0.055;
  const za = normInvCDF(0.975), zb = normInvCDF(0.80);
  const pb = (p1+p2)/2;
  const n = Math.ceil((za*Math.sqrt(2*pb*(1-pb))+zb*Math.sqrt(p1*(1-p1)+p2*(1-p2)))**2/(p2-p1)**2);
  expect(n).toBeGreaterThan(10000);
  expect(n).toBeLessThan(50000);
});
test('Z-test: identical groups => p ~= 1.0', () => {
  const pPool=0.05, se=Math.sqrt(pPool*(1-pPool)*(2/1000));
  const pVal = 2*(1-normCDF(Math.abs(0/se)));
  expect(pVal).toBeCloseTo(1.0, 2);
});
test('Z-test: big difference => p < 0.001', () => {
  const pA=0.01, pB=0.03, nA=10000, nB=10000;
  const pp=(pA*nA+pB*nB)/(nA+nB), se=Math.sqrt(pp*(1-pp)*(1/nA+1/nB));
  const pVal=2*(1-normCDF(Math.abs((pB-pA)/se)));
  expect(pVal).toBeLessThan(0.001);
});
test('Welch: larger SD -> larger n', () => {
  const za=normInvCDF(0.975), zb=normInvCDF(0.8);
  const n=(sd)=>Math.ceil(2*((za+zb)*sd/5)**2);
  expect(n(30)).toBeGreaterThan(n(20));
});
test('CUPED 40% reduction -> ~40% fewer users', () => {
  const za=normInvCDF(0.975), zb=normInvCDF(0.8);
  const base  = Math.ceil(2*((za+zb)*30/10)**2);
  const cuped = Math.ceil(2*((za+zb)*(30*Math.sqrt(0.6))/10)**2);
  expect(1 - cuped/base).toBeGreaterThan(0.35);
});

// ───────────────────────────────────────────────────────────────────────────
// Critical analysis functions (verified against SciPy ground truth).
// These guard the exact formulas the Analyse tab uses for real decisions —
// including the multi-variant cases where bugs were previously found and fixed.
// ───────────────────────────────────────────────────────────────────────────

console.log('\nTwo-proportion Z-test (2-group conversion)');
test('A=200/2000 vs B=240/2000: z and p match SciPy', () => {
  const r = twoPropZTest({n:2000,c:200}, {n:2000,c:240});
  expect(r.z).toBeCloseTo(2.0224, 3);   // SciPy: 2.0224
  expect(r.p).toBeCloseTo(0.0431, 3);   // SciPy: 0.0431
});
test('identical groups => p ~= 1.0', () => {
  const r = twoPropZTest({n:5000,c:500}, {n:5000,c:500});
  expect(r.p).toBeCloseTo(1.0, 2);
});
test('large clear difference => p < 0.001', () => {
  const r = twoPropZTest({n:10000,c:100}, {n:10000,c:300});
  expect(r.p).toBeLessThan(0.001);
});
test('one-sided p is half of two-sided (same direction)', () => {
  const t2 = twoPropZTest({n:2000,c:200}, {n:2000,c:240}, 2);
  const t1 = twoPropZTest({n:2000,c:200}, {n:2000,c:240}, 1);
  expect(t1.p).toBeCloseTo(t2.p/2, 4);
});

console.log('\nChi-squared, multi-variant (the previously-buggy path)');
test('3 variants moderate (300/360/330): chi2 matches SciPy exactly', () => {
  const r = chiSquaredConversion([{n:10000,c:300},{n:10000,c:360},{n:10000,c:330}]);
  expect(r.chi2).toBeCloseTo(5.6407, 2);  // SciPy: 5.6407
  expect(r.df).toBe(2);
});
test('3 variants moderate: p is NOT significant (~0.058, regression guard)', () => {
  // The old bug reported p~0.004 here and falsely declared a winner.
  const r = chiSquaredConversion([{n:10000,c:300},{n:10000,c:360},{n:10000,c:330}]);
  expect(r.p).toBeGreaterThan(0.05);      // true p = 0.0596
  expect(r.p).toBeLessThan(0.07);
});
test('4 variants (150/180/165/140): chi2 matches SciPy, p not significant', () => {
  const r = chiSquaredConversion([{n:5000,c:150},{n:5000,c:180},{n:5000,c:165},{n:5000,c:140}]);
  expect(r.chi2).toBeCloseTo(5.9772, 2);  // SciPy: 5.9772
  expect(r.df).toBe(3);
  expect(r.p).toBeGreaterThan(0.05);      // true p = 0.1127
});
test('strong real difference (300/420/500): p clearly significant', () => {
  const r = chiSquaredConversion([{n:10000,c:300},{n:10000,c:420},{n:10000,c:500}]);
  expect(r.p).toBeLessThan(0.001);
});

console.log('\nHolm-Bonferroni step-down');
test('A=240,B=280,C=300 /1000: Holm flags BOTH B and C significant', () => {
  const r = holmBonferroni([{n:1000,c:240},{n:1000,c:280},{n:1000,c:300}], 0.05);
  const byIdx = Object.fromEntries(r.comparisons.map(c => [c.i, c]));
  // Plain Bonferroni (alpha/2 = 0.025) would miss B (p=0.041); Holm catches it.
  expect(byIdx[1].significant).toBe(true);   // B
  expect(byIdx[2].significant).toBe(true);   // C
});
test('best variant is C (highest significant rate)', () => {
  const r = holmBonferroni([{n:1000,c:240},{n:1000,c:280},{n:1000,c:300}], 0.05);
  expect(r.bestIdx).toBe(2);
});
test('Holm is more powerful than plain Bonferroni on B', () => {
  // B's raw p ~ 0.0412: fails plain Bonferroni (0.025) but passes Holm (relaxed 0.05 threshold)
  const r = holmBonferroni([{n:1000,c:240},{n:1000,c:280},{n:1000,c:300}], 0.05);
  const B = r.comparisons.find(c => c.i === 1);
  expect(B.p).toBeGreaterThan(0.025);   // would fail plain Bonferroni
  expect(B.significant).toBe(true);      // but Holm rejects it
});
test('no real effect => nothing significant', () => {
  const r = holmBonferroni([{n:20000,c:600},{n:20000,c:602},{n:20000,c:598}], 0.05);
  expect(r.comparisons.every(c => !c.significant)).toBe(true);
  expect(r.bestIdx).toBe(-1);
});

console.log("\nWelch's t-test (continuous)");
test('mean100/sd20 vs mean105/sd25, n=500: t, df, p match SciPy', () => {
  const r = welchT({n:500,mean:100,sd:20}, {n:500,mean:105,sd:25});
  expect(r.t).toBeCloseTo(3.4922, 2);   // SciPy: 3.4922
  expect(r.df).toBeCloseTo(952.1, 0);   // Welch-Satterthwaite
  expect(r.p).toBeLessThan(0.001);      // SciPy: 0.0005
});
test('identical means => p ~= 1.0', () => {
  const r = welchT({n:500,mean:100,sd:20}, {n:500,mean:100,sd:25});
  expect(r.p).toBeCloseTo(1.0, 2);
});
test('Welch df lies between min(nA,nB)-1 and nA+nB-2', () => {
  const r = welchT({n:300,mean:50,sd:10}, {n:200,mean:52,sd:18});
  expect(r.df).toBeGreaterThan(199);
  expect(r.df).toBeLessThan(498);
});

// Summary
const total = pass + fail;
console.log('\n' + '-'.repeat(50));
console.log('Results: ' + pass + ' passed, ' + fail + ' failed, ' + total + ' total');
if (fail === 0) { console.log('ALL TESTS PASSED\n'); process.exit(0); }
else            { console.log(fail + ' TEST(S) FAILED\n'); process.exit(1); }
