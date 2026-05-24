# A/B Testing Calculator

A self-contained, single-file A/B testing calculator that routes you to the **statistically correct test** based on what you’re actually measuring — not just the most convenient one.

Most public calculators only handle conversion rates. This one also implements the **delta method + Z-test** for ratio metrics (AOV, CTR per session) and **Welch’s t-test** for continuous per-user metrics (ARPU, session time), with visualisations that show you exactly what the data is saying.

**[→ Try it live](https://yourusername.github.io/ab-testing-calculator)**

> 📸 Replace the link above with your actual GitHub username once you’ve published it.  
> To add a screenshot: take one after running a test, save it as `screenshot.png` in the repo root, then replace this line with `![Calculator screenshot](screenshot.png)`.

-----

## ⚠️ Important: GitHub Pages setup

GitHub Pages only serves `index.html` as the homepage. If you uploaded the file as `AB_Testing_Calculator.html`, the site will appear blank.

**Fix in 3 steps:**

1. In your repo, click the file → click the pencil icon (Edit)
1. Rename it from `AB_Testing_Calculator.html` to `index.html`
1. Commit the change — the site will be live in ~2 minutes

Then go to **Settings → Pages** and confirm: Source = `Deploy from branch`, branch = `main`, folder = `/ (root)`.

-----

## Why this exists

The most common A/B testing mistake is applying a plain t-test to a ratio metric like average order value (AOV). AOV = revenue ÷ orders — and because users place different numbers of orders, pooling all orders and running a t-test treats each order as independent. They’re not. This understates the standard error by 2–10×, inflating the false-positive rate from the nominal 5% to 10–30%, as measured at major tech companies.

The correct approach is to use the **delta method** to compute the right variance at the user level, and then apply a standard Z-test on top. This calculator does that — and shows you side-by-side what the naive Z-statistic would have been vs the correct one, so the difference is impossible to miss.

-----

## Features

### Two modes

**Plan a test** — calculate the sample size you need before you start.  
**Analyse results** — paste in your results and get a clear verdict with confidence intervals and charts.

### Metric types supported

|Metric                                                 |Category                           |Test used                              |
|-------------------------------------------------------|-----------------------------------|---------------------------------------|
|Conversion rate, CTR, open rate, signup rate, retention|Proportion                         |Two-proportion Z-test                  |
|3+ variants on a conversion metric                     |Multi-arm proportion               |χ² omnibus + pairwise Z with Bonferroni|
|ARPU, session time per user, items in cart, LTV        |Continuous per-user                |Welch’s t-test                         |
|AOV, CTR per session, items per order                  |Ratio (denominator varies per user)|Delta method → Z-test                  |
|Skewed metrics, small n (< 200/arm)                    |Non-parametric                     |Mann–Whitney U                         |

### Visualisations

Every result includes at least one chart:

- **Sample size curve** — how required n scales with the MDE you target (log scale), with your current test marked
- **Bar chart with 95% CIs** — conversion rates or means per variant with confidence interval whiskers
- **Null distribution overlay** — plots the sampling distribution under H₀ with rejection zones, and marks your observed effect
- **Correct vs naive SE comparison** — side-by-side chart showing the delta-method SE vs the naive pooled SE, both feeding the same Z-test, so you can see how much the naive approach underestimates variance
- **Box plots** — for Mann–Whitney, shows medians, quartiles, and raw data points per arm

### Other things it does

- **Multi-variant support** — up to 7 variants (A through G) for conversion tests
- **CUPED variance reduction** — in sample-size mode, enter the expected variance reduction from a pre-period covariate (typical 30–50%) to see how it shrinks required n
- **Sample ratio mismatch check** — automatic χ² SRM test for two-variant conversion tests; alerts you if randomisation is broken before you trust the results
- **Pre-registered MDE check** — if you enter your pre-registered MDE, the verdict warns you when a result is significant but below the minimum meaningful effect size
- **“Help me choose” modal** — a two-question decision tree for anyone unsure which metric type they have
- **Reference tab** — the full metric → test table, formula reference, and the α / β / power dependency table

-----

## Getting started

### Option 1 — just open it locally

Download `index.html` and open it in any modern browser. No server, no build step, no dependencies.

```bash
git clone https://github.com/yourusername/ab-testing-calculator.git
open ab-testing-calculator/index.html
```

### Option 2 — publish on GitHub Pages (recommended)

1. Create a new **public** repository on GitHub
1. Upload the file and **rename it `index.html`** (this is required — see the setup note above)
1. Go to **Settings → Pages → Source: Deploy from branch → main → / (root) → Save**
1. Your URL: `https://yourusername.github.io/ab-testing-calculator`

### Option 3 — Netlify (30 seconds, no account needed)

Go to [netlify.com/drop](https://netlify.com/drop) and drag `index.html` onto the page. You get a live URL immediately. Create a free account to make it permanent.

### Option 4 — embed in your internal tools

The core statistical functions are self-contained and can be copied into any page:

```javascript
computeSampleSize()   // reads inputs, writes result to #size-results
computeTest()         // reads inputs, writes result to #test-results
normCdf(z)            // standard normal CDF
normInv(p)            // inverse normal CDF
chi2_cdf(x, df)       // chi-squared CDF
```

-----

## The statistics

### Two-proportion Z-test (conversion)

Used when each user has a binary outcome (converted / didn’t). The test statistic uses a pooled proportion under H₀:

```
n ≈ (z_α/2 + z_β)² · [p₁(1−p₁) + p₂(1−p₂)] / (p₂ − p₁)²

Z = (p̂_B − p̂_A) / √( p̄(1−p̄) · (1/n_A + 1/n_B) )
```

where `p̄ = (x_A + x_B) / (n_A + n_B)` is the pooled conversion rate.

-----

### Welch’s t-test (continuous per-user)

Used when each user contributes one numeric value (ARPU, session time, items in cart). Welch’s correctly handles unequal variances — always prefer it over Student’s t.

```
t = (x̄_B − x̄_A) / √(s_A²/n_A + s_B²/n_B)

df = (s_A²/n_A + s_B²/n_B)² / [ (s_A²/n_A)²/(n_A−1) + (s_B²/n_B)²/(n_B−1) ]
```

With **CUPED**: replace σ² with σ²·(1 − ρ²) in the sample-size formula, where ρ is the correlation between the post-period metric and a pre-period covariate. ρ = 0.62 gives 38% variance reduction — equivalent to running the test 38% faster.

-----

### Delta method + Z-test (ratio metrics)

**The delta method is a variance estimation technique, not a standalone test.** It computes the correct standard error for a ratio metric at the user level. A standard Z-test is then applied to that corrected SE — exactly as with any other two-arm comparison.

**The full flow for a ratio metric:**

1. **Aggregate to the user level.** Each user contributes one pair: X (numerator, e.g. revenue) and Y (denominator, e.g. number of orders).
1. **Compute the ratio per arm.** R = sum(X) / sum(Y). This is the same number you’d get from naive pooling — the point estimate is unaffected.
1. **Use the delta method to get the correct per-user variance of R:**

```
Var(R) ≈ (1/n) · [ Var(X)/Ȳ² − 2·X̄·Cov(X,Y)/Ȳ³ + X̄²·Var(Y)/Ȳ⁴ ]
```

where **n = number of users** (not orders or sessions), and X̄, Ȳ, Var(X), Var(Y), Cov(X,Y) are all computed across users.

1. **Apply the Z-test using the corrected SE:**

```
SE_lift = √( Var(R_A) + Var(R_B) )

Z = (R_B − R_A) / SE_lift
```

**Why naive fails:** Pooling all orders and running a t-test assumes each order is independent. Two orders from the same user are not — they’re correlated in both value and count. The naive SE treats the total number of orders as the effective sample size, understating the true SE by 2–10×. The delta method restores the correct sample size unit (users) through the Taylor linearisation of the ratio function.

-----

### Mann–Whitney U (non-parametric)

Used for heavily skewed metrics or small samples (n < 200 per arm) where the CLT is unreliable. Tests **stochastic dominance**, not mean equality — report medians as the natural summary.

```
z = (U − n_A·n_B/2 + 0.5·sign(n_A·n_B/2 − U)) / √(n_A·n_B·(n_A+n_B+1)/12)
```

-----

## Verified examples

All calculations verified against reference case studies.

**Case 1 — Checkout conversion (Z-test)**

|                 |Value                        |
|-----------------|-----------------------------|
|Control          |4.80% — 5,856 / 122,000 users|
|Variant          |5.15% — 6,283 / 122,000 users|
|Expected Z (book)|≈ 4.0                        |
|Calculator output|Z = 3.976, p < 0.001 ✓       |

**Case 3 — Average order value (delta method + Z-test)**

The same data analysed with a naive pooled t-test gives Z ≈ 4.8 (p < 0.001). The delta method — computing variance at the user level and then applying the Z-test — gives Z = 2.1 (p = 0.036). The naive analysis overstated significance by more than 2×. The lift estimate ($0.92) is identical in both cases; only the standard error changes.

-----

## Technical details

|Property       |Value                                                                                                                                      |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------|
|File size      |~90 KB                                                                                                                                     |
|Dependencies   |None                                                                                                                                       |
|Framework      |None — vanilla HTML, CSS, JavaScript                                                                                                       |
|Charts         |Inline SVG, drawn at runtime                                                                                                               |
|Stats          |Abramowitz–Stegun (normCdf), Beasley–Springer–Moro (normInv), Wilson–Hilferty (chi2_cdf)                                                   |
|Browser support|Chrome, Safari, Firefox, Edge (all modern versions)                                                                                        |
|Mobile         |Optimised for iPhone and desktop — 44px touch targets, 16px inputs (prevents iOS zoom), responsive layout with auto-scroll on metric switch|
|Privacy        |No data leaves your device. No analytics, no tracking, no external requests. Works fully offline.                                          |

-----

## Known limitations

- **Delta method needs pre-computed user-level stats** — you must supply mean(X), mean(Y), SD(X), SD(Y), and Cov(X, Y) per arm. The calculator cannot derive these from raw event logs.
- **Mann–Whitney uses a normal approximation** — valid for n > 8 per arm. For very small samples use exact tables.
- **CUPED reduction is an input, not computed** — enter your actual pre-period correlation ρ; the calculator uses ρ² as the variance reduction factor.
- **Sequential testing is not supported** — p-values assume you ran the full pre-planned n. If you’re peeking mid-test, use mSPRT or α-spending instead.
- **No switchback / paired t-test** — for marketplace experiments with user-level interference, use a paired design externally.

-----

## Contributing

Contributions welcome. The most useful additions would be:

- **Bootstrap CI** for the delta method (more accurate for small n or very skewed denominators)
- **Sequential testing mode** with mSPRT or α-spending boundaries
- **Paired t-test** for switchback / pre-post designs
- **Sample size calculator for Mann–Whitney**
- **CSV / clipboard import** for raw user-level data

To contribute:

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/yourusername/ab-testing-calculator.git
# Make changes to index.html — there is no build step
# Test in Chrome and Safari before submitting
```

Open a pull request with a short description of what you changed and why.

-----

## Related resources

This calculator was built alongside a bilingual practical guide — *A/B Testing in Practice* (English and Russian). The guide covers the full theory behind every test in this calculator, including:

- Core theory: hypotheses, α, p-value, power, CLT
- MDE — what it means, how to choose it, and why picking it wrong wastes traffic
- Type I and Type II errors and every lever that affects them (with the full dependency table)
- Which test to use by metric type — four realistic analyst-PM case studies
- CUPED deep dive — the math, a 5-step recipe, common pitfalls, and Python implementation
- Delta method deep dive — the Taylor linearisation, why naive analysis fails, and Python implementation

-----

## Licence

MIT — use it, fork it, ship it. Just keep the copyright notice.

```
Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```