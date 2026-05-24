# A/B Testing Calculator

A self-contained, single-file A/B testing calculator that routes you to the **statistically correct test** based on what you’re actually measuring — not just the most convenient one.

Most public calculators only handle conversion rates. This one also implements the **delta method** for ratio metrics (AOV, CTR per session) and **Welch’s t-test** for continuous per-user metrics (ARPU, session time), with visualisations that show you exactly what the data is saying.

**[→ Try it live](https://yourusername.github.io/ab-testing-calculator)**

![Screenshot of the calculator showing a conversion rate analysis with a bar chart and null distribution overlay](.github/screenshot.png)

-----

## Why this exists

The most common A/B testing mistake is applying a t-test to a ratio metric like average order value (AOV). AOV = revenue / orders — and because users place different numbers of orders, the naive analysis treats every order as independent. They’re not. This inflates the false-positive rate from the nominal 5% to 10–30%, measured at real companies.

This calculator implements the **delta method** for those cases, and shows you side-by-side what the naive Z-statistic would have been vs the correct one — so the difference is impossible to miss.

-----

## Features

### Two modes

**Plan a test** — calculate the sample size you need before you start.  
**Analyse results** — paste in your results and get a verdict with confidence intervals and charts.

### Metric types supported

|Metric                                                 |Category                  |Test used                              |
|-------------------------------------------------------|--------------------------|---------------------------------------|
|Conversion rate, CTR, open rate, signup rate, retention|Proportion                |Two-proportion Z-test                  |
|3+ variants on a conversion metric                     |Multi-arm proportion      |χ² omnibus + pairwise Z with Bonferroni|
|ARPU, session time per user, items in cart, LTV        |Continuous per-user       |Welch’s t-test                         |
|AOV, CTR per session, items per order                  |Ratio (denominator varies)|Delta method                           |
|Skewed metrics, small n (< 200/arm)                    |Non-parametric            |Mann–Whitney U                         |

### Visualisations

Every result includes at least one chart:

- **Sample size curve** — how required n scales with the MDE you target (log scale), with your current test marked
- **Bar chart with 95% CIs** — conversion rates or means per variant with confidence interval whiskers
- **Null distribution overlay** — plots the sampling distribution under H₀ with rejection regions, and marks your observed effect
- **Delta vs naive comparison** — side-by-side bar chart of the correct Z-statistic vs what a naive pooled analysis would have given
- **Box plots** — for Mann–Whitney, shows medians, quartiles, and raw data points per arm

### Other things it does

- **Multi-variant support** — up to 7 variants (A through G) for conversion tests
- **CUPED variance reduction** — in sample-size mode, a slider lets you model the reduction from a pre-period covariate (typical 30–50%)
- **Sample ratio mismatch check** — automatic χ² SRM test for two-variant conversion tests; alerts you before you trust the result
- **Pre-registered MDE check** — if you enter your pre-registered MDE, the verdict warns you when a result is significant but below the minimum meaningful effect
- **“Help me choose” modal** — a two-question decision tree for anyone unsure which metric type they have
- **Reference tab** — the full metric → test table, formula reference, and the α/β/power dependency table

-----

## Getting started

### Option 1 — just open it

Download `index.html` and open it in any modern browser. No server, no build step, no dependencies.

```bash
git clone https://github.com/yourusername/ab-testing-calculator.git
open ab-testing-calculator/index.html
```

### Option 2 — host it yourself

Because it’s a single HTML file, any static hosting works:

```bash
# GitHub Pages — push to main, enable Pages in repo settings
# Netlify — drag and drop the file at netlify.com/drop
# Vercel — `npx vercel` in the folder
# Any web server — copy the file to your server's document root
```

### Option 3 — embed in your internal tools

Copy the `<script>` block and the stats helper functions into your own page. The core functions are:

```javascript
computeSampleSize()   // reads inputs, writes to #size-results
computeTest()         // reads inputs, writes to #test-results
normCdf(z)            // standard normal CDF
normInv(p)            // inverse normal CDF
chi2_cdf(x, df)       // chi-squared CDF
```

-----

## The statistics

### Two-proportion Z-test (conversion)

Used when each user has a binary outcome (converted / didn’t convert).

```
n ≈ (z_α/2 + z_β)² · [p₁(1−p₁) + p₂(1−p₂)] / (p₂ − p₁)²

Z = (p̂_B − p̂_A) / √(p̄(1−p̄)(1/n_A + 1/n_B))
```

where `p̄` is the pooled proportion under H₀.

### Welch’s t-test (continuous per-user)

Used when each user contributes one numeric value. Welch’s handles unequal variances — always prefer it over Student’s t.

```
t = (x̄_B − x̄_A) / √(s_A²/n_A + s_B²/n_B)

df = (s_A²/n_A + s_B²/n_B)² / [(s_A²/n_A)²/(n_A−1) + (s_B²/n_B)²/(n_B−1)]
```

With CUPED variance reduction, replace σ² with σ²·(1 − ρ²) in the sample-size formula, where ρ is the correlation between post-period metric and pre-period covariate.

### Delta method (ratio metrics)

Used when the metric is a ratio of two random quantities per user (e.g. AOV = revenue/orders, where users have different numbers of orders).

The per-user variance of the ratio R = mean(X) / mean(Y):

```
Var(R) ≈ (1/n) · [Var(X)/Ȳ² − 2·X̄·Cov(X,Y)/Ȳ³ + X̄²·Var(Y)/Ȳ⁴]
```

where n is the number of **users** (not orders or sessions). The naive approach treats every order as independent — this understates the variance by 2–10×, inflating Type I error dramatically.

### Mann–Whitney U (non-parametric)

Used for skewed metrics with small samples. Tests stochastic dominance, not mean equality. Uses a normal approximation with continuity correction:

```
z = (U − n_A·n_B/2 + 0.5·sign(n_A·n_B/2 − U)) / √(n_A·n_B·(n_A+n_B+1)/12)
```

-----

## Verified examples

All calculations verified against the reference cases from the accompanying book.

**Case 1 — Checkout conversion (Z-test)**

|Input              |Value                  |
|-------------------|-----------------------|
|Baseline conversion|4.80% (5,856 / 122,000)|
|Variant conversion |5.15% (6,283 / 122,000)|
|Expected Z         |≈ 4.0                  |
|Calculator output  |Z = 3.976, p < 0.001 ✓ |

**Case 3 — Average order value (delta method)**

The same data run through a naive t-test gives Z ≈ 4.8 (p < 0.001). The delta method gives Z = 2.1 (p = 0.036) — the naive analysis overstated significance by more than 2×.

-----

## Technical details

|Property       |Value                                                                                        |
|---------------|---------------------------------------------------------------------------------------------|
|File size      |~90 KB                                                                                       |
|Dependencies   |None                                                                                         |
|Framework      |None — vanilla HTML, CSS, JavaScript                                                         |
|Charts         |Inline SVG, drawn at runtime                                                                 |
|Stats          |Custom JS implementations (Abramowitz–Stegun for normCdf, Beasley–Springer–Moro for normInv) |
|Browser support|All modern browsers (Chrome, Safari, Firefox, Edge)                                          |
|Mobile         |Optimised for iPhone and desktop — 44px touch targets, iOS zoom prevention, responsive layout|
|Privacy        |No data leaves your device. No analytics, no tracking, no external requests.                 |

-----

## Limitations

- **Delta method requires user-level summary statistics** — you need to pre-compute mean(X), mean(Y), SD(X), SD(Y), and Cov(X,Y) across users per arm. The calculator cannot do this from raw data.
- **Mann–Whitney uses a normal approximation** — accurate for n > 8 per arm. For very small samples (n < 8) use exact tables.
- **CUPED slider is an estimate** — enter your actual pre-period correlation ρ; the calculator uses ρ² as the variance reduction factor.
- **Sequential testing is not supported** — if you’re peeking at results before the test ends, the p-values shown are not valid. Use mSPRT or α-spending methods for sequential analysis.
- **Switchback / paired t-test is not implemented** — for marketplace interference experiments you’ll need a different tool.

-----

## Contributing

Contributions welcome. The most useful additions would be:

- **Bootstrap CI option** for the delta method (for small n where the linear approximation is poor)
- **Sequential testing mode** with mSPRT or alpha-spending
- **Paired t-test** for switchback / pre-post experiments
- **Sample size calculator for Mann–Whitney** (currently only supported in the analysis tab)
- **CSV import** — paste or upload raw user-level data for the continuous and ratio tabs

To contribute:

```bash
git fork https://github.com/yourusername/ab-testing-calculator
# Make changes to index.html
# Test in at least Chrome and Safari
git pull request
```

The entire calculator is one file — CSS, HTML, and JavaScript. There’s no build step and no bundler. Just edit `index.html` directly.

-----

## Related resources

This calculator was built alongside a bilingual practical guide to A/B testing (*A/B Testing in Practice*, available in English and Russian). The guide covers:

- Core theory: hypotheses, α, p-value, power, CLT
- MDE — what it means and how to choose it
- Type I and Type II errors and how every lever affects them
- Which test to use by metric type — with four realistic analyst-PM case studies
- CUPED deep dive — the math, a 5-step recipe, and Python implementation
- Delta method deep dive — why naive analysis is wrong, the Taylor linearisation, and Python implementation

-----

## Licence

MIT — do whatever you want, just keep the copyright notice.

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