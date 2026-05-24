# A/B Testing Calculator

**Pick your metric, drop in your numbers, get a confident decision — with the right statistical test for what you’re actually measuring.**

🔗 **[Open the calculator →](https://anreiamirov.github.io/AB-testing-calculator/)**

-----

## What it does

The calculator covers the full A/B testing workflow in one place:

- **Plan a test** — calculate required sample size given your baseline, MDE, α, and power; supports CUPED variance reduction
- **Analyse results** — paste in your data and get a p-value, confidence interval, and a plain-English verdict
- **Reference** — in-context explanations of every statistical concept, formula, and common mistake

## Which test does it use?

The calculator routes you to the correct test based on your metric type:

|Metric type                |Example metrics                      |Test                 |
|---------------------------|-------------------------------------|---------------------|
|Conversion / proportion    |Conversion rate, CTR, open rate      |Z-test               |
|Continuous per-user        |ARPU, session time, items per user   |Welch’s t-test       |
|Ratio (varying denominator)|AOV, CTR per session, items per order|Delta method + Z-test|
|Skewed / small n           |B2B deal size, early-stage metrics   |Mann–Whitney U       |
|3+ variants on conversion  |Multi-arm tests                      |χ² + Bonferroni      |

Not sure which applies? The built-in **“Help me choose”** guide asks two questions and points you to the right test.

## Key features

- **Correct by default.** The delta method is applied automatically for ratio metrics — no more inflated Type I error from naive per-row t-tests.
- **CUPED support.** Enter your pre-experiment variance reduction and the sample size adjusts automatically.
- **Multi-variant support.** Add as many variants as you need; the calculator runs χ² across all variants and then pairwise tests with Bonferroni correction.
- **Pre-registration field.** Enter your pre-registered MDE to guard against post-hoc threshold shopping.
- **Privacy-first.** All calculations run locally in your browser — no data is sent anywhere.

## Who it’s for

Product managers, data analysts, and engineers who run A/B tests and want to skip the spreadsheet gymnastics. No statistics background required; the calculator explains what each parameter means and why it matters.

-----

**→ [Launch the calculator](https://anreiamirov.github.io/AB-testing-calculator/)**