// roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    r = Math.min(r, w/2, h/2);
    this.beginPath();
    this.moveTo(x+r, y);
    this.lineTo(x+w-r, y); this.arcTo(x+w, y, x+w, y+r, r);
    this.lineTo(x+w, y+h-r); this.arcTo(x+w, y+h, x+w-r, y+h, r);
    this.lineTo(x+r, y+h); this.arcTo(x, y+h, x, y+h-r, r);
    this.lineTo(x, y+r); this.arcTo(x, y, x+r, y, r);
    this.closePath();
  };
}

// ── Internationalisation ──────────────────────────────
const T = {
  en: {
    site_title:'A/B Testing Calculator',
    site_subtitle:"Pick your metric, drop in your numbers, get a confident decision — with the right statistical test for what you're actually measuring.",
    tab_plan:'Plan a test', tab_analyse:'Analyse results', tab_reference:'Learn',
    theme_dark:'Dark', theme_light:'Light',
    step1:'Step 1', step2:'Step 2', step3:'Step 3',
    step2_variant:'Step 2 · Variant data',
    step2_variant_agg:'Step 2 · Variant data (aggregated per user)',
    step3_params:'Step 3 · Parameters',
    plan_step1_heading:'What are you measuring?',
    plan_step1_sub:"Choose the type that matches your metric — this determines the correct statistical test.",
    plan_conv_label:'Conversion',
    plan_conv_desc:'Yes/no per user — signup rate, purchase rate, click-through rate, retention',
    plan_cont_label:'Continuous metric',
    plan_cont_desc:'One continuous value per user — ARPU, session time, items in cart, 14-day spend',
    plan_ratio_label:'Ratio metric',
    plan_ratio_desc:'Rate with varying denominator — AOV, CTR per session, items per order',
    plan_step2_heading:'Your numbers', plan_step3_heading:'Test parameters',
    plan_duration_heading:'How long will it take?',
    plan_duration_hint:'Enter your daily eligible traffic to estimate experiment duration.',
    plan_daily_users_short:'Daily eligible users', plan_daily_users_tip:'users who could enter the test',
    plan_num_variants_short:'Number of variants', plan_num_variants_tip:'including control',
    plan_daily_users:'Daily eligible users — users who could enter the test',
    plan_num_variants:'Number of variants — including control',
    plan_baseline_conv:'Baseline conversion rate (%) — e.g. 4.8 means 4.8%',
    plan_mde_conv:'Minimum lift to detect (% relative) — e.g. 10 = +10%',
    plan_baseline_mean:'Baseline mean — current average',
    plan_sd_label:'Standard deviation — from historical data',
    plan_mde_cont:'Minimum lift to detect (% relative)',
    plan_cuped_label:'CUPED variance reduction (%) — 0 if not using; typical 30–50%',
    btn_calculate:'Calculate', btn_analyse:'Analyse results',
    btn_add_variant:'+ Add variant', btn_summary_stats:'enter summary stats instead',
    lbl_exposed:'Exposed', lbl_converted:'Converted',
    lbl_significance:'Significance (α)', lbl_hypothesis:'Hypothesis',
    lbl_two_sided:'Two-sided', lbl_one_sided:'One-sided',
    lbl_prereg_mde:'Pre-registered MDE (%, optional) — your upfront minimum',
    lbl_upload:'Upload Excel / CSV file',
    lbl_upload_hint:"Columns: variant and value (or we'll auto-detect)",
    lbl_or_paste:'or paste values below',
    lbl_per_user_values:'Per-user values — comma or space separated',
    lbl_per_user_ratio:'Per-user ratio values — comma or space separated',
    cont_hint:"Each value = one user's metric (e.g. their total revenue that week).",
    ratio_hint:"Each value = one user's computed ratio (e.g. their AOV or their CTR).",
    ratio_agg_title:'Aggregate to one value per user before pasting.',
    lbl_power:'Power (1 − β)',
    ref_distcases_title:'Case studies: should you check the distribution?',
    dc1_tag:'✅ Case 1 · Safe to skip', dc1_title:'Checkout conversion rate, 40,000 users per arm',
    dc1_p:'A team tests a new checkout button. The metric is binary — converted or not — and each arm has 40,000 users. Someone asks whether they need to check normality first.',
    dc1_s1_b:'The data:', dc1_s1:'A proportion (≈3% convert). The raw data is just 0s and 1s — about as far from a bell curve as possible.',
    dc1_s2_b:'The decision:', dc1_s2:'No check needed. With tens of thousands of users, the sampling distribution of the proportion is essentially normal by the CLT. The Z-test is valid.',
    dc1_t_b:'Lesson:', dc1_t:'For proportions at scale, normality of the raw data is irrelevant — only the sample size matters, and here it is huge.',
    dc2_tag:'⚠️ Case 2 · You must check', dc2_title:'Revenue per user, 80 users in a B2B pilot',
    dc2_p:'A B2B company pilots a pricing change with only 80 customers per arm. The metric is revenue per account — and two enterprise deals dwarf everyone else.',
    dc2_s1_b:'The data:', dc2_s1:'Extremely right-skewed with heavy outliers, and the sample is small (n = 80). The CLT has not reliably kicked in for such a skewed metric at this size.',
    dc2_s2_b:'The decision:', dc2_s2:'Check the shape. A histogram shows the skew; mean and median are far apart. A plain t-test here is fragile — one more whale could flip the result.',
    dc2_t_b:'Lesson:', dc2_t:'Use Mann–Whitney U, or a log transform, or report the median. Small n plus heavy skew is the one combination where you genuinely must look.',
    dc3_tag:'🐫 Case 3 · The hidden trap', dc3_title:'Session duration that looked fine but wasn\'t',
    dc3_p:'A team analysed average session duration with 5,000 users per arm — comfortably large — and trusted the t-test. The result was significant, but the rollout didn\'t move the needle.',
    dc3_s1_b:'What they missed:', dc3_s1:'The distribution was bimodal — a spike of bounces near 0 seconds and a second hump of engaged users. The "average" sat in an empty valley between the two groups, describing nobody.',
    dc3_s2_b:'The fix:', dc3_s2:'Segment first. Splitting bounced vs engaged sessions revealed the change only affected one group. The headline average had hidden it.',
    dc3_t_b:'Lesson:', dc3_t:'A large sample protects the <em>test\'s</em> validity, but not your interpretation. Always eyeball the shape — bimodality is a signal to segment, not to average.',
    ref_usecases_title:'Matching the test to the situation',
    uc_intro:'Beyond normality, the distribution shape often tells you which test or metric to reach for. A few common product situations:',
    uc1_b:'Revenue / order value (right-skewed):', uc1:'Report the mean for business impact, but pair it with the median and consider CUPED to cut variance. With large n the t-test is fine; with small n switch to Mann–Whitney.',
    uc2_b:'Time-to-event / latency (exponential):', uc2:'Averages are dominated by the tail. Prefer percentiles (p50, p95) and consider a log transform before testing means.',
    uc3_b:'Counts per user (Poisson-like):', uc3:'Orders per user, errors per session. The mean is meaningful, but variance grows with the mean — Welch\'s t (unequal variances) is a safe default.',
    uc4_b:'Mixed populations (bimodal):', uc4:'Segment before you test. A single average across two distinct groups is usually misleading, however large the sample.',
    uc5_b:'Binary outcomes (proportions):', uc5:'Conversion, click, signup. Use the Z-test; normality of raw data never matters, only that you have enough events (a rule of thumb: at least ~10 conversions in each arm).',
    ref_choose_title:'Z-test vs t-test: which to use, and why',
    ref_choose_sub:'The single most common question — and the most consequential. The right test depends on one thing: what kind of number your metric produces per user.',
    ch_intro:'<strong>The deciding question:</strong> is each user a yes/no, or a number? That answer picks your test. Everything else is detail.',
    ch_use:'Use it when', ch_stat:'In statistics', ch_biz:'In business',
    ch_z_h:'Z-test — for conversion / proportions',
    ch_z_use:'each user is a binary outcome: converted or not, clicked or not, signed up or not.',
    ch_z_stat:'It compares two proportions. For a binary variable the spread is fixed by the rate itself (variance = p(1−p)), so once you know the conversion rate you already know the variability — no extra information needed. With thousands of users the proportion is essentially normal, so a Z (normal) test is exact enough.',
    ch_z_biz:'Answers "did a meaningfully larger share of users take the action?" Think checkout conversion, signup rate, email click-through. You only need two numbers per group — how many were shown it, and how many converted.',
    ch_t_h:"t-test (Welch's) — for continuous metrics",
    ch_t_use:'each user produces a number that can vary freely: revenue, session length, items in cart, days retained.',
    ch_t_stat:'It compares two means. Unlike a proportion, a continuous metric\'s spread is <em>not</em> determined by its average — two groups can share a mean yet differ wildly in variance — so the test must estimate the spread from the data. Welch\'s version doesn\'t assume the two groups have equal variance, which makes it the safe default. (The "t" accounts for the extra uncertainty of estimating that spread; at large n it converges to the Z-test.)',
    ch_t_biz:'Answers "did the average value per user move?" Think ARPU, average order value, time on site. You need the mean, the standard deviation, and the sample size for each group — the spread matters as much as the average.',
    ch_key_title:'🔑 The one-line reason they differ',
    ch_key_body:'For a <strong>proportion</strong>, the rate fixes the variance — so summary counts are enough (Z-test). For a <strong>continuous</strong> value, the average and the spread are independent — so you must measure the spread separately, and the t-test is built to handle that uncertainty.',
    ch_ratio_b:'Ratio metrics (AOV, CTR per session):', ch_ratio:'these have a varying denominator. Compute one value per user, then treat it as a continuous metric and use Welch\'s t.',
    ch_mw_b:'Skewed data with small n (<200):', ch_mw:'when the Central Limit Theorem hasn\'t smoothed things out yet, switch to the Mann–Whitney U test, which compares ranks and assumes no particular shape.',
    ch_multi_b:'3+ variants:', ch_multi:'run an omnibus test first (χ² for conversion, ANOVA for continuous), then corrected pairwise comparisons — see "Multiple testing" below.',
    ref_tests_title:'Tests at a glance', ref_how_title:'How each test works',
    ref_limits_title:'Limitations & how to overcome them',
    ref_abp_title:'How α, β, and power interact',
    toc_glossary_short:'Plain-English glossary',
    ref_glossary_title:'Plain-English glossary: the terms, with examples',
    ref_glossary_sub:"Every A/B testing term you'll meet, explained without jargon — each with a concrete example. Start here if the vocabulary feels intimidating.",
    gl_eg:'Example:',
    gl_null_t:'Null hypothesis (H₀)',
    gl_null_d:'The starting assumption that there is <strong>no real difference</strong> between your variants — any gap you see is just chance. A test tries to gather enough evidence to reject it.',
    gl_null_e:'"The new checkout button converts exactly the same as the old one." You run the test hoping to disprove this.',
    gl_pval_t:'P-value',
    gl_pval_d:'The probability of seeing a difference <strong>at least as big</strong> as the one you observed <em>if the variants were actually identical</em>. A small p-value means "this gap would be surprising if nothing were really going on" — so you start to believe something is.',
    gl_pval_e:"p = 0.03 means: if the button truly made no difference, you'd see a gap this large only 3% of the time by luck. That's rare enough to call it a real effect. <strong>It does not</strong> mean \"97% chance the button is better\" — a common trap.",
    gl_alpha_t:'Significance level (α)',
    gl_alpha_d:'The bar you set <em>in advance</em> for how small the p-value must be to call a result "significant." It is also your accepted false-positive rate. Usually 0.05.',
    gl_alpha_e:'α = 0.05 means you accept a 1-in-20 chance of being fooled by noise into declaring a winner that isn\'t real.',
    gl_sig_t:'Statistical significance',
    gl_sig_d:'A result is "statistically significant" when its p-value falls below your α. It means the difference is unlikely to be pure chance — <strong>not</strong> that it is large or important.',
    gl_sig_e:'A 0.1% lift can be significant with millions of users, yet be too small to matter for the business. Significant ≠ meaningful.',
    gl_ci_t:'Confidence interval (CI)',
    gl_ci_d:'A <strong>range of plausible values</strong> for the true effect, instead of a single number. A 95% CI means: if you repeated the experiment many times, about 95% of the intervals you\'d build would contain the true value. Wider interval = more uncertainty.',
    gl_ci_e:'Example:',
    gl_ci_e2:'A lift of "+8% with 95% CI [+2%, +14%]" says the real effect is probably between +2% and +14%. Because the whole range is above zero, you can be confident it\'s a genuine improvement. If the CI were [−3%, +19%], it crosses zero — you couldn\'t rule out no effect (or even harm).',
    gl_power_t:'Statistical power',
    gl_power_d:'The chance your test will <strong>detect a real effect</strong> if one truly exists. Low power means you might miss a genuine winner. The standard target is 80%.',
    gl_power_e:'80% power means: if the new button really is better, you have an 80% chance of your test catching it — and a 20% chance of missing it because your sample was too small.',
    gl_mde_t:'Minimum detectable effect (MDE)',
    gl_mde_d:'The <strong>smallest improvement worth catching</strong>. You decide it before the test — it drives how many users you need. Smaller MDE = much larger sample.',
    gl_mde_e:'"I only care if the button lifts conversion by at least 5%." Detecting a 5% lift needs far fewer users than detecting a 1% lift.',
    gl_ss_t:'Sample size',
    gl_ss_d:'How many users you need per variant to reliably detect your MDE at your chosen α and power. Too few and the test is underpowered; the Plan tab computes this for you.',
    gl_ss_e:'To spot a 5% lift on a 3% baseline at 80% power, you might need ~50,000 users per arm — roughly two weeks at typical traffic.',
    gl_vs_t:"P-value vs α — what's the difference?",
    gl_vs_d:'They are easy to confuse but they are <strong>opposite kinds of thing</strong>. <strong>α is a threshold you choose before the test</strong> — fixed, set by you, the same every time. <strong>The p-value is a number the data produces after the test</strong> — it changes with every experiment. You compare one to the other: if <em>p &lt; α</em>, the result is significant.',
    gl_vs_e_b:'Think of an exam:', gl_vs_e:'α is the <strong>pass mark you set in advance</strong> (say 60%). The p-value is the <strong>score a student actually got</strong> (say 73%). The pass mark is your rule; the score is the evidence. Saying "p-value and α are the same" is like saying the pass mark and the grade are the same thing.',
    ref_cifac_title:'What makes a confidence interval wider or narrower?',
    ref_cifac_sub:"A CI's width is its uncertainty. Three things drive it — and sample size is the one you control most directly.",
    cifac_chart_title:'Confidence interval narrows as sample size grows',
    cifac_chart_sub:'95% CI for a 30% conversion rate. Drag the slider: the interval shrinks in proportion to 1/√n — so to halve the width you must quadruple the users.',
    cifac_formula_label:'95% margin of error (half-width)', cifac_slider_label:'Users per group (n):', cifac_axis:'users per group (n) — log scale',
    cifac_f1_b:'Sample size (n) — biggest lever.', cifac_f1:'More data means less uncertainty. The width shrinks with 1/√n, so going from 1,000 to 4,000 users halves it, but from 1,000 to 2,000 only cuts it by ~30%. Diminishing returns.',
    cifac_f2_b:'Variability (spread) of the data.', cifac_f2:'Noisier metrics give wider intervals. For a proportion the spread is fixed by the rate itself (largest near 50%); for revenue or time, a few extreme values widen the CI — which is why variance-reduction tricks like CUPED help.',
    cifac_f3_b:'Confidence level you choose.', cifac_f3:'Demanding more confidence widens the interval: a 99% CI is wider than a 95% CI, which is wider than 90%. Higher confidence buys certainty at the cost of precision.',
    cifac_tip_title:'💡 Why this matters in practice',
    cifac_tip_body:'A wide CI that crosses zero is the data telling you "I can\'t rule out no effect yet." The usual fix is more users — but because of the 1/√n rule, detecting ever-smaller effects gets expensive fast. That trade-off is exactly what the Plan tab quantifies when it sizes your test.',
    gl_errors_t:'Type I & Type II errors',
    gl_errors_d:'A <strong>Type I error</strong> (false positive) is declaring a winner that isn\'t real. A <strong>Type II error</strong> (false negative) is missing a real winner. α controls the first; power controls the second.',
    gl_errors_e:'Shipping a button that actually does nothing = Type I. Killing a button that actually worked = Type II.',
    ref_chart1_title:'How statistical significance works',
    ref_chart1_sub:'The null hypothesis assumes no real effect. If your test statistic lands in the shaded rejection region (|Z| > zα), you reject it. α = 0.05 shown.',
    ref_chart2_title:'Type I & Type II errors',
    ref_chart2_sub:'H₀ (blue) and H₁ (orange) distributions overlap. Red tail = α (false positive). Grey area = β (missed effect). Power = 1 − β.',
    ref_chart3_title:'Sample size vs Minimum Detectable Effect',
    ref_chart3_sub:'Detecting smaller effects requires exponentially more users. Halving the MDE roughly quadruples the required sample size (α = 0.05, power = 80%).',
    ref_chart4_title:'How power grows with sample size',
    ref_chart4_sub:'For a fixed 5% relative MDE and α = 0.05, power rises with n. The dashed lines mark the standard 80% and 90% thresholds.',
    ref_chart5_title:'CUPED: how variance reduction shrinks the sample you need',
    ref_chart5_sub:'CUPED removes pre-experiment noise. Drag the slider to see how the variance-reduction percentage cuts the required sample size.',
    ref_cuped_slider_label:'Variance reduction:',
    ref_chart6_title:'Why peeking inflates your false-positive rate',
    ref_chart6_sub:'Each extra look at the data gives the false-positive rate another chance to cross 5%. Drag to see how the true error rate climbs with the number of peeks.',
    ref_peek_slider_label:'Number of peeks:',
    cuped_bar_base:'Without CUPED', cuped_bar_cuped:'With CUPED', cuped_savings:'fewer users',
    peek_actual:'actual FP rate', peek_axis:'Number of times you peek',
    gl_cuped:'A variance-reduction technique that subtracts predictable pre-experiment noise from your metric, so you need less data. Explained in detail below.',
    cs_tag:'📘 Case study',
    cs_title:'StreamFlix tests a new checkout flow',
    cs_intro:'StreamFlix wants to know if a one-click checkout lifts average revenue per user (ARPU). ARPU is brutally noisy — a handful of annual-plan buyers dominate, so the standard deviation is huge relative to the mean.',
    cs_s1_b:'The problem without CUPED:', cs_s1:'Baseline ARPU is $12.00 with an SD of $48.00 (CV = 4.0). To detect a 3% lift at 80% power, they\'d need ≈ 168,000 users per arm — about 6 weeks of traffic.',
    cs_s2_b:'Apply CUPED:', cs_s2:'Each user\'s spend in the 4 weeks before the test (X) correlates with their spend during the test (Y) at ρ = 0.6. CUPED subtracts that predictable part: Y_cuped = Y − θ·(X − X̄).',
    cs_s3_b:'The result:', cs_s3:'Variance drops by ρ² = 0.36 — a 36% reduction. The effective SD falls from $48 to $38.40. Required sample size drops to ≈ 107,500 per arm — they reach a decision almost 2 weeks sooner, with no change to the estimated lift.',
    cs_takeaway_b:'Takeaway:', cs_takeaway:'CUPED didn\'t change the answer — it got them to the same answer faster. The noisier your metric and the stronger the pre-period correlation, the bigger the win.',
    ref_deepdive_title:'Deep dive: CUPED, step by step',
    dd_cuped_p1:'CUPED (Controlled-experiment Using Pre-Experiment Data) is the single highest-leverage trick in modern experimentation. The idea: a user who spent a lot last month will probably spend a lot this month regardless of your change. That predictable part is noise you can subtract.',
    dd_cuped_s1_b:'Pick a covariate X', dd_cuped_s1:'a pre-experiment measurement correlated with your metric Y. Prior-period revenue is the classic choice for ARPU tests.',
    dd_cuped_s2_b:'Estimate θ', dd_cuped_s2:'θ = Cov(Y, X) / Var(X). This is just the slope of a regression of Y on X, computed across all users in the experiment.',
    dd_cuped_s3_b:'Transform Y', dd_cuped_s3:'Y_cuped = Y − θ·(X − X̄). The mean is unchanged (so your lift estimate stays unbiased), but the variance drops.',
    dd_cuped_s4_b:'Run your test on Y_cuped', dd_cuped_s4:'The variance reduction equals ρ², where ρ is the correlation between Y and X. A correlation of 0.7 cuts variance by ~49%.',
    dd_cuped_p2:'Because required sample size scales linearly with variance, a 50% variance reduction means you reach significance in half the time — or detect an effect half the size in the same time. That is why every large experimentation platform uses it.',
    ref_lifecycle_title:'The experiment lifecycle',
    dd_lc_1_b:'1. Hypothesis', dd_lc_1:'State the change, the metric it should move, and the direction. "Bigger CTA button → higher signup rate."',
    dd_lc_2_b:'2. Power analysis', dd_lc_2:'Decide the MDE that matters for the business, then compute the sample size and duration before launch. (That\'s what the Plan tab is for.)',
    dd_lc_3_b:'3. Run', dd_lc_3:'Launch, check for SRM in the first hours, then leave it alone for at least one full business cycle (usually 1–2 weeks). No peeking.',
    dd_lc_4_b:'4. Analyse', dd_lc_4:'At the planned sample size, run the right test for your metric type, check guardrails, and look at key segments. (That\'s the Analyse tab.)',
    dd_lc_5_b:'5. Decide & document', dd_lc_5:'Ship, iterate, or abandon. Write down the result either way — negative results stop your team from repeating dead ideas.',
    ref_dist_title:'A catalog of distribution shapes',
    ref_dist_sub:'Real metrics rarely look like a textbook bell curve. Here are the eight shapes you will meet most often — smooth curves for continuous metrics, bars for discrete counts.',
    dist_normal:'Normal', dist_skew:'Right-skewed', dist_leftskew:'Left-skewed', dist_bimodal:'Bimodal', dist_uniform:'Uniform', dist_triangular:'Triangular (2 dice)', dist_exponential:'Exponential', dist_poisson:'Poisson (counts)', dist_heavy:'Heavy-tailed (outliers)',
    ref_disttypes_title:'A field guide to distributions',
    dt_normal_b:'Normal (symmetric).', dt_normal:'The classic bell curve — values cluster around the mean and tail off evenly on both sides. Heights, measurement errors, and sample averages look like this. Most textbook tests assume it.',
    dt_skew_b:'Right-skewed (positive skew).', dt_skew:'A long tail to the right. Revenue, order value, time-on-page, and lifetime value almost always look like this — most users spend a little, a few spend a lot. The mean is dragged above the median.',
    dt_leftskew_b:'Left-skewed (negative skew).', dt_leftskew:'A long tail to the left. Rarer in product data, but appears in things like exam scores near a ceiling or days-until-churn for a loyal base — most values are high, a few are very low.',
    dt_bimodal_b:'Bimodal.', dt_bimodal:'Two peaks, usually meaning two hidden sub-populations mixed together — e.g. free vs paid users, or mobile vs desktop. Often a signal you should segment before analysing.',
    dt_uniform_b:'Uniform.', dt_uniform:'Every value is equally likely — a flat line. A single fair die is the textbook case. Rare in real metrics, but the building block for simulations and randomisation.',
    dt_triangular_b:'Triangular (sum of dice).', dt_triangular:'The shape in the question above: roll two dice and sum them, and the totals form a triangle peaking at 7. It comes from adding two uniform variables — and hints at the deeper rule that summing things pushes you toward a bell.',
    dt_exponential_b:'Exponential.', dt_exponential:'A steep drop from a peak at zero. Models waiting times — time between purchases, time to first action, session gaps. Memoryless: the past does not change the expected wait.',
    dt_poisson_b:'Poisson (counts).', dt_poisson:'For counts of rare events in a fixed window — orders per day, errors per session, support tickets per hour. Discrete, right-leaning, and defined by a single rate parameter.',
    dt_heavy_b:'Heavy-tailed.', dt_heavy:'Mostly normal-looking but with rare extreme outliers far from the centre. A single whale purchase or a bot session can sit way out in the tail and distort the mean and variance.',
    toc_anatomy_short:'Anatomy: mean, median, mode & SD',
    ref_anatomy_title:'Anatomy of a distribution: mean, median, mode & the spread',
    ref_anatomy_sub:'Three "centres" describe a distribution — the mode (the peak), the median (the middle value), and the mean (the average). Where they sit relative to each other tells you the shape at a glance. The spread is measured in standard deviations (SD).',
    anat_normal_h:'Normal — the 68–95–99.7 rule',
    anat_normal_p:'In a perfectly symmetric normal distribution, <strong>mean = median = mode</strong> — all three sit dead centre. The spread follows the empirical rule: about <strong>68%</strong> of values fall within ±1 SD of the mean, <strong>95%</strong> within ±2 SD, and <strong>99.7%</strong> within ±3 SD. Only ~0.3% lie beyond ±3 SD, which is why a 3-sigma event is considered rare.',
    anat_right_h:'Right-skewed — the mean is pulled toward the tail',
    anat_right_p:'With a long right tail, the order is <strong>mode &lt; median &lt; mean</strong>. The peak (mode) sits on the left where most values cluster; the few large values in the tail drag the mean rightward, past the median. Revenue and order value behave this way — which is why the average revenue per user is almost always higher than what a typical user spends. The spread is asymmetric: values stretch much further above the mean than below it.',
    anat_left_h:'Left-skewed — the mirror image',
    anat_left_p:'A long left tail flips the order to <strong>mean &lt; median &lt; mode</strong>. The peak sits on the right where most values bunch up, and a few small values pull the mean leftward. Think of exam scores where most students do well but a handful fail badly, or the age at which a loyal cohort finally churns. Here the typical value (mode) is higher than the average.',
    anat_binom_h:'Binomial — counting successes',
    anat_binom_p:'The binomial distribution counts how many successes occur in a fixed number of yes/no trials — e.g. how many of 20 visitors convert. It is <strong>discrete</strong> (bars, not a curve) with mean = <strong>n × p</strong> (trials × probability). When p = 0.5 it is symmetric like a normal; when p is small it leans right. The key fact for A/B testing: as n grows, the binomial is well-approximated by a normal distribution — which is exactly why the Z-test works on conversion rates.',
    anat_mmm:'mean = median = mode', anat_mode:'mode', anat_median:'median', anat_mean:'mean',
    anat_binom_mean:'mean = n·p = 6', anat_binom_x:'number of successes (k)',
    ref_dice_title:'Worked example: why two dice make a triangle',
    dice_p1:'A single die is <strong>uniform</strong> — each face 1–6 is equally likely. But sum <em>two</em> dice and the result is no longer flat: it peaks at 7 and falls away symmetrically toward 2 and 12. This is a <strong>triangular distribution</strong>.',
    dice_p2:'The reason is simple counting. There is only one way to roll a 2 (1+1) and one way to roll a 12 (6+6), but six different ways to roll a 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1). More combinations means higher probability, so the middle towers over the edges.',
    dice_callout_title:'🎯 The deeper lesson',
    dice_callout_body:'Adding just two uniform dice already bends a flat distribution toward a peak. Add more dice and it gets smoother and more bell-shaped. This is the Central Limit Theorem in miniature — sums and averages of random things tend toward a normal distribution, whatever the original shape.',
    ref_theory_title:'The theory that ties it together',
    th_clt_b:'Central Limit Theorem (CLT).', th_clt:'The headline result of statistics: if you take many independent samples and average each one, those averages follow a normal distribution — no matter what shape the original data had. This is why tests built on the normal curve work on messy, skewed real-world metrics, as long as the sample is large enough.',
    th_lln_b:'Law of Large Numbers.', th_lln:'As your sample grows, its average converges to the true population average. The CLT describes the <em>shape</em> of the estimate\'s uncertainty; the Law of Large Numbers says that uncertainty shrinks toward zero with more data. Together they justify why bigger experiments are more trustworthy.',
    th_se_b:'Standard error and √n.', th_se:'The spread of the sample mean is the standard deviation divided by √n. Quadrupling your sample only halves your uncertainty — which is exactly why detecting tiny effects needs disproportionately large samples.',
    th_build_b:'Distributions build on each other.', th_build:'Sum two uniforms → triangular. Sum many of almost anything → normal. Count rare events → Poisson. Time between those events → exponential. The shapes are not arbitrary; they arise from how the underlying randomness is generated.',
    ref_clt_title:'Why skew usually doesn\'t break your test: the Central Limit Theorem',
    ref_clt_sub:'Your test cares about the distribution of the average, not the raw data. Even from a very skewed population, the average of a sample becomes bell-shaped as the sample grows. Drag the sample size and watch it happen.',
    ref_clt_slider_label:'Sample size (n):',
    clt_truemean:'true mean', clt_cap_pop:'n = 1: the raw population (very skewed)', clt_cap_mean:'distribution of the sample mean (n = {n})',
    ref_checknorm_title:'When should you actually check for normality?',
    cn_intro:'The most common misconception in A/B testing is that your raw data must be normally distributed. It usually doesn\'t. The t-test and Z-test assume the <em>sampling distribution of the mean</em> is roughly normal — and thanks to the Central Limit Theorem, that happens automatically once your sample is large enough, no matter how skewed the underlying data is.',
    cn_rule_title:'✅ The practical rule',
    cn_rule_body:'With more than ~30–50 users per group for a fairly tame metric, or a few hundred for a heavily skewed one like revenue, you do not need to check normality at all. The CLT has you covered.',
    cn_skip_b:'You can skip the check when:', cn_skip:'your sample is large (hundreds+ per arm) and your metric is a mean or proportion. This covers the large majority of online experiments.',
    cn_do_b:'You should check (or switch tests) when:', cn_do:'your sample is small (under ~100–200 per arm), your metric is extremely skewed or dominated by a few outliers, or your data is clearly bimodal. In those cases the CLT may not have kicked in yet.',
    cn_how_b:'How to check:', cn_how:'plot a histogram and look at the shape; compare the mean and median (far apart = skewed); or use a Q–Q plot. Formal tests like Shapiro–Wilk exist but are over-sensitive on large samples, so the eyeball test is usually more useful.',
    cn_fix_b:'What to do if it\'s not normal and n is small:', cn_fix:'use the Mann–Whitney U test (compares ranks, no normality assumption), apply a log transform to tame right-skew, or cap/winsorize extreme outliers. Collecting more data is the simplest fix of all.',
    ref_glossary_title:'Glossary of key terms',
    gl_pvalue:'The probability of seeing a difference at least this large if there were truly no effect. Small p = the data is surprising under "no effect."',
    gl_alpha:'Your false-positive tolerance — the chance you\'ll call a winner when there\'s no real effect. Usually 5%.',
    gl_beta:'β is the chance of missing a real effect. Power = 1 − β is the chance of catching it. Aim for 80%+.',
    gl_mde:'Minimum Detectable Effect: the smallest lift your test is powered to detect. Smaller MDE needs much more data.',
    gl_ci:'A range that would contain the true effect 95% of the time across repeated experiments. If it excludes zero, the result is significant.',
    gl_se:'How much your estimate would bounce around from sample to sample. Shrinks as 1/√n.',
    gl_cv_b:'Coefficient of variation (CV)', gl_cv:'SD ÷ mean. A unit-free measure of spread; high CV means a noisy metric that needs more data.',
    gl_srm:'Sample Ratio Mismatch: the actual traffic split differs from the intended one, signalling a bug that invalidates results.',
    th_metric_type:'Metric type', th_test:'Test', th_when:'When to use',
    th_lever:'Lever', th_mechanism:'Mechanism',
    acc_ztest:'Z-test for conversion rates',
    acc_welch:"Welch's t-test (continuous metric)",
    acc_ratio:'Ratio metrics — aggregation approach',
    acc_mann:'Mann–Whitney U (non-parametric)',
    acc_multi:'Multi-variant tests (3+ variants)',
    acc_variance:'High variance → low power',
    acc_novelty:'Novelty & primacy effects',
    acc_srm:'Sample Ratio Mismatch (SRM)',
    acc_peeking:'Peeking — calling results too early',
    acc_network:'Network effects & interference between users',
    acc_multiple:'Multiple metrics — what do you optimise for?',
    // Plan result box
    res_sample_size:'Required sample size per variant',
    prop_both:'Sample size <em>and</em> duration in one place', prop_free:'Free, no signup', prop_private:'Runs in your browser — nothing leaves your device',
    plan_empty_t:'Your result will appear here', plan_empty_s:'Required sample size, estimated test duration, and a plain-English read of what it means.',
    res_method_label:'Method:',
    method_two_sided:'two-sided', method_one_sided:'one-sided',
    method_z:'two-proportion Z-test, pooled variance, {c}% confidence, {p}% power ({s})',
    method_t:"Welch's t-test (unequal variances), {c}% confidence, {p}% power ({s})",
    method_bonf:'Bonferroni-adjusted for {k} comparisons',
    plan_explain_h:'What this means', plan_explain_link:'Read how this is computed →',
    explain_conv:'You need {n} users per group to reliably detect a {lift}% relative lift on a {base}% baseline.',
    explain_cont:'You need {n} users per group to reliably detect a {lift}% change in the average.',
    explain_days:'At your current traffic, that is about <b>{d} days</b> of testing.',
    explain_tradeoff:'Smaller effects need far more traffic — halving the lift roughly quadruples the sample.',
    explain_multi:'With {v} variants, each arm is sized for {k} corrected comparisons against control.',
    res_users:'users', res_days:'days',
    res_total:'total (both variants)', res_mde_abs:'absolute MDE',
    res_test_used:'test used', res_duration:'Estimated experiment duration',
    res_full_weeks:'full weeks', res_users_day:'users/day per variant',
    lbl_control:'(control)',
    // Ratio warning
    ratio_warn_body:"For AOV: each user's total revenue ÷ their number of orders. For CTR per session: each user's total clicks ÷ their total sessions. Running a t-test on raw transaction rows (not aggregated) inflates false positives by 2–10×.",
    ratio_warn_why:'Why does this matter?',
    // Canvas chart labels
    chart_reject:'reject H₀', chart_fail_reject:'fail to reject H₀',
    chart_h0_null:'H₀ (null)', chart_h1_effect:'H₁ (true effect)',
    chart_sample_size_axis:'Sample size per variant (n)',
    chart_mde_axis:'Minimum Detectable Effect (relative %)',
    chart_power_axis:'Power (1 − β)',
    lbl_revenue_toggle:'Revenue projection (optional)',
    lbl_monthly_visitors:'Monthly visitors',
    lbl_avg_order:'Avg. order value ($)',
    js_revenue_title:'Projected annual revenue impact',
    js_rev_conservative:'Conservative',
    js_rev_expected:'Expected',
    js_rev_optimistic:'Optimistic',
    js_rev_note:'+{lift}pp lift × {visitors} visitors/mo × ${aov} AOV × 12 months. Based on 95% CI of the lift.',
    btn_share:'Share', share_copied:'✓ Link copied!',
    toc_aatest_short:'Start here: the A/A test', toc_process_short:'The full A/B test process',
    toc_multiple_short:'Multiple testing & error inflation',
    ref_multiple_title:'Multiple testing: why more comparisons inflate false positives',
    ref_multiple_sub:'The classic α = 0.05 threshold protects a single comparison. The moment you test several hypotheses at once, the chance of at least one false positive climbs fast — and you must correct for it.',
    mt_problem:'<strong>The problem.</strong> If you fix α = 0.05 and test one hypothesis, your chance of a false positive is 5%. But test several independent hypotheses and the probability of at least one false positive — the family-wise error rate (FWER) — is 1 − (1 − α)<sup>m</sup>. With 3 comparisons it is already ~14%; with 10 it is ~40%. More variants, more metrics, or repeated peeking all multiply your chances of being fooled.',
    mt_formula_label:'Family-wise error rate', mt_slider_label:'Comparisons (m):',
    mt_chart_title:'False-positive risk vs number of comparisons',
    mt_chart_sub:'The orange line is the uncorrected family-wise error rate; the dashed line shows how Bonferroni holds it at 5%.',
    mt_lbl_bonf:'with Bonferroni (5%)', mt_lbl_fwer:'uncorrected FWER', mt_axis:'number of simultaneous comparisons (m)',
    mt_bonf_b:'Bonferroni correction.', mt_bonf:'Divide your target α by the number of comparisons m (e.g. 0.05 / 10 = 0.005); only p-values below that count as significant. Dead simple and strictly controls FWER — but over-conservative, so it costs you power and can miss real effects.',
    mt_holm_b:'Holm–Bonferroni (step-down).', mt_holm:'Sort the p-values smallest to largest and test them in order against progressively looser thresholds (α/m, then α/(m−1), …). Uniformly more powerful than plain Bonferroni while giving the same FWER guarantee. A sensible default.',
    mt_bh_b:'Benjamini–Hochberg (FDR control).', mt_bh:'Instead of guarding against even one false positive, it controls the expected <em>fraction</em> of false positives among your significant results (the False Discovery Rate). Much more powerful when you screen many metrics, at the cost of allowing a controlled share of errors. The standard choice for large dashboards and exploratory analyses.',
    mt_omnibus_title:'🧪 Run the omnibus test first',
    mt_omnibus_body:'With 3+ variants, don\'t jump straight to pairwise comparisons. First run a single <strong>omnibus test</strong> — χ² for conversion, one-way ANOVA for continuous metrics — that asks one question: "is <em>any</em> variant different from the others?" Only if that comes back significant do you proceed to corrected pairwise tests to find <em>which</em> ones. This two-stage gate (the protected procedure) controls the error rate and stops you from fishing through pairs that the data never justified. This calculator follows exactly that order: χ² first, then Holm-corrected pairwise comparisons vs control.',
    mt_pick_title:'✅ Which to use',
    mt_pick_body:'A few pre-planned comparisons where any false positive is costly → <strong>Holm–Bonferroni</strong> (the recommended default). Screening many metrics where you can tolerate a small false-positive share for more discoveries → <strong>Benjamini–Hochberg</strong>. Plain Bonferroni is fine when m is small and you want the simplest defensible rule. Guardrail metrics that protect against regressions are usually left <em>uncorrected</em> — there you want maximum sensitivity.',
    ref_aatest_title:'Start here: the A/A test',
    ref_aatest_sub:'Before you trust any A/B result, prove your splitting platform is fair. An A/A test sends two identical experiences to two randomly split groups — and expects to find no difference.',
    aa_what_b:'What it is.', aa_what:'You run an experiment where A and B are exactly the same. Since nothing differs, any "winner" your tool reports is pure noise. It is the experiment equivalent of weighing an empty scale to check it reads zero.',
    aa_why_b:'Why juniors should start here.', aa_why:'Most splitting bugs are invisible until you look: a broken randomiser, users landing in both groups, bots skewing one side, or logging that double-counts. An A/A test surfaces all of these before a real test misleads you.',
    aa_read_b:'How to read it.', aa_read:'Expect a non-significant result (p &gt; 0.05) roughly 95% of the time. A single significant A/A result is not alarming — at α = 0.05, about 1 in 20 will trip by chance. Run several. If significants come up far more often than ~5%, your platform has a problem.',
    aa_srm_b:'Check the split ratio (SRM).', aa_srm:'If you asked for a 50/50 split, the group sizes should be very close. A large imbalance — a Sample Ratio Mismatch — means assignment is broken, and no result from that platform can be trusted until it is fixed.',
    aa_tip_title:'✅ Practical starting checklist',
    aa_tip_body:'1. Run an A/A test on your platform. 2. Confirm the split ratio matches what you configured. 3. Confirm the p-value is non-significant across a few runs. 4. Only then start real A/B tests. You can paste the two A/A group numbers into the Analyse tab and confirm "no clear winner" — exactly what you want to see.',
    ref_process_title:'The full A/B test process — step by step',
    ref_process_sub:'Tap each step to expand it. This is the path from a vague idea to a decision you can defend.',
    proc_step:'Step', proc_goal:'Goal', proc_example:'Example', proc_prev:'Back', proc_next:'Next',
    proc_hypo_t:'Form a hypothesis', proc_hypo_g:'Turn a hunch into a testable, falsifiable statement',
    proc_hypo_b:'A good hypothesis names the <strong>change</strong>, the <strong>expected effect</strong>, the <strong>metric</strong>, and a <strong>reason</strong>. "Because X, changing Y will move metric Z." Without this you cannot tell success from a story told after the fact.',
    proc_hypo_e:'Because the checkout button is easy to miss, making it larger and high-contrast will increase checkout conversion, because more users will notice it.',
    proc_metric_t:'Choose the metric', proc_metric_g:'Pick one primary metric, plus guardrails',
    proc_metric_b:'Decide your <strong>primary metric</strong> in advance (the one the decision rests on) and a few <strong>guardrail metrics</strong> that must not get worse. Choosing the metric after seeing data is how teams fool themselves.',
    proc_metric_e:'Primary: checkout conversion rate. Guardrails: average order value and refund rate (a bigger button should not attract accidental low-quality orders).',
    proc_size_t:'Plan the sample size', proc_size_g:'Decide how many users and for how long, before starting',
    proc_size_b:'Use the <strong>Plan tab</strong> to compute the sample size for your minimum detectable effect, α, and power. This fixes your stopping point in advance — the single most important defence against peeking and false positives.',
    proc_size_e:'To detect a 5% relative lift at α = 0.05 and 80% power, the calculator says you need ~30,000 users per arm — about two weeks at your traffic.',
    proc_aacheck_t:'Validate with an A/A test', proc_aacheck_g:'Prove the platform splits fairly before trusting it',
    proc_aacheck_b:'Run an <strong>A/A test</strong> (two identical groups). Confirm the split ratio matches what you set and that results are non-significant across a few runs. This catches randomiser bugs and tracking errors before they corrupt a real test.',
    proc_aacheck_e:'You split 50/50 and get 19,980 vs 20,020 users with p = 0.62 — balanced and non-significant. The platform is trustworthy.',
    proc_run_t:'Run the experiment', proc_run_g:'Collect data to the planned size without peeking',
    proc_run_b:'Launch both variants simultaneously to randomly assigned users and <strong>wait</strong>. Do not stop early because it "looks significant" — that inflates false positives. Run full business cycles (include weekends) to avoid day-of-week bias.',
    proc_run_e:'You run for the full two weeks even though day 3 looked promising — because stopping at the first good-looking moment is how noise gets mistaken for signal.',
    proc_analyse_t:'Analyse the results', proc_analyse_g:'Apply the right test and read it honestly',
    proc_analyse_b:'Paste your numbers into the <strong>Analyse tab</strong>. Use the Z-test for conversion, Welch\'s t for continuous metrics. Look at the confidence interval, not just the p-value — it tells you the plausible range of the true effect.',
    proc_analyse_e:'Variant B converts 3.4% vs 3.0%, a +13% relative lift, p = 0.01, CI [+4%, +22%]. Significant — and the whole interval is positive.',
    proc_decide_t:'Decide & interpret', proc_decide_g:'Translate statistics into a business decision',
    proc_decide_b:'A significant result is not automatically a <strong>ship</strong>. Weigh the effect size against implementation cost, check the guardrails held, and consider whether the lift is practically meaningful. A tiny but significant gain may not be worth the engineering.',
    proc_decide_e:'The +13% lift is significant and guardrails held, so you ship B — and document the result so the next person does not re-run the same test.',
    footer_privacy:'All calculations run locally in your browser — no data leaves your device.',
    // Accordion body — shared bold labels
    ab_formula:'Formula:',ab_assumptions:'Assumptions:',ab_examples:'Examples:',
    ab_ztest_w1_bold:'What it does:',
    // Z-test body
    ab_ztest_w1:'Tests whether two proportions (p₁, p₂) are statistically different.',
    ab_ztest_formula_note:'where p̂ is the pooled proportion.',
    ab_ztest_assumptions:'n·p ≥ 5 and n·(1−p) ≥ 5 for both groups. Violated with very low conversion rates and small samples.',
    ab_ztest_examples:'Signup rate, purchase rate, click-through rate, open rate, retention, trial-to-paid.',
    // Welch body
    ab_welch_w1:"Tests whether two group means differ, without assuming equal variances. Always safer than Student's t.",
    ab_welch_formula_note:'with Welch–Satterthwaite degrees of freedom.',
    ab_welch_assumptions:'Independence. For small n, approximate normality. For large n, CLT covers you.',
    ab_welch_examples:'ARPU, average session length, items in cart, 14-day spend.',
    // Ratio body
    ab_ratio_prob_bold:'The problem:',
    ab_ratio_prob:'Metrics like AOV or CTR per session have a varying denominator. Running a t-test on raw transactions treats each order as independent — but orders from the same user are correlated. This makes the standard error 2–10× too small, inflating false positives to 10–30%.',
    ab_ratio_safe_bold:'The safe approach:',
    ab_ratio_safe:'Aggregate to one value per user before testing.',
    ab_ratio_li1:"AOV per user = user's total revenue ÷ user's total orders",
    ab_ratio_li2:"CTR per session = user's total clicks ÷ user's total sessions",
    ab_ratio_conclusion:"Then run Welch's t on those per-user values. Users with zero denominator (zero orders) should be excluded or handled explicitly.",
    // Mann-Whitney body
    ab_mann_when_bold:'When to use:',
    ab_mann_when:'Heavily skewed distributions or n < 200 per arm, where outliers dominate and CLT has not fully applied.',
    ab_mann_tests_bold:'What it tests:',
    ab_mann_tests:'Stochastic dominance — whether a random value from B tends to exceed one from A. Does not test mean equality.',
    ab_mann_examples:'B2B contract values, enterprise deal sizes, early-stage metrics with thin data.',
    // Multi-variant body
    ab_multi_p1:'For binary outcomes: run χ² across the full contingency table first. If significant, follow with pairwise Z-tests using Bonferroni correction (α/k per pair, where k = number of pairs).',
    ab_multi_p2:"For continuous metrics with 3+ arms: one-way ANOVA, then pairwise Welch's t with Bonferroni or Holm–Bonferroni.",
    ab_multi_why_bold:'Why not just run all pairs at α = 0.05?',
    ab_multi_why:'With 3 variants you have 3 pairs — the family-wise error rate reaches ~14%. Bonferroni keeps it at 5%.',
    // Variance body
    ab_variance_intro:'High-variance metrics (ARPU, LTV) need enormous samples to detect meaningful lifts. Three ways to fix this:',
    ab_cuped_bold:'CUPED',ab_cuped_text:'Regress out a pre-experiment covariate (e.g. prior-period revenue). Typical variance reduction: 30–50%. Formula: Y_cuped = Y − θ·(X − E[X]), where θ = Cov(Y,X)/Var(X). Same expected value, much less noise.',
    ab_strat_bold:'Stratified randomisation',ab_strat_text:'Split users into strata (country, device tier) before assignment. Removes between-strata variance from the error term.',
    ab_winsor_bold:'Winsorisation',ab_winsor_text:'Cap values at the 99th percentile to stop whale users dominating. Apply the same cap to both variants before analysis.',
    // Novelty body
    ab_novelty_intro:'Users respond differently to something new (novelty) or resist change (primacy). Both distort early estimates.',
    ab_novelty_t1_bold:'Run for at least 2 full weeks',ab_novelty_t1:'to capture the full weekly cycle — weekday vs weekend behaviour differs for most products.',
    ab_novelty_t2_bold:'Segment by user tenure',ab_novelty_t2:'Novelty effects are strongest for returning users who notice the change; new users have no baseline to compare.',
    ab_novelty_t3_bold:'Check if the effect decays',ab_novelty_t3:"If week 1 shows +10% and week 3 shows +2%, the long-run impact is ~2%. Don't call a test on day 3.",
    // SRM body
    ab_srm_intro:'An SRM occurs when the actual split differs from the intended split. This indicates a bug and invalidates results even if p < 0.05.',
    ab_srm_t1_bold:'Detect it',ab_srm_t1:'Run a χ² test on observed variant counts vs. expected split. If p < 0.01, stop and investigate.',
    ab_srm_t2_bold:'Common causes',ab_srm_t2:'Bot filtering on one variant only; redirect assignment losing users; CDN caching; client-side events firing conditionally.',
    ab_srm_t3_bold:'Never adjust statistically',ab_srm_t3:'Fix the root cause and rerun from scratch.',
    // Peeking body
    ab_peeking_intro:'Stopping as soon as p < 0.05 inflates your actual error rate. With daily peeking over 4 weeks, it can reach 25%+.',
    ab_peeking_t1_bold:'Pre-register your MDE and plan',ab_peeking_t1:'before launch. Commit to running until you hit the planned sample size.',
    ab_peeking_t2_bold:'Sequential testing',ab_peeking_t2:'Methods like mSPRT let you peek continuously with controlled error rates. Worth it for high-velocity teams.',
    // Network body
    ab_network_intro:'Standard A/B testing assumes user independence. This breaks in social products, marketplaces, and referral loops.',
    ab_network_t1_bold:'Cluster randomisation',ab_network_t1:'Assign clusters of connected users (region, social graph) rather than individuals. Less power, less interference.',
    ab_network_t2_bold:'Holdout groups',ab_network_t2:'Keep a portion of users out of the experiment entirely to measure aggregate spillover.',
    ab_network_t3_bold:'Switchback experiments',ab_network_t3:'Alternate treatment and control in time windows. Common in ride-hailing and logistics.',
    // Multiple metrics body
    ab_multiple_intro:'Testing many metrics at once inflates the chance at least one looks significant by chance.',
    ab_mult_t1_bold:'Pre-register one primary metric',ab_mult_t1:'the decision hinges on it. Secondary metrics are directional signals only.',
    ab_mult_t2_bold:'Guardrail metrics',ab_mult_t2:'(revenue, latency, crash rate) — check without Bonferroni correction. You want maximum sensitivity to regressions.',
    ab_mult_t3_bold:'Benjamini–Hochberg FDR',ab_mult_t3:'If testing many metrics, BH correction is less conservative than Bonferroni while still disciplined.',
    // Tests-at-a-glance table
    tbl_g1c1:'Conversion / proportion',tbl_g1c3:'Binary outcome per user',
    tbl_g2c1:'Continuous per-user metric',tbl_g2c3:'One numeric value per user; handles unequal variances',
    tbl_g3c1:'Ratio metric (AOV, CTR…)',tbl_g3c2:"Aggregate → Welch's t",tbl_g3c3:'Compute one value per user, treat as continuous metric',
    tbl_g4c1:'Skewed / small n (<200)',tbl_g4c3:"When CLT hasn't kicked in; tests stochastic dominance",
    tbl_g5c1:'3+ variants on conversion',tbl_g5c3:'Run χ² first; pairwise Z with α/k if significant',
    // α/β power table body
    tbl_p1c1:'Increase n',tbl_p1c5:'SE shrinks like 1/√n',
    tbl_p2c1:'CUPED / stratification',tbl_p2c5:'Same as more data, achieved statistically',
    tbl_p3c1:'Raise α (0.05 → 0.10)',tbl_p3c5:'Lower rejection threshold',
    tbl_p4c1:'Lower α (0.05 → 0.01)',tbl_p4c5:'Higher rejection threshold',
    tbl_p5c1:'One-sided test',tbl_p5c5:'All α budget on one tail',
    tbl_p6c1:'Pre-register hypothesis',tbl_p6c5:'Prevents post-hoc shopping',
    // JS result strings
    js_variant_worse:'✗ Do not ship — variant B is significantly worse',
    js_variant_worse_cont:'✗ Do not ship — variant B performs significantly worse',
    js_ship:'✓ Ship it — the variant wins', js_no_winner:'✗ No clear winner yet',
    js_control_rate:'Control rate', js_variant_rate:'Variant rate',
    js_rel_lift:'Relative lift', js_margin:'95% margin of error',
    js_two_sided:'two-sided', js_one_sided:'one-sided',
    js_before_ship:'Before shipping:',
    js_guardrails:'Check guardrails: did revenue, retention, or other key metrics regress?',
    js_segments:'Check segments: is the lift consistent across mobile/desktop, country, plan?',
    js_low_data_title:'⚠️ Low data warning',
    ri_control:'Control (A)', ri_variant:'Variant (B)', ri_settings:'Settings',
    ri_users:'users', ri_conv:'conv', ri_mean:'mean', recent_no_inputs:'Parameters not available for this entry',
    toc_title:'On this page',
    toc_g1:'🚀 Getting started', toc_g2:'🧠 Core concepts', toc_g3:'🎯 Choosing your test', toc_g4:'📈 Distributions & theory', toc_g5:'🔬 Advanced & pitfalls',
    toc_g1_desc:'New to testing? Start here. Learn the vocabulary, see the whole process end to end, then validate your platform before you trust a single result.',
    toc_g2_desc:'The four ideas every result rests on: significance, the two ways to be wrong, how big a sample you need, and the confidence interval around your answer.',
    toc_g3_desc:'Which test fits your metric — and what each one actually means, in both statistical and business terms. Get this right before you analyse anything.',
    toc_g4_desc:'Why your data looks the way it does, and why averages behave so predictably at scale. The intuition that makes every test make sense.',
    toc_g5_desc:'Techniques to make tests sharper, and the traps that quietly invalidate results — peeking, and testing too many things at once.',
    toc_cifac_short:'What widens a confidence interval', toc_choose_short:'Z-test vs t-test: which and why',
    toc_cuped_short:'CUPED variance reduction', toc_peeking_short:'Why peeking inflates errors',
    toc_split_short:'Unequal traffic splits (e.g. 90/10)',
    ref_split_title:'Unequal traffic splits: when 50/50 is too risky',
    ref_split_sub:"Sometimes you can't send half your users to an untested change — it may be expensive, risky, or operationally heavy. You can send a smaller slice (say 10%) to the variant. That safety has a real statistical cost.",
    split_intro:'<strong>The trade-off in one sentence:</strong> a 50/50 split is the most statistically efficient — it reaches significance with the fewest total users — but an uneven split (e.g. 90/10) exposes far fewer people to a risky variant, at the cost of needing more total traffic and more time.',
    split_chart_title:'Total users needed vs how uneven the split is',
    split_chart_sub:'Baseline 5%, detecting a +10% relative lift at 95% confidence, 80% power. Drag to set the share going to the variant.',
    split_formula_label:'At this split', split_var_label:'variant gets', split_total_label:'total users needed', split_vs_label:'vs 50/50',
    split_slider_label:'Share to variant:', split_axis:'share of traffic sent to the variant', split_best:'(most efficient)',
    split_why_b:'Why you\'d do it.', split_why:'A pricing change, a new checkout flow, or anything with revenue or support risk. A 10% exposure caps your downside: if the variant is bad, only 10% of users feel it.',
    split_power_b:'Effect on power.', split_power:'Power is driven by the <em>smaller</em> arm. Shrinking the variant to 10% starves it of data, so to keep 80% power you must enlarge the whole experiment — the control arm balloons to compensate. Net effect: more total users than a balanced test.',
    split_time_b:'Effect on duration.', split_time:'The variant arm fills slowly because it only gets a thin slice of daily traffic. With the same total traffic, a 90/10 test can take roughly 2–3× longer than 50/50 to reach the needed numbers — the small arm is the bottleneck.',
    split_rule_b:'Rule of thumb.', split_rule:'50/50 is optimal for speed and sample efficiency. Don\'t go more extreme than you need: 80/20 costs ~60% more total users than 50/50, while 90/10 costs nearly 3×. Use the mildest imbalance that keeps the risk acceptable.',
    split_tip_title:'💡 Practical guidance',
    split_tip_body:"Start risky or expensive changes on a small slice (5–10%) to confirm nothing breaks, then — if it's safe — ramp toward 50/50 to gather evidence efficiently. If you must keep a small exposure for the whole test, plan for the longer runtime up front and check that your traffic can realistically reach the variant's required sample within your timeframe.",
    toc_samplesize_short:'Sample size vs MDE', toc_distshapes_short:'Catalog of distribution shapes', toc_dice_short:'Worked example: two dice',
    toc_clt_short:'The Central Limit Theorem', toc_checknorm_short:'When to check for normality',
    toc_distcases_short:'Case studies: checking distributions', toc_usecases_short:'Matching the test to the situation',
    btn_dl_png:'PNG', recent_title:'Recent results', recent_clear:'Clear',
    recent_just_now:'just now', recent_min:'min ago', recent_hr:'h ago', recent_day:'d ago',
    js_err_fill_variant:'Please fill in all variant data (users and conversions) before analysing.',
    js_err_need_two:'You need at least 2 variants to run a comparison.',
    js_err_paste_values:'Please paste values, or fill in mean + SD + n for both variants.',
    js_err_paste_ratio:'Please paste per-user ratio values, or fill in mean + SD + n for both variants.',
    js_low_data_body:'Only {n} total conversions observed. Results may be unreliable — a small number of events makes the test highly sensitive to random fluctuation. Collect more data before making a decision.',
    js_not_sig:'Not significant yet.',
    js_keep_running:'Keep running until you hit your planned sample size. Stopping early inflates false positives.',
    js_control_avg:'Control avg', js_variant_avg:'Variant avg',
    js_ctrl_var:'SD (ctrl / var)', js_cv_ctrl_var:'CV (ctrl / var)',
    js_results_conv:'Results — Conversion test',
    js_results_cont:"Results — Continuous metric (Welch's t-test)",
    js_results_ratio:"Results — Ratio metric (Welch's t on aggregated per-user values)",
    js_variants_diff:'✓ Variants are meaningfully different',
    js_best_variant:'Best variant', js_vs_control:'vs control', js_holm_col:'Holm', js_holm_sig:'significant', js_holm_ns:'not sig.', js_holm_note:'Pairwise comparisons (each variant vs control A) use the Holm–Bonferroni step-down correction across {k} comparisons — uniformly more powerful than plain Bonferroni while controlling the family-wise error rate at α = {a}.', lbl_control_word:'control',
    js_no_diff:'✗ No significant difference detected',
    js_conv_ci:'Conversion rates with 95% confidence intervals',
    js_conv_ci_sub:'Bars are observed rates; whiskers are CIs. Non-overlapping intervals roughly imply a significant difference.',
    js_null_dist:'How your observed difference compares to the null distribution',
    js_null_dist_sub:'Under H₀ the difference should sit near zero. The orange marker is what you observed — the red areas are rejection zones at α =',
    js_avg_ci:'Average values with 95% confidence intervals',
    js_avg_ci_sub:'Bars are observed averages; whiskers are CIs. Non-overlapping intervals roughly imply a significant difference.',
    js_ratio_ci:'Ratio values with 95% confidence intervals',
    js_ratio_ci_sub:'Bars are observed per-user averages of the ratio; whiskers are CIs.',
    js_control_lbl:'Control (A)', js_variant_lbl:'Variant (B)',
    js_result_conv_note:'Result assumes data is correctly aggregated.',

  },
  ru: {
    site_title:'Калькулятор A/B-тестов',
    site_subtitle:'Выберите метрику, введите данные и получите обоснованное решение — с правильным статистическим тестом для вашей задачи.',
    tab_plan:'Спланировать тест', tab_analyse:'Анализ результатов', tab_reference:'Теория',
    theme_dark:'Тёмная', theme_light:'Светлая',
    step1:'Шаг 1', step2:'Шаг 2', step3:'Шаг 3',
    step2_variant:'Шаг 2 · Данные вариантов',
    step2_variant_agg:'Шаг 2 · Данные вариантов (агрегированные)',
    step3_params:'Шаг 3 · Параметры',
    plan_step1_heading:'Что вы измеряете?',
    plan_step1_sub:'Выберите тип метрики — от этого зависит правильный статистический тест.',
    plan_conv_label:'Конверсия',
    plan_conv_desc:'Да/нет на пользователя — регистрации, покупки, клики, удержание',
    plan_cont_label:'Непрерывная метрика',
    plan_cont_desc:'Одно непрерывное значение на пользователя — ARPU, время сессии, товары в корзине',
    plan_ratio_label:'Метрика-отношение',
    plan_ratio_desc:'Показатель с переменным знаменателем — AOV, CTR на сессию, товары в заказе',
    plan_step2_heading:'Ваши данные', plan_step3_heading:'Параметры теста',
    plan_duration_heading:'Сколько времени займёт?',
    plan_duration_hint:'Введите ежедневный трафик для расчёта длительности эксперимента.',
    plan_daily_users_short:'Ежедневный трафик', plan_daily_users_tip:'пользователи, которые могут войти в тест',
    plan_num_variants_short:'Количество вариантов', plan_num_variants_tip:'включая контроль',
    plan_daily_users:'Ежедневный трафик — пользователи, которые могут войти в тест',
    plan_num_variants:'Количество вариантов — включая контроль',
    plan_baseline_conv:'Базовая конверсия (%) — например, 4.8 означает 4.8%',
    plan_mde_conv:'Минимальный обнаруживаемый эффект (% относительный) — например, 10 = +10%',
    plan_baseline_mean:'Базовое среднее — текущее значение',
    plan_sd_label:'Стандартное отклонение — из исторических данных',
    plan_mde_cont:'Минимальный обнаруживаемый эффект (% относительный)',
    plan_cuped_label:'Снижение дисперсии CUPED (%) — 0 если не используется; обычно 30–50%',
    btn_calculate:'Рассчитать', btn_analyse:'Анализировать',
    btn_add_variant:'+ Добавить вариант', btn_summary_stats:'ввести сводную статистику вручную',
    lbl_exposed:'Показано', lbl_converted:'Конвертировано',
    lbl_significance:'Уровень значимости (α)', lbl_hypothesis:'Гипотеза',
    lbl_two_sided:'Двусторонняя', lbl_one_sided:'Односторонняя',
    lbl_prereg_mde:'Заранее зарегистрированный MDE (%, необязательно)',
    lbl_upload:'Загрузить файл Excel / CSV',
    lbl_upload_hint:'Столбцы: variant и value (или определим автоматически)',
    lbl_or_paste:'или вставьте значения ниже',
    lbl_per_user_values:'Значения на пользователя — через запятую или пробел',
    lbl_per_user_ratio:'Значения отношений на пользователя — через запятую или пробел',
    cont_hint:'Каждое значение = метрика одного пользователя (например, его выручка за неделю).',
    ratio_hint:'Каждое значение = отношение одного пользователя (например, его AOV или CTR).',
    ratio_agg_title:'Сначала агрегируйте данные до одного значения на пользователя.',
    lbl_power:'Мощность (1 − β)',
    ref_distcases_title:'Кейсы: нужно ли проверять распределение?',
    dc1_tag:'✅ Кейс 1 · Можно пропустить', dc1_title:'Конверсия оформления, 40 000 пользователей на группу',
    dc1_p:'Команда тестирует новую кнопку оформления. Метрика бинарная — конвертировал или нет — и в каждой группе 40 000 пользователей. Кто-то спрашивает, нужно ли сначала проверить нормальность.',
    dc1_s1_b:'Данные:', dc1_s1:'Доля (≈3% конвертируют). Сырые данные — это просто нули и единицы, максимально далеко от колокола.',
    dc1_s2_b:'Решение:', dc1_s2:'Проверка не нужна. При десятках тысяч пользователей выборочное распределение доли практически нормально по ЦПТ. Z-тест корректен.',
    dc1_t_b:'Урок:', dc1_t:'Для долей в масштабе нормальность сырых данных не важна — важен только размер выборки, а здесь он огромен.',
    dc2_tag:'⚠️ Кейс 2 · Проверять обязательно', dc2_title:'Выручка на пользователя, 80 клиентов в B2B-пилоте',
    dc2_p:'B2B-компания пилотирует изменение цены всего на 80 клиентах в группе. Метрика — выручка на аккаунт, и две корпоративные сделки затмевают всех остальных.',
    dc2_s1_b:'Данные:', dc2_s1:'Сильно скошены вправо с тяжёлыми выбросами, и выборка мала (n = 80). ЦПТ для такой скошенной метрики при таком размере надёжно не сработала.',
    dc2_s2_b:'Решение:', dc2_s2:'Проверьте форму. Гистограмма показывает скос; среднее и медиана далеки друг от друга. Обычный t-тест здесь хрупок — ещё один «кит» может перевернуть результат.',
    dc2_t_b:'Урок:', dc2_t:'Используйте Манна–Уитни, логарифм или отчитывайтесь медианой. Малое n плюс тяжёлый скос — единственная комбинация, когда смотреть действительно обязательно.',
    dc3_tag:'🐫 Кейс 3 · Скрытая ловушка', dc3_title:'Длительность сессии, которая казалась нормальной',
    dc3_p:'Команда анализировала среднюю длительность сессии при 5 000 пользователей на группу — вполне много — и доверилась t-тесту. Результат был значим, но раскатка ничего не изменила.',
    dc3_s1_b:'Что они упустили:', dc3_s1:'Распределение было бимодальным — пик отказов около 0 секунд и второй горб вовлечённых пользователей. «Среднее» оказалось в пустой долине между двумя группами, не описывая никого.',
    dc3_s2_b:'Исправление:', dc3_s2:'Сначала сегментируйте. Разделение отказов и вовлечённых сессий показало, что изменение затронуло лишь одну группу. Общее среднее это скрыло.',
    dc3_t_b:'Урок:', dc3_t:'Большая выборка защищает корректность <em>теста</em>, но не вашу интерпретацию. Всегда смотрите на форму — бимодальность это сигнал сегментировать, а не усреднять.',
    ref_usecases_title:'Подбор теста под ситуацию',
    uc_intro:'Помимо нормальности, форма распределения часто подсказывает, какой тест или метрику выбрать. Несколько типичных продуктовых ситуаций:',
    uc1_b:'Выручка / средний чек (скошено вправо):', uc1:'Отчитывайтесь средним для бизнес-эффекта, но добавляйте медиану и рассмотрите CUPED для снижения дисперсии. При большом n t-тест подходит; при малом — Манна–Уитни.',
    uc2_b:'Время до события / задержка (экспоненциальное):', uc2:'Средние определяются хвостом. Предпочитайте перцентили (p50, p95) и рассмотрите логарифм перед тестом средних.',
    uc3_b:'Счётчики на пользователя (как Пуассон):', uc3:'Заказы на пользователя, ошибки за сессию. Среднее осмысленно, но дисперсия растёт со средним — Welch t (неравные дисперсии) безопасный выбор по умолчанию.',
    uc4_b:'Смешанные популяции (бимодальное):', uc4:'Сегментируйте перед тестом. Единое среднее по двум разным группам обычно вводит в заблуждение, какой бы большой ни была выборка.',
    uc5_b:'Бинарные исходы (доли):', uc5:'Конверсия, клик, регистрация. Используйте Z-тест; нормальность сырых данных не важна, важно лишь достаточно событий (правило: хотя бы ~10 конверсий в каждой группе).',
    ref_choose_title:'Z-тест и t-тест: какой выбрать и почему',
    ref_choose_sub:'Самый частый вопрос — и самый важный по последствиям. Правильный тест зависит от одного: какое число даёт ваша метрика на пользователя.',
    ch_intro:'<strong>Решающий вопрос:</strong> каждый пользователь — это «да/нет» или число? Ответ выбирает тест. Остальное — детали.',
    ch_use:'Когда применять', ch_stat:'Со стороны статистики', ch_biz:'Со стороны бизнеса',
    ch_z_h:'Z-тест — для конверсии / долей',
    ch_z_use:'каждый пользователь — бинарный исход: конвертировал или нет, кликнул или нет, зарегистрировался или нет.',
    ch_z_stat:'Сравнивает две доли. Для бинарной переменной разброс задан самой долей (дисперсия = p(1−p)), поэтому, зная конверсию, вы уже знаете изменчивость — больше ничего не нужно. При тысячах пользователей доля практически нормальна, так что Z-тест (нормальный) достаточно точен.',
    ch_z_biz:'Отвечает: «значимо ли большая доля пользователей совершила действие?» Конверсия оформления, регистрация, кликабельность письма. Нужно лишь два числа на группу — скольким показали и сколько конвертировали.',
    ch_t_h:'t-тест (Уэлча) — для непрерывных метрик',
    ch_t_use:'каждый пользователь даёт число, которое может свободно меняться: выручка, длина сессии, товары в корзине, дни удержания.',
    ch_t_stat:'Сравнивает два средних. В отличие от доли, разброс непрерывной метрики <em>не</em> определяется её средним — две группы могут иметь одинаковое среднее, но сильно разную дисперсию — поэтому тест должен оценить разброс по данным. Версия Уэлча не предполагает равенства дисперсий, что делает её безопасным выбором. («t» учитывает дополнительную неопределённость оценки разброса; при большом n он сходится к Z-тесту.)',
    ch_t_biz:'Отвечает: «изменилось ли среднее значение на пользователя?» ARPU, средний чек, время на сайте. Нужны среднее, стандартное отклонение и размер выборки по каждой группе — разброс важен не меньше среднего.',
    ch_key_title:'🔑 Причина различия одной строкой',
    ch_key_body:'Для <strong>доли</strong> ставка фиксирует дисперсию — поэтому достаточно сводных счётчиков (Z-тест). Для <strong>непрерывной</strong> величины среднее и разброс независимы — поэтому разброс надо измерять отдельно, и t-тест создан, чтобы справляться с этой неопределённостью.',
    ch_ratio_b:'Ratio-метрики (средний чек, CTR за сессию):', ch_ratio:'у них меняющийся знаменатель. Посчитайте одно значение на пользователя, затем считайте его непрерывной метрикой и применяйте t Уэлча.',
    ch_mw_b:'Скошенные данные при малом n (<200):', ch_mw:'когда ЦПТ ещё не сгладила картину, перейдите к критерию Манна–Уитни, который сравнивает ранги и не предполагает конкретной формы.',
    ch_multi_b:'3+ варианта:', ch_multi:'сначала омнибус-тест (χ² для конверсии, ANOVA для непрерывных), затем скорректированные парные сравнения — см. «Множественное тестирование» ниже.',
    ref_tests_title:'Тесты: краткий обзор', ref_how_title:'Как работает каждый тест',
    ref_limits_title:'Ограничения и как их преодолеть',
    ref_abp_title:'Как связаны α, β и мощность',
    toc_glossary_short:'Глоссарий простым языком',
    ref_glossary_title:'Глоссарий простым языком: термины с примерами',
    ref_glossary_sub:'Каждый термин A/B-тестирования без жаргона — и с конкретным примером. Начните здесь, если словарь пугает.',
    gl_eg:'Пример:',
    gl_null_t:'Нулевая гипотеза (H₀)',
    gl_null_d:'Исходное предположение, что между вариантами <strong>нет реальной разницы</strong> — любой разрыв это просто случайность. Тест пытается собрать достаточно доказательств, чтобы её отвергнуть.',
    gl_null_e:'«Новая кнопка оформления конвертит ровно так же, как старая.» Вы запускаете тест в надежде это опровергнуть.',
    gl_pval_t:'P-value',
    gl_pval_d:'Вероятность увидеть разницу <strong>не меньше</strong> наблюдаемой, <em>если бы варианты были одинаковы</em>. Маленький p-value означает «такой разрыв был бы удивителен, если бы ничего не происходило» — значит, что-то происходит.',
    gl_pval_e:'p = 0,03 значит: если кнопка на самом деле ничего не меняла, такой разрыв случился бы по удаче лишь в 3% случаев. Достаточно редко, чтобы счесть эффект реальным. Это <strong>не</strong> значит «97% вероятность, что кнопка лучше» — частая ловушка.',
    gl_alpha_t:'Уровень значимости (α)',
    gl_alpha_d:'Планка, заданная <em>заранее</em>: насколько мал должен быть p-value, чтобы назвать результат «значимым». Это и есть принятая доля ложных срабатываний. Обычно 0,05.',
    gl_alpha_e:'α = 0,05 значит, что вы принимаете шанс 1 к 20 быть обманутым шумом и объявить победителя, которого нет.',
    gl_sig_t:'Статистическая значимость',
    gl_sig_d:'Результат «статистически значим», когда его p-value ниже вашего α. Это значит, что разница вряд ли случайна — <strong>а не</strong> что она велика или важна.',
    gl_sig_e:'Прирост 0,1% может быть значимым при миллионах пользователей, но слишком мал для бизнеса. Значимо ≠ важно.',
    gl_ci_t:'Доверительный интервал (ДИ)',
    gl_ci_d:'<strong>Диапазон правдоподобных значений</strong> истинного эффекта вместо одного числа. 95% ДИ значит: если повторять эксперимент много раз, около 95% построенных интервалов содержали бы истинное значение. Шире интервал — больше неопределённости.',
    gl_ci_e:'Пример:',
    gl_ci_e2:'Прирост «+8% с 95% ДИ [+2%, +14%]» говорит, что реальный эффект, вероятно, между +2% и +14%. Раз весь диапазон выше нуля, можно быть уверенным в реальном улучшении. Если бы ДИ был [−3%, +19%], он пересекает ноль — нельзя исключить отсутствие эффекта (или даже вред).',
    gl_power_t:'Статистическая мощность',
    gl_power_d:'Шанс, что тест <strong>обнаружит реальный эффект</strong>, если он существует. Низкая мощность — можно пропустить настоящего победителя. Стандартная цель — 80%.',
    gl_power_e:'Мощность 80% значит: если новая кнопка действительно лучше, у вас 80% шанс это поймать — и 20% шанс пропустить из-за слишком малой выборки.',
    gl_mde_t:'Минимальный обнаружимый эффект (MDE)',
    gl_mde_d:'<strong>Наименьшее улучшение, которое стоит ловить</strong>. Вы задаёте его до теста — оно определяет, сколько нужно пользователей. Меньше MDE — намного больше выборка.',
    gl_mde_e:'«Мне важно, только если кнопка поднимает конверсию хотя бы на 5%.» Обнаружить прирост 5% нужно куда меньше пользователей, чем 1%.',
    gl_ss_t:'Размер выборки',
    gl_ss_d:'Сколько пользователей нужно на вариант, чтобы надёжно обнаружить ваш MDE при выбранных α и мощности. Слишком мало — тест недостаточно мощный; вкладка «План» считает это за вас.',
    gl_ss_e:'Чтобы заметить прирост 5% на базе 3% при мощности 80%, может понадобиться ~50 000 пользователей на группу — около двух недель при обычном трафике.',
    gl_vs_t:'P-value и α — в чём разница?',
    gl_vs_d:'Их легко перепутать, но это <strong>вещи противоположного рода</strong>. <strong>α — это порог, который вы выбираете до теста</strong>: фиксированный, заданный вами, одинаковый каждый раз. <strong>P-value — это число, которое выдают данные после теста</strong>: оно меняется в каждом эксперименте. Вы сравниваете одно с другим: если <em>p &lt; α</em>, результат значим.',
    gl_vs_e_b:'Представьте экзамен:', gl_vs_e:'α — это <strong>проходной балл, заданный заранее</strong> (скажем, 60%). P-value — это <strong>оценка, которую студент реально получил</strong> (скажем, 73%). Проходной балл — ваше правило; оценка — это свидетельство. Сказать «p-value и α — одно и то же» всё равно что сказать, что проходной балл и оценка — одно и то же.',
    ref_cifac_title:'Что делает доверительный интервал шире или уже?',
    ref_cifac_sub:'Ширина ДИ — это его неопределённость. На неё влияют три вещи, и размер выборки вы контролируете напрямую.',
    cifac_chart_title:'Доверительный интервал сужается с ростом выборки',
    cifac_chart_sub:'95% ДИ для конверсии 30%. Двигайте ползунок: интервал сужается пропорционально 1/√n — чтобы вдвое сузить, нужно вчетверо больше пользователей.',
    cifac_formula_label:'95% предельная ошибка (полуширина)', cifac_slider_label:'Пользователей на группу (n):', cifac_axis:'пользователей на группу (n) — лог. шкала',
    cifac_f1_b:'Размер выборки (n) — главный рычаг.', cifac_f1:'Больше данных — меньше неопределённости. Ширина убывает как 1/√n: с 1 000 до 4 000 пользователей она уменьшается вдвое, а с 1 000 до 2 000 — лишь на ~30%. Убывающая отдача.',
    cifac_f2_b:'Изменчивость (разброс) данных.', cifac_f2:'Более шумные метрики дают более широкие интервалы. Для доли разброс задан самой долей (максимум около 50%); для выручки или времени несколько выбросов расширяют ДИ — поэтому помогают приёмы снижения дисперсии вроде CUPED.',
    cifac_f3_b:'Выбранный уровень доверия.', cifac_f3:'Чем больше доверия требуется, тем шире интервал: 99% ДИ шире 95%, а тот шире 90%. Больше уверенности — ценой точности.',
    cifac_tip_title:'💡 Почему это важно на практике',
    cifac_tip_body:'Широкий ДИ, пересекающий ноль, — это данные, говорящие «пока не могу исключить отсутствие эффекта». Обычное решение — больше пользователей, но из-за правила 1/√n обнаружение всё меньших эффектов быстро дорожает. Именно этот компромисс вкладка «План» оценивает, рассчитывая размер теста.',
    gl_errors_t:'Ошибки I и II рода',
    gl_errors_d:'<strong>Ошибка I рода</strong> (ложноположительная) — объявить победителя, которого нет. <strong>Ошибка II рода</strong> (ложноотрицательная) — пропустить настоящего победителя. α контролирует первую, мощность — вторую.',
    gl_errors_e:'Запустить кнопку, которая ничего не делает = I рода. Убить кнопку, которая работала = II рода.',
    ref_chart1_title:'Как работает статистическая значимость',
    ref_chart1_sub:'Нулевая гипотеза предполагает отсутствие реального эффекта. Если статистика теста попадает в зону отклонения (|Z| > zα), мы отвергаем H₀. Показано α = 0.05.',
    ref_chart2_title:'Ошибки I и II рода',
    ref_chart2_sub:'Распределения H₀ (синее) и H₁ (оранжевое) перекрываются. Красный хвост = α (ложноположительный). Серая область = β (пропущенный эффект). Мощность = 1 − β.',
    ref_chart3_title:'Размер выборки и минимальный обнаруживаемый эффект',
    ref_chart3_sub:'Обнаружение меньших эффектов требует экспоненциально больше пользователей. Уменьшение MDE вдвое примерно учетверяет объём выборки (α = 0.05, мощность = 80%).',
    ref_chart4_title:'Как мощность растёт с размером выборки',
    ref_chart4_sub:'При фиксированном MDE 5% и α = 0.05 мощность растёт с n. Пунктирные линии — стандартные пороги 80% и 90%.',
    ref_chart5_title:'CUPED: как снижение дисперсии уменьшает нужную выборку',
    ref_chart5_sub:'CUPED убирает доэкспериментальный шум. Двигайте ползунок, чтобы увидеть, как процент снижения дисперсии сокращает необходимый размер выборки.',
    ref_cuped_slider_label:'Снижение дисперсии:',
    ref_chart6_title:'Почему подглядывание завышает долю ложноположительных',
    ref_chart6_sub:'Каждый лишний взгляд на данные даёт ложноположительному результату ещё один шанс превысить 5%. Двигайте ползунок, чтобы увидеть рост реальной ошибки.',
    ref_peek_slider_label:'Число подглядываний:',
    cuped_bar_base:'Без CUPED', cuped_bar_cuped:'С CUPED', cuped_savings:'меньше пользователей',
    peek_actual:'реальная доля FP', peek_axis:'Сколько раз вы подглядываете',
    gl_cuped:'Техника снижения дисперсии: вычитает предсказуемый доэкспериментальный шум из метрики, чтобы нужно было меньше данных. Подробно описана ниже.',
    cs_tag:'📘 Кейс',
    cs_title:'StreamFlix тестирует новый процесс оформления заказа',
    cs_intro:'StreamFlix хочет узнать, повышает ли оформление в один клик среднюю выручку на пользователя (ARPU). ARPU крайне шумная — несколько покупателей годовых планов доминируют, поэтому стандартное отклонение огромно относительно среднего.',
    cs_s1_b:'Проблема без CUPED:', cs_s1:'Базовый ARPU — $12.00 при SD $48.00 (CV = 4.0). Чтобы обнаружить прирост 3% при мощности 80%, нужно ≈ 168 000 пользователей на группу — около 6 недель трафика.',
    cs_s2_b:'Применяем CUPED:', cs_s2:'Траты каждого пользователя за 4 недели до теста (X) коррелируют с тратами во время теста (Y) с ρ = 0.6. CUPED вычитает эту предсказуемую часть: Y_cuped = Y − θ·(X − X̄).',
    cs_s3_b:'Результат:', cs_s3:'Дисперсия падает на ρ² = 0.36 — снижение на 36%. Эффективное SD падает с $48 до $38.40. Нужный размер выборки снижается до ≈ 107 500 на группу — решение принимается почти на 2 недели раньше, без изменения оценки прироста.',
    cs_takeaway_b:'Вывод:', cs_takeaway:'CUPED не изменил ответ — он привёл к тому же ответу быстрее. Чем шумнее метрика и чем сильнее корреляция с доэкспериментальным периодом, тем больше выигрыш.',
    ref_deepdive_title:'Подробно: CUPED шаг за шагом',
    dd_cuped_p1:'CUPED (использование доэкспериментальных данных) — самый мощный приём в современном экспериментировании. Идея: пользователь, много потративший в прошлом месяце, вероятно много потратит и сейчас, независимо от вашего изменения. Эту предсказуемую часть — шум — можно вычесть.',
    dd_cuped_s1_b:'Выберите ковариату X', dd_cuped_s1:'доэкспериментальное измерение, коррелирующее с метрикой Y. Выручка предыдущего периода — классический выбор для тестов ARPU.',
    dd_cuped_s2_b:'Оцените θ', dd_cuped_s2:'θ = Cov(Y, X) / Var(X). Это просто наклон регрессии Y на X по всем пользователям эксперимента.',
    dd_cuped_s3_b:'Преобразуйте Y', dd_cuped_s3:'Y_cuped = Y − θ·(X − X̄). Среднее не меняется (оценка прироста остаётся несмещённой), но дисперсия падает.',
    dd_cuped_s4_b:'Запустите тест на Y_cuped', dd_cuped_s4:'Снижение дисперсии равно ρ², где ρ — корреляция между Y и X. Корреляция 0.7 снижает дисперсию на ~49%.',
    dd_cuped_p2:'Поскольку нужный размер выборки линейно зависит от дисперсии, снижение дисперсии на 50% означает достижение значимости вдвое быстрее — или обнаружение вдвое меньшего эффекта за то же время. Поэтому CUPED используют все крупные платформы.',
    ref_lifecycle_title:'Жизненный цикл эксперимента',
    dd_lc_1_b:'1. Гипотеза', dd_lc_1:'Сформулируйте изменение, метрику и направление. «Крупнее кнопка CTA → выше конверсия в регистрацию».',
    dd_lc_2_b:'2. Анализ мощности', dd_lc_2:'Определите бизнес-значимый MDE, затем рассчитайте размер выборки и длительность до запуска. (Для этого есть вкладка «Спланировать».)',
    dd_lc_3_b:'3. Запуск', dd_lc_3:'Запустите, проверьте SRM в первые часы, затем не трогайте минимум один полный бизнес-цикл (обычно 1–2 недели). Без подглядывания.',
    dd_lc_4_b:'4. Анализ', dd_lc_4:'При запланированном размере выборки запустите нужный тест, проверьте охранные метрики и ключевые сегменты. (Вкладка «Анализ».)',
    dd_lc_5_b:'5. Решение и документация', dd_lc_5:'Внедрить, доработать или отказаться. Записывайте результат в любом случае — отрицательные результаты избавляют команду от повторения мёртвых идей.',
    ref_dist_title:'Каталог форм распределений',
    ref_dist_sub:'Реальные метрики редко выглядят как учебный колокол. Вот восемь форм, которые встречаются чаще всего — плавные кривые для непрерывных метрик, столбцы для дискретных счётчиков.',
    dist_normal:'Нормальное', dist_skew:'Скошенное вправо', dist_leftskew:'Скошенное влево', dist_bimodal:'Бимодальное', dist_uniform:'Равномерное', dist_triangular:'Треугольное (2 кости)', dist_exponential:'Экспоненциальное', dist_poisson:'Пуассона (счётчики)', dist_heavy:'Тяжёлые хвосты (выбросы)',
    ref_disttypes_title:'Путеводитель по распределениям',
    dt_normal_b:'Нормальное (симметричное).', dt_normal:'Классический колокол — значения группируются вокруг среднего и симметрично убывают в обе стороны. Рост, ошибки измерений и выборочные средние выглядят так. Большинство учебных тестов предполагают именно его.',
    dt_skew_b:'Скошенное вправо (положительная асимметрия).', dt_skew:'Длинный хвост справа. Выручка, средний чек, время на странице и LTV почти всегда такие — большинство тратит мало, немногие много. Среднее оказывается выше медианы.',
    dt_leftskew_b:'Скошенное влево (отрицательная асимметрия).', dt_leftskew:'Длинный хвост слева. Реже в продуктовых данных, но встречается, например, в оценках экзамена у потолка или днях до оттока у лояльной базы — большинство значений высокие, немногие очень низкие.',
    dt_bimodal_b:'Бимодальное.', dt_bimodal:'Два пика, обычно означающих две скрытые подгруппы — например, бесплатные и платные пользователи или мобайл и десктоп. Часто сигнал, что нужно сегментировать перед анализом.',
    dt_uniform_b:'Равномерное.', dt_uniform:'Каждое значение равновероятно — плоская линия. Одна честная кость — классический пример. Редко в реальных метриках, но основа для симуляций и рандомизации.',
    dt_triangular_b:'Треугольное (сумма костей).', dt_triangular:'Форма из вопроса выше: бросьте две кости и сложите — суммы образуют треугольник с пиком на 7. Возникает при сложении двух равномерных величин — и намекает на глубинное правило, что суммирование толкает к колоколу.',
    dt_exponential_b:'Экспоненциальное.', dt_exponential:'Резкий спад от пика в нуле. Моделирует время ожидания — между покупками, до первого действия, паузы между сессиями. Без памяти: прошлое не меняет ожидаемое время.',
    dt_poisson_b:'Пуассона (счётчики).', dt_poisson:'Для подсчёта редких событий в фиксированном окне — заказы в день, ошибки за сессию, тикеты в час. Дискретное, с уклоном вправо, задаётся одним параметром интенсивности.',
    dt_heavy_b:'Тяжёлые хвосты.', dt_heavy:'В целом похоже на нормальное, но с редкими крайними выбросами далеко от центра. Одна крупная покупка или сессия бота может оказаться далеко в хвосте и исказить среднее и дисперсию.',
    toc_anatomy_short:'Анатомия: среднее, медиана, мода и SD',
    ref_anatomy_title:'Анатомия распределения: среднее, медиана, мода и разброс',
    ref_anatomy_sub:'Распределение описывают три «центра» — мода (пик), медиана (срединное значение) и среднее. Их взаимное расположение сразу выдаёт форму. Разброс измеряется в стандартных отклонениях (SD).',
    anat_normal_h:'Нормальное — правило 68–95–99,7',
    anat_normal_p:'В идеально симметричном нормальном распределении <strong>среднее = медиана = мода</strong> — все три в центре. Разброс подчиняется эмпирическому правилу: около <strong>68%</strong> значений попадают в ±1 SD от среднего, <strong>95%</strong> — в ±2 SD, и <strong>99,7%</strong> — в ±3 SD. Лишь ~0,3% лежат за пределами ±3 SD — поэтому событие в три сигмы считается редким.',
    anat_right_h:'Скошенное вправо — среднее тянется к хвосту',
    anat_right_p:'При длинном правом хвосте порядок такой: <strong>мода &lt; медиана &lt; среднее</strong>. Пик (мода) слева, где сгруппировано большинство значений; немногие большие значения в хвосте тянут среднее вправо, за медиану. Так ведут себя выручка и средний чек — поэтому средняя выручка на пользователя почти всегда выше, чем тратит типичный пользователь. Разброс асимметричен: значения уходят гораздо дальше вверх от среднего, чем вниз.',
    anat_left_h:'Скошенное влево — зеркальное отражение',
    anat_left_p:'Длинный левый хвост переворачивает порядок: <strong>среднее &lt; медиана &lt; мода</strong>. Пик справа, где скучивается большинство значений, а немногие малые значения тянут среднее влево. Представьте оценки экзамена, где большинство справляется хорошо, но несколько проваливаются, или возраст, в котором лояльная когорта наконец уходит. Здесь типичное значение (мода) выше среднего.',
    anat_binom_h:'Биномиальное — подсчёт успехов',
    anat_binom_p:'Биномиальное распределение считает число успехов в фиксированном количестве испытаний «да/нет» — например, сколько из 20 посетителей конвертируются. Оно <strong>дискретное</strong> (столбцы, а не кривая) со средним = <strong>n × p</strong> (испытания × вероятность). При p = 0,5 оно симметрично, как нормальное; при малом p — с уклоном вправо. Ключевой факт для A/B-тестов: с ростом n биномиальное хорошо приближается нормальным — именно поэтому Z-тест работает на конверсиях.',
    anat_mmm:'среднее = медиана = мода', anat_mode:'мода', anat_median:'медиана', anat_mean:'среднее',
    anat_binom_mean:'среднее = n·p = 6', anat_binom_x:'число успехов (k)',
    ref_dice_title:'Разбор примера: почему две кости дают треугольник',
    dice_p1:'Одна кость — <strong>равномерная</strong>: каждая грань 1–6 равновероятна. Но сложите <em>две</em> кости — и результат уже не плоский: пик на 7 и симметричный спад к 2 и 12. Это <strong>треугольное распределение</strong>.',
    dice_p2:'Причина — простой подсчёт. Есть лишь один способ выбросить 2 (1+1) и один способ выбросить 12 (6+6), но шесть способов выбросить 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1). Больше комбинаций — выше вероятность, поэтому середина возвышается над краями.',
    dice_callout_title:'🎯 Более глубокий урок',
    dice_callout_body:'Сложение всего двух равномерных костей уже изгибает плоское распределение к пику. Добавьте больше костей — и оно станет глаже и ближе к колоколу. Это центральная предельная теорема в миниатюре: суммы и средние случайных величин стремятся к нормальному распределению, какой бы ни была исходная форма.',
    ref_theory_title:'Теория, которая всё связывает',
    th_clt_b:'Центральная предельная теорема (ЦПТ).', th_clt:'Главный результат статистики: если взять много независимых выборок и усреднить каждую, эти средние следуют нормальному распределению — независимо от формы исходных данных. Поэтому тесты на основе нормальной кривой работают на шумных скошенных реальных метриках, если выборка достаточно велика.',
    th_lln_b:'Закон больших чисел.', th_lln:'По мере роста выборки её среднее сходится к истинному среднему популяции. ЦПТ описывает <em>форму</em> неопределённости оценки; закон больших чисел говорит, что эта неопределённость стремится к нулю с ростом данных. Вместе они обосновывают, почему крупные эксперименты надёжнее.',
    th_se_b:'Стандартная ошибка и √n.', th_se:'Разброс выборочного среднего — это стандартное отклонение, делённое на √n. Увеличение выборки вчетверо уменьшает неопределённость лишь вдвое — именно поэтому обнаружение крошечных эффектов требует непропорционально больших выборок.',
    th_build_b:'Распределения строятся друг на друге.', th_build:'Сумма двух равномерных → треугольное. Сумма многих почти любых → нормальное. Подсчёт редких событий → Пуассона. Время между ними → экспоненциальное. Формы не произвольны; они вытекают из того, как порождается случайность.',
    ref_clt_title:'Почему скошенность обычно не ломает тест: центральная предельная теорема',
    ref_clt_sub:'Тесту важно распределение среднего, а не сырых данных. Даже из очень скошенной популяции среднее по выборке становится колоколообразным по мере роста выборки. Двигайте размер выборки и смотрите.',
    ref_clt_slider_label:'Размер выборки (n):',
    clt_truemean:'истинное среднее', clt_cap_pop:'n = 1: сырая популяция (сильно скошена)', clt_cap_mean:'распределение среднего по выборке (n = {n})',
    ref_checknorm_title:'Когда действительно нужно проверять нормальность?',
    cn_intro:'Самое частое заблуждение в A/B-тестировании — что сырые данные обязаны быть нормально распределены. Обычно это не так. T-тест и Z-тест предполагают, что примерно нормально <em>выборочное распределение среднего</em> — и благодаря центральной предельной теореме это происходит автоматически при достаточно большой выборке, как бы ни были скошены исходные данные.',
    cn_rule_title:'✅ Практическое правило',
    cn_rule_body:'При более чем ~30–50 пользователях на группу для умеренной метрики или нескольких сотнях для сильно скошенной (как выручка) проверять нормальность вообще не нужно. ЦПТ всё покрывает.',
    cn_skip_b:'Проверку можно пропустить, когда:', cn_skip:'выборка большая (сотни+ на группу) и метрика — среднее или доля. Это покрывает подавляющее большинство онлайн-экспериментов.',
    cn_do_b:'Проверять (или менять тест) стоит, когда:', cn_do:'выборка мала (менее ~100–200 на группу), метрика крайне скошена или определяется несколькими выбросами, либо данные явно бимодальны. В этих случаях ЦПТ может ещё не сработать.',
    cn_how_b:'Как проверить:', cn_how:'постройте гистограмму и посмотрите на форму; сравните среднее и медиану (далеко друг от друга = скошенность); или используйте Q–Q график. Формальные тесты вроде Шапиро–Уилка существуют, но слишком чувствительны на больших выборках, поэтому визуальная оценка обычно полезнее.',
    cn_fix_b:'Что делать, если не нормально и n мало:', cn_fix:'используйте тест Манна–Уитни (сравнивает ранги, без предположения о нормальности), примените логарифм для укрощения правой скошенности или ограничьте/винзоризуйте крайние выбросы. Собрать больше данных — самое простое решение.',
    ref_glossary_title:'Глоссарий ключевых терминов',
    gl_pvalue:'Вероятность увидеть различие хотя бы такого размера, если эффекта на самом деле нет. Малое p = данные удивительны при гипотезе «эффекта нет».',
    gl_alpha:'Ваша терпимость к ложноположительным — шанс объявить победителя, когда реального эффекта нет. Обычно 5%.',
    gl_beta:'β — шанс пропустить реальный эффект. Мощность = 1 − β — шанс его поймать. Стремитесь к 80%+.',
    gl_mde:'Минимальный детектируемый эффект: наименьший прирост, который тест способен обнаружить. Меньший MDE требует гораздо больше данных.',
    gl_ci:'Диапазон, который в 95% повторных экспериментов содержит истинный эффект. Если он не включает ноль — результат значим.',
    gl_se:'Насколько ваша оценка колеблется от выборки к выборке. Убывает как 1/√n.',
    gl_cv_b:'Коэффициент вариации (CV)', gl_cv:'SD ÷ среднее. Безразмерная мера разброса; высокий CV — шумная метрика, требующая больше данных.',
    gl_srm:'Sample Ratio Mismatch: фактическое распределение трафика отличается от задуманного, что сигнализирует о баге, делающем результаты недействительными.',
    th_metric_type:'Тип метрики', th_test:'Тест', th_when:'Когда применять',
    th_lever:'Инструмент', th_mechanism:'Механизм',
    acc_ztest:'Z-тест для конверсий',
    acc_welch:'Критерий Уэлча (непрерывная метрика)',
    acc_ratio:'Метрики-отношения — метод агрегации',
    acc_mann:'Критерий Манна–Уитни (непараметрический)',
    acc_multi:'Многовариантные тесты (3+ варианта)',
    acc_variance:'Высокая дисперсия → низкая мощность',
    acc_novelty:'Эффекты новизны и первичности',
    acc_srm:'Нарушение соотношения выборок (SRM)',
    acc_peeking:'Пикинг — преждевременная остановка теста',
    acc_network:'Сетевые эффекты и взаимодействие пользователей',
    acc_multiple:'Множественные метрики — что оптимизировать?',
    // Plan result box
    res_sample_size:'Необходимый размер выборки на вариант',
    prop_both:'Размер выборки <em>и</em> длительность в одном месте', prop_free:'Бесплатно, без регистрации', prop_private:'Работает в браузере — данные не покидают устройство',
    plan_empty_t:'Здесь появится результат', plan_empty_s:'Необходимый размер выборки, оценка длительности теста и понятное объяснение, что это значит.',
    res_method_label:'Метод:',
    method_two_sided:'двусторонний', method_one_sided:'односторонний',
    method_z:'Z-тест для двух долей, объединённая дисперсия, {c}% доверия, мощность {p}% ({s})',
    method_t:'t-тест Уэлча (неравные дисперсии), {c}% доверия, мощность {p}% ({s})',
    method_bonf:'поправка Бонферрони на {k} сравнений',
    plan_explain_h:'Что это значит', plan_explain_link:'Как это рассчитано →',
    explain_conv:'Нужно {n} пользователей на группу, чтобы надёжно обнаружить относительный прирост {lift}% на базе {base}%.',
    explain_cont:'Нужно {n} пользователей на группу, чтобы надёжно обнаружить изменение среднего на {lift}%.',
    explain_days:'При текущем трафике это около <b>{d} дней</b> тестирования.',
    explain_tradeoff:'Меньшие эффекты требуют гораздо больше трафика — вдвое меньший прирост примерно вчетверо увеличивает выборку.',
    explain_multi:'При {v} вариантах каждая группа рассчитана на {k} скорректированных сравнений с контролем.',
    res_users:'пользователей', res_days:'дней',
    res_total:'итого (обе группы)', res_mde_abs:'абсолютный MDE',
    res_test_used:'используемый тест', res_duration:'Оценочная длительность эксперимента',
    res_full_weeks:'полных недели', res_users_day:'пользователей/день на вариант',
    lbl_control:'(контроль)',
    // Ratio warning
    ratio_warn_body:'Для AOV: суммарная выручка пользователя ÷ количество его заказов. Для CTR на сессию: суммарные клики ÷ суммарные сессии. t-тест на сырых строках транзакций завышает долю ложноположительных в 2–10 раз.',
    ratio_warn_why:'Почему это важно?',
    // Canvas chart labels
    chart_reject:'отклонить H₀', chart_fail_reject:'не отклонять H₀',
    chart_h0_null:'H₀ (нуль)', chart_h1_effect:'H₁ (реальный эффект)',
    chart_sample_size_axis:'Размер выборки на вариант (n)',
    chart_mde_axis:'Минимальный детектируемый эффект (относительный %)',
    chart_power_axis:'Мощность (1 − β)',
    lbl_revenue_toggle:'Прогноз выручки (необязательно)',
    lbl_monthly_visitors:'Посетителей в месяц',
    lbl_avg_order:'Средний чек ($)',
    js_revenue_title:'Прогнозируемый прирост выручки за год',
    js_rev_conservative:'Консервативный',
    js_rev_expected:'Ожидаемый',
    js_rev_optimistic:'Оптимистичный',
    js_rev_note:'+{lift}pp прирост × {visitors} посетителей/мес × ${aov} средний чек × 12 мес. На основе 95% ДИ прироста.',
    btn_share:'Поделиться', share_copied:'✓ Ссылка скопирована!',
    toc_aatest_short:'Начните здесь: A/A-тест', toc_process_short:'Полный процесс A/B-теста',
    toc_multiple_short:'Множественное тестирование и рост ошибок',
    ref_multiple_title:'Множественное тестирование: почему больше сравнений завышают ложные срабатывания',
    ref_multiple_sub:'Классический порог α = 0,05 защищает одно сравнение. Как только вы проверяете несколько гипотез сразу, вероятность хотя бы одного ложного срабатывания быстро растёт — и её нужно корректировать.',
    mt_problem:'<strong>Проблема.</strong> При α = 0,05 и одной гипотезе шанс ложного срабатывания — 5%. Но при проверке нескольких независимых гипотез вероятность хотя бы одного ложного срабатывания — групповая вероятность ошибки (FWER) — равна 1 − (1 − α)<sup>m</sup>. При 3 сравнениях это уже ~14%, при 10 — ~40%. Больше вариантов, больше метрик или повторное подглядывание умножают шанс обмануться.',
    mt_formula_label:'Групповая вероятность ошибки', mt_slider_label:'Сравнений (m):',
    mt_chart_title:'Риск ложного срабатывания и число сравнений',
    mt_chart_sub:'Оранжевая линия — нескорректированная групповая ошибка; пунктир показывает, как Бонферрони удерживает её на 5%.',
    mt_lbl_bonf:'с Бонферрони (5%)', mt_lbl_fwer:'без поправки (FWER)', mt_axis:'число одновременных сравнений (m)',
    mt_bonf_b:'Поправка Бонферрони.', mt_bonf:'Разделите целевой α на число сравнений m (например, 0,05 / 10 = 0,005); значимыми считаются только p-value ниже этого порога. Очень просто и строго контролирует FWER — но слишком консервативно, теряет мощность и может пропустить реальные эффекты.',
    mt_holm_b:'Холма–Бонферрони (пошаговая).', mt_holm:'Отсортируйте p-value от меньшего к большему и проверяйте по очереди против всё более мягких порогов (α/m, затем α/(m−1), …). Равномерно мощнее обычного Бонферрони при той же гарантии FWER. Разумный выбор по умолчанию.',
    mt_bh_b:'Бенджамини–Хохберга (контроль FDR).', mt_bh:'Вместо защиты даже от одного ложного срабатывания контролирует ожидаемую <em>долю</em> ложных среди значимых результатов (False Discovery Rate). Гораздо мощнее при просмотре многих метрик ценой допустимой доли ошибок. Стандартный выбор для больших дашбордов и разведочного анализа.',
    mt_omnibus_title:'🧪 Сначала запустите омнибус-тест',
    mt_omnibus_body:'При 3+ вариантах не переходите сразу к парным сравнениям. Сначала запустите единый <strong>омнибус-тест</strong> — χ² для конверсии, однофакторный ANOVA для непрерывных метрик — который задаёт один вопрос: «отличается ли <em>хоть какой-то</em> вариант от остальных?» И только если он значим, переходите к скорректированным парным тестам, чтобы найти <em>какие именно</em>. Этот двухэтапный шлюз (защищённая процедура) контролирует уровень ошибок и не даёт перебирать пары, которые данные не оправдывают. Этот калькулятор следует именно такому порядку: сначала χ², затем парные сравнения к контролю с поправкой Холма.',
    mt_pick_title:'✅ Что выбрать',
    mt_pick_body:'Несколько заранее запланированных сравнений, где любое ложное срабатывание дорого → <strong>Холма–Бонферрони</strong> (рекомендуемый выбор). Просмотр многих метрик, где допустима малая доля ложных ради большего числа находок → <strong>Бенджамини–Хохберга</strong>. Обычный Бонферрони подходит при малом m и желании простейшего защитимого правила. Охранные метрики против регрессий обычно оставляют <em>без поправки</em> — там нужна максимальная чувствительность.',
    ref_aatest_title:'Начните здесь: A/A-тест',
    ref_aatest_sub:'Прежде чем доверять любому A/B-результату, докажите, что платформа разбиения честная. A/A-тест отправляет два одинаковых варианта двум случайно разбитым группам — и ожидает отсутствия различий.',
    aa_what_b:'Что это.', aa_what:'Вы запускаете эксперимент, где A и B полностью одинаковы. Раз ничего не отличается, любой «победитель» — это чистый шум. Это как взвесить пустые весы, чтобы проверить, что они показывают ноль.',
    aa_why_b:'Почему джунам стоит начать здесь.', aa_why:'Большинство багов разбиения невидимы, пока не посмотришь: сломанный рандомайзер, пользователи в обеих группах, боты на одной стороне или двойной учёт в логах. A/A-тест выявляет всё это до того, как реальный тест введёт вас в заблуждение.',
    aa_read_b:'Как читать.', aa_read:'Ожидайте незначимый результат (p &gt; 0,05) примерно в 95% случаев. Один значимый A/A-результат не тревожен — при α = 0,05 примерно 1 из 20 сработает случайно. Запустите несколько. Если значимых заметно больше ~5%, у платформы проблема.',
    aa_srm_b:'Проверьте соотношение разбиения (SRM).', aa_srm:'Если вы просили разбиение 50/50, размеры групп должны быть очень близки. Большой дисбаланс — Sample Ratio Mismatch — означает, что назначение сломано, и ни одному результату с этой платформы нельзя доверять, пока это не исправят.',
    aa_tip_title:'✅ Практический стартовый чек-лист',
    aa_tip_body:'1. Запустите A/A-тест на платформе. 2. Убедитесь, что соотношение разбиения совпадает с настроенным. 3. Убедитесь, что p-value незначим на нескольких запусках. 4. Только потом запускайте реальные A/B-тесты. Можно вставить два числа A/A-групп во вкладку «Анализ» и убедиться, что «явного победителя нет» — именно то, что нужно.',
    ref_process_title:'Полный процесс A/B-теста — шаг за шагом',
    ref_process_sub:'Нажмите на каждый шаг, чтобы раскрыть его. Это путь от размытой идеи до решения, которое можно защитить.',
    proc_step:'Шаг', proc_goal:'Цель', proc_example:'Пример', proc_prev:'Назад', proc_next:'Далее',
    proc_hypo_t:'Сформулируйте гипотезу', proc_hypo_g:'Превратите догадку в проверяемое, опровержимое утверждение',
    proc_hypo_b:'Хорошая гипотеза называет <strong>изменение</strong>, <strong>ожидаемый эффект</strong>, <strong>метрику</strong> и <strong>причину</strong>. «Поскольку X, изменение Y сдвинет метрику Z». Без этого нельзя отличить успех от истории, придуманной задним числом.',
    proc_hypo_e:'Поскольку кнопку оформления легко не заметить, увеличение её размера и контраста повысит конверсию оформления, так как больше пользователей её заметят.',
    proc_metric_t:'Выберите метрику', proc_metric_g:'Одна основная метрика плюс охранные',
    proc_metric_b:'Определите <strong>основную метрику</strong> заранее (на ней основано решение) и несколько <strong>охранных метрик</strong>, которые не должны ухудшиться. Выбор метрики после просмотра данных — способ обмануть себя.',
    proc_metric_e:'Основная: конверсия оформления. Охранные: средний чек и доля возвратов (большая кнопка не должна привлекать случайные некачественные заказы).',
    proc_size_t:'Спланируйте размер выборки', proc_size_g:'Решите, сколько пользователей и как долго, до старта',
    proc_size_b:'Используйте <strong>вкладку «План»</strong>, чтобы рассчитать размер выборки для вашего MDE, α и мощности. Это фиксирует точку остановки заранее — главная защита от подглядывания и ложных срабатываний.',
    proc_size_e:'Чтобы обнаружить относительный прирост 5% при α = 0,05 и мощности 80%, калькулятор говорит, что нужно ~30 000 пользователей на группу — около двух недель при вашем трафике.',
    proc_aacheck_t:'Проверьте A/A-тестом', proc_aacheck_g:'Докажите честность разбиения, прежде чем доверять',
    proc_aacheck_b:'Запустите <strong>A/A-тест</strong> (две одинаковые группы). Убедитесь, что соотношение разбиения совпадает с заданным и результаты незначимы на нескольких запусках. Это ловит баги рандомайзера и ошибки трекинга до того, как они испортят реальный тест.',
    proc_aacheck_e:'Вы разбили 50/50 и получили 19 980 против 20 020 пользователей при p = 0,62 — сбалансировано и незначимо. Платформе можно доверять.',
    proc_run_t:'Проведите эксперимент', proc_run_g:'Соберите данные до планового размера без подглядывания',
    proc_run_b:'Запустите оба варианта одновременно для случайно назначенных пользователей и <strong>ждите</strong>. Не останавливайте раньше из-за того, что «выглядит значимо» — это завышает ложные срабатывания. Проводите полные бизнес-циклы (включая выходные), чтобы избежать смещения по дням недели.',
    proc_run_e:'Вы работаете все две недели, хотя на 3-й день выглядело многообещающе — потому что остановка в первый красивый момент превращает шум в мнимый сигнал.',
    proc_analyse_t:'Проанализируйте результаты', proc_analyse_g:'Примените правильный тест и читайте честно',
    proc_analyse_b:'Вставьте числа во <strong>вкладку «Анализ»</strong>. Z-тест для конверсии, t-тест Уэлча для непрерывных метрик. Смотрите на доверительный интервал, а не только на p-value — он показывает правдоподобный диапазон истинного эффекта.',
    proc_analyse_e:'Вариант B конвертирует 3,4% против 3,0%, относительный прирост +13%, p = 0,01, ДИ [+4%, +22%]. Значимо — и весь интервал положительный.',
    proc_decide_t:'Решите и интерпретируйте', proc_decide_g:'Переведите статистику в бизнес-решение',
    proc_decide_b:'Значимый результат — не автоматический <strong>запуск</strong>. Взвесьте размер эффекта против стоимости внедрения, проверьте, что охранные метрики удержались, и подумайте, практически ли значим прирост. Крошечный, но значимый выигрыш может не стоить разработки.',
    proc_decide_e:'Прирост +13% значим и охранные метрики удержались, поэтому вы запускаете B — и документируете результат, чтобы следующий не запускал тот же тест заново.',
    footer_privacy:'Все расчёты выполняются локально в браузере — данные не покидают устройство.',
    // Accordion body — shared bold labels
    ab_formula:'Формула:',ab_assumptions:'Допущения:',ab_examples:'Примеры:',
    ab_ztest_w1_bold:'Что делает:',
    // Z-test body
    ab_ztest_w1:'Проверяет, различаются ли статистически две пропорции (p₁, p₂).',
    ab_ztest_formula_note:'где p̂ — объединённая пропорция.',
    ab_ztest_assumptions:'n·p ≥ 5 и n·(1−p) ≥ 5 для обеих групп. Нарушается при очень низких конверсиях и малых выборках.',
    ab_ztest_examples:'Процент регистраций, покупок, кликов, открытий, удержание, переход с триала.',
    // Welch body
    ab_welch_w1:"Проверяет, различаются ли средние двух групп, без предположения о равенстве дисперсий. Всегда надёжнее критерия Стьюдента.",
    ab_welch_formula_note:'со степенями свободы Уэлча–Саттертуэйта.',
    ab_welch_assumptions:'Независимость наблюдений. При малых n — приближённая нормальность. При больших n ЦПТ защищает результат.',
    ab_welch_examples:'ARPU, средняя длина сессии, товары в корзине, расходы за 14 дней.',
    // Ratio body
    ab_ratio_prob_bold:'Проблема:',
    ab_ratio_prob:'Такие метрики, как AOV или CTR на сессию, имеют переменный знаменатель. t-тест на сырых транзакциях считает каждый заказ независимым — но заказы одного пользователя коррелированы. Это делает стандартную ошибку в 2–10 раз меньше, завышая долю ложноположительных до 10–30%.',
    ab_ratio_safe_bold:'Правильный подход:',
    ab_ratio_safe:'Агрегировать до одного значения на пользователя перед тестом.',
    ab_ratio_li1:'AOV на пользователя = суммарная выручка ÷ количество заказов пользователя',
    ab_ratio_li2:'CTR на сессию = суммарные клики ÷ суммарные сессии пользователя',
    ab_ratio_conclusion:"Затем запускайте критерий Уэлча на этих агрегированных значениях. Пользователи с нулевым знаменателем (нет заказов) должны быть исключены или обработаны явно.",
    // Mann-Whitney body
    ab_mann_when_bold:'Когда применять:',
    ab_mann_when:'Сильно скошенные распределения или n < 200 на группу, где выбросы доминируют и ЦПТ ещё не работает в полную силу.',
    ab_mann_tests_bold:'Что проверяет:',
    ab_mann_tests:'Стохастическое доминирование — склонны ли значения B превышать значения A. Не проверяет равенство средних.',
    ab_mann_examples:'Суммы B2B-контрактов, размеры сделок enterprise, метрики ранних стадий с малыми данными.',
    // Multi-variant body
    ab_multi_p1:'Для бинарных исходов: сначала запустите χ² по всей таблице сопряжённости. Если значимо — попарные Z-тесты с поправкой Бонферрони (α/k на пару, где k = число пар).',
    ab_multi_p2:"Для непрерывных метрик с 3+ группами: однофакторный ANOVA, затем попарный критерий Уэлча с поправкой Бонферрони или Холма–Бонферрони.",
    ab_multi_why_bold:'Почему нельзя просто использовать α = 0.05 для всех пар?',
    ab_multi_why:'При 3 вариантах — 3 пары, семейная вероятность ошибки достигает ~14%. Поправка Бонферрони удерживает её на уровне 5%.',
    // Variance body
    ab_variance_intro:'Высокодисперсные метрики (ARPU, LTV) требуют огромных выборок для обнаружения значимых изменений. Три способа решить проблему:',
    ab_cuped_bold:'CUPED',ab_cuped_text:'Вычтите доэкспериментальный ковариат (например, выручку предыдущего периода). Типичное снижение дисперсии: 30–50%. Формула: Y_cuped = Y − θ·(X − E[X]), где θ = Cov(Y,X)/Var(X). То же ожидаемое значение, намного меньше шума.',
    ab_strat_bold:'Стратификационная рандомизация',ab_strat_text:'Разделите пользователей на страты (страна, уровень устройства) до назначения. Убирает дисперсию между стратами из ошибки.',
    ab_winsor_bold:'Винсоризация',ab_winsor_text:'Срежьте значения на уровне 99-го процентиля, чтобы «киты» не доминировали. Применяйте одинаковый порог к обеим группам до анализа.',
    // Novelty body
    ab_novelty_intro:'Пользователи реагируют на новизну иначе или сопротивляются изменениям (праймирование). Оба эффекта искажают ранние оценки.',
    ab_novelty_t1_bold:'Запускайте минимум 2 полные недели',ab_novelty_t1:'чтобы охватить полный недельный цикл — поведение в будни и выходные отличается.',
    ab_novelty_t2_bold:'Сегментируйте по «стажу» пользователей',ab_novelty_t2:'Эффект новизны сильнее всего у возвращающихся пользователей, которые замечают изменение; новые пользователи не имеют базы для сравнения.',
    ab_novelty_t3_bold:'Проверяйте, затухает ли эффект',ab_novelty_t3:'Если на 1-й неделе +10%, а на 3-й +2%, долгосрочный эффект ~2%. Не завершайте тест на 3-й день.',
    // SRM body
    ab_srm_intro:'SRM возникает, когда фактическое соотношение групп отличается от запланированного. Это указывает на баг и делает результаты недействительными даже при p < 0.05.',
    ab_srm_t1_bold:'Обнаружение',ab_srm_t1:'Запустите χ² на наблюдаемых размерах групп vs. ожидаемых. Если p < 0.01 — остановитесь и разбирайтесь.',
    ab_srm_t2_bold:'Частые причины',ab_srm_t2:'Фильтрация ботов только в одной группе; потеря пользователей при редиректе; кэширование CDN; клиентские события с условным срабатыванием.',
    ab_srm_t3_bold:'Не корректируйте статистически',ab_srm_t3:'Исправьте первопричину и запустите тест заново.',
    // Peeking body
    ab_peeking_intro:'Остановка при первом достижении p < 0.05 завышает реальный уровень ошибок. При ежедневном просмотре на протяжении 4 недель — может достигнуть 25%+.',
    ab_peeking_t1_bold:'Заранее зарегистрируйте MDE и план',ab_peeking_t1:'до запуска. Обязуйтесь дождаться запланированного размера выборки.',
    ab_peeking_t2_bold:'Последовательное тестирование',ab_peeking_t2:'Методы вроде mSPRT позволяют смотреть на результаты непрерывно с контролируемым уровнем ошибок. Оправдано для команд с высоким темпом итераций.',
    // Network body
    ab_network_intro:'Классический A/B-тест предполагает независимость пользователей. Это нарушается в социальных продуктах, маркетплейсах и реферальных цепочках.',
    ab_network_t1_bold:'Кластерная рандомизация',ab_network_t1:'Назначайте группы кластерами связанных пользователей (регион, социальный граф), а не индивидуально. Меньше мощности, меньше интерференции.',
    ab_network_t2_bold:'Контрольные группы (holdout)',ab_network_t2:'Оставляйте часть пользователей полностью вне эксперимента, чтобы измерить совокупный эффект просачивания.',
    ab_network_t3_bold:'Switchback-эксперименты',ab_network_t3:'Чередуйте контроль и воздействие во временных окнах. Распространено в райдхейлинге и логистике.',
    // Multiple metrics body
    ab_multiple_intro:'Тестирование многих метрик одновременно повышает вероятность случайно значимого результата.',
    ab_mult_t1_bold:'Заранее зарегистрируйте одну первичную метрику',ab_mult_t1:'на ней основывается решение. Вторичные метрики — лишь дополнительные сигналы.',
    ab_mult_t2_bold:'Охранные метрики',ab_mult_t2:'(выручка, задержка, частота сбоев) — проверяйте без поправки Бонферрони. Нужна максимальная чувствительность к регрессиям.',
    ab_mult_t3_bold:'FDR по Бенджамини–Хохбергу',ab_mult_t3:'При тестировании многих метрик поправка BH менее консервативна, чем Бонферрони, но остаётся корректной.',
    // Tests-at-a-glance table
    tbl_g1c1:'Конверсия / пропорция',tbl_g1c3:'Бинарный исход на пользователя',
    tbl_g2c1:'Непрерывная метрика на пользователя',tbl_g2c3:'Одно числовое значение на пользователя; обрабатывает неравные дисперсии',
    tbl_g3c1:'Метрика-отношение (AOV, CTR…)',tbl_g3c2:'Агрегация → критерий Уэлча',tbl_g3c3:'Вычислите одно значение на пользователя, обращайтесь как с непрерывной метрикой',
    tbl_g4c1:'Скошенные / малые выборки (n<200)',tbl_g4c3:'Когда ЦПТ ещё не работает; проверяет стохастическое доминирование',
    tbl_g5c1:'3+ варианта для конверсий',tbl_g5c3:'Сначала χ², затем попарный Z с поправкой α/k при значимости',
    // α/β power table body
    tbl_p1c1:'Увеличить n',tbl_p1c5:'SE убывает как 1/√n',
    tbl_p2c1:'CUPED / стратификация',tbl_p2c5:'То же, что больше данных, но достигается статистически',
    tbl_p3c1:'Поднять α (0.05 → 0.10)',tbl_p3c5:'Снизить порог отклонения',
    tbl_p4c1:'Снизить α (0.05 → 0.01)',tbl_p4c5:'Повысить порог отклонения',
    tbl_p5c1:'Односторонний тест',tbl_p5c5:'Весь бюджет α — в один хвост',
    tbl_p6c1:'Зарегистрировать гипотезу заранее',tbl_p6c5:'Предотвращает выбор гипотезы post-hoc',
    // JS result strings
    js_variant_worse:'✗ Не запускать — вариант B значимо хуже',
    js_variant_worse_cont:'✗ Не запускать — вариант B значимо хуже контроля',
    js_ship:'✓ Запускаем — вариант победил', js_no_winner:'✗ Победитель не определён',
    js_control_rate:'Конверсия контроля', js_variant_rate:'Конверсия варианта',
    js_rel_lift:'Относительный прирост', js_margin:'Погрешность 95%',
    js_two_sided:'двусторонний', js_one_sided:'односторонний',
    js_before_ship:'Перед запуском:',
    js_guardrails:'Проверьте охранные метрики: не упали ли выручка, удержание или другие ключевые показатели?',
    js_segments:'Проверьте сегменты: одинаков ли прирост на мобильных/десктопе, по странам и тарифам?',
    js_low_data_title:'⚠️ Мало данных',
    ri_control:'Контроль (A)', ri_variant:'Вариант (B)', ri_settings:'Настройки',
    ri_users:'польз.', ri_conv:'конв.', ri_mean:'среднее', recent_no_inputs:'Параметры для этой записи недоступны',
    toc_title:'На этой странице',
    toc_g1:'🚀 С чего начать', toc_g2:'🧠 Основные понятия', toc_g3:'🎯 Выбор теста', toc_g4:'📈 Распределения и теория', toc_g5:'🔬 Продвинутое и ловушки',
    toc_g1_desc:'Новичок в тестировании? Начните здесь. Освойте словарь, посмотрите весь процесс от начала до конца, затем проверьте платформу, прежде чем доверять результатам.',
    toc_g2_desc:'Четыре идеи, на которых держится любой результат: значимость, два способа ошибиться, нужный размер выборки и доверительный интервал вокруг ответа.',
    toc_g3_desc:'Какой тест подходит вашей метрике — и что каждый из них значит со статистической и бизнес-точки зрения. Разберитесь до того, как анализировать.',
    toc_g4_desc:'Почему данные выглядят так, как выглядят, и почему средние ведут себя так предсказуемо при масштабе. Интуиция, делающая каждый тест понятным.',
    toc_g5_desc:'Приёмы, делающие тесты точнее, и ловушки, которые тихо обесценивают результаты — подглядывание и проверка слишком многого сразу.',
    toc_cifac_short:'Что расширяет доверительный интервал', toc_choose_short:'Z-тест и t-тест: какой и почему',
    toc_cuped_short:'Снижение дисперсии CUPED', toc_peeking_short:'Почему подглядывание завышает ошибки',
    toc_split_short:'Неравные сплиты трафика (напр. 90/10)',
    ref_split_title:'Неравные сплиты трафика: когда 50/50 слишком рискованно',
    ref_split_sub:'Иногда нельзя отправить половину пользователей на непроверенное изменение — оно может быть дорогим, рискованным или тяжёлым в эксплуатации. Можно направить на вариант меньшую долю (скажем, 10%). У этой безопасности есть реальная статистическая цена.',
    split_intro:'<strong>Компромисс одной строкой:</strong> сплит 50/50 статистически самый эффективный — достигает значимости при наименьшем общем числе пользователей — но неравный сплит (напр. 90/10) подвергает риску гораздо меньше людей ценой большего трафика и времени.',
    split_chart_title:'Сколько всего пользователей нужно в зависимости от неравномерности сплита',
    split_chart_sub:'База 5%, обнаружение прироста +10% при 95% доверия и мощности 80%. Двигайте, чтобы задать долю на вариант.',
    split_formula_label:'При этом сплите', split_var_label:'вариант получает', split_total_label:'всего нужно пользователей', split_vs_label:'против 50/50',
    split_slider_label:'Доля на вариант:', split_axis:'доля трафика, направленная на вариант', split_best:'(самый эффективный)',
    split_why_b:'Зачем это нужно.', split_why:'Изменение цены, новый флоу оформления или что угодно с риском для выручки или поддержки. Экспозиция 10% ограничивает риск: если вариант плохой, его почувствуют лишь 10% пользователей.',
    split_power_b:'Влияние на мощность.', split_power:'Мощность определяется <em>меньшей</em> группой. Урезав вариант до 10%, вы лишаете его данных, поэтому ради 80% мощности нужно увеличить весь эксперимент — контрольная группа раздувается для компенсации. Итог: больше пользователей, чем в сбалансированном тесте.',
    split_time_b:'Влияние на длительность.', split_time:'Группа варианта наполняется медленно, ведь получает лишь тонкий срез дневного трафика. При том же общем трафике тест 90/10 может занять примерно в 2–3 раза дольше, чем 50/50 — узкое место это малая группа.',
    split_rule_b:'Эмпирическое правило.', split_rule:'50/50 оптимально по скорости и эффективности выборки. Не уходите в крайности без нужды: 80/20 стоит ~на 60% больше пользователей, чем 50/50, а 90/10 — почти втрое. Используйте минимальный дисбаланс, при котором риск приемлем.',
    split_tip_title:'💡 Практический совет',
    split_tip_body:'Запускайте рискованные или дорогие изменения на малой доле (5–10%), чтобы убедиться, что ничего не ломается, затем — если безопасно — наращивайте к 50/50 для эффективного сбора данных. Если малую экспозицию нужно держать весь тест, заранее закладывайте большую длительность и проверьте, что трафик реально доберёт нужную выборку варианта в ваши сроки.',
    toc_samplesize_short:'Размер выборки vs MDE', toc_distshapes_short:'Каталог форм распределений', toc_dice_short:'Пример: две кости',
    toc_clt_short:'Центральная предельная теорема', toc_checknorm_short:'Когда проверять нормальность',
    toc_distcases_short:'Кейсы: проверка распределений', toc_usecases_short:'Подбор теста под ситуацию',
    btn_dl_png:'PNG', recent_title:'Недавние результаты', recent_clear:'Очистить',
    recent_just_now:'только что', recent_min:'мин назад', recent_hr:'ч назад', recent_day:'дн назад',
    js_err_fill_variant:'Заполните данные по всем вариантам (пользователи и конверсии) перед анализом.',
    js_err_need_two:'Для сравнения нужно минимум 2 варианта.',
    js_err_paste_values:'Вставьте значения или заполните среднее + SD + n для обоих вариантов.',
    js_err_paste_ratio:'Вставьте поюзерные значения отношения или заполните среднее + SD + n для обоих вариантов.',
    js_low_data_body:'Всего {n} конверсий. Результат может быть ненадёжным — малое число событий делает тест очень чувствительным к случайным колебаниям. Соберите больше данных перед принятием решения.',
    js_not_sig:'Результат ещё не значим.',
    js_keep_running:'Продолжайте тест до достижения запланированного размера выборки. Ранняя остановка завышает долю ложноположительных.',
    js_control_avg:'Среднее контроля', js_variant_avg:'Среднее варианта',
    js_ctrl_var:'SD (контроль / вариант)', js_cv_ctrl_var:'CV (контроль / вариант)',
    js_results_conv:'Результаты — Z-тест для конверсий',
    js_results_cont:'Результаты — Непрерывная метрика (критерий Уэлча)',
    js_results_ratio:'Результаты — t-тест для метрик-отношений (агрегированные значения)',
    js_variants_diff:'✓ Варианты значимо различаются',
    js_best_variant:'Лучший вариант', js_vs_control:'к контролю', js_holm_col:'Холм', js_holm_sig:'значимо', js_holm_ns:'не значимо', js_holm_note:'Парные сравнения (каждый вариант к контролю A) используют пошаговую поправку Холма–Бонферрони по {k} сравнениям — равномерно мощнее обычного Бонферрони при контроле групповой ошибки на уровне α = {a}.', lbl_control_word:'контроль', js_no_diff:'✗ Значимых различий не обнаружено',
    js_conv_ci:'Конверсии с 95% доверительными интервалами',
    js_conv_ci_sub:'Столбцы — наблюдаемые конверсии; усы — ДИ. Непересекающиеся интервалы примерно указывают на значимые различия.',
    js_null_dist:'Как наблюдаемое различие соотносится с нулевым распределением',
    js_null_dist_sub:'При H₀ различие должно быть около нуля. Оранжевый маркер — наблюдаемое значение; красные области — зоны отклонения при α =',
    js_avg_ci:'Средние значения с 95% доверительными интервалами',
    js_avg_ci_sub:'Столбцы — наблюдаемые средние; усы — ДИ. Непересекающиеся интервалы примерно указывают на значимые различия.',
    js_ratio_ci:'Метрики-отношения с 95% доверительными интервалами',
    js_ratio_ci_sub:'Столбцы — средние агрегированных значений на пользователя; усы — ДИ.',
    js_control_lbl:'Контроль (A)', js_variant_lbl:'Вариант (B)',
    js_result_conv_note:'Результат предполагает корректную агрегацию данных.',

  }
};

let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  const dict = T[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = dict[key];
    if (val !== undefined) {
      // Some translation strings intentionally contain inline markup (<strong>, <em>, <sub>).
      // These are author-controlled (not user input), so rendering them as HTML is safe.
      if (/<[a-z][\s\S]*>/i.test(val)) el.innerHTML = val;
      else el.textContent = val;
    }
  });
  // Update lang button: always shows the OTHER language as the switch target
  document.getElementById('lang-label').textContent = lang === 'en' ? 'RU' : 'EN';
  document.documentElement.lang = lang;
  // Keep theme label in sync
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const themeLabelEl = document.getElementById('theme-label');
  if (themeLabelEl) themeLabelEl.textContent = isDark ? dict.theme_dark : dict.theme_light;
  try { localStorage.setItem('abcalc-lang', lang); } catch(e) {}
  // Redraw reference charts if visible (canvas labels need repaint)
  if (typeof drawCharts === 'function' &&
      document.getElementById('tab-reference')?.classList.contains('active')) {
    setTimeout(drawCharts, 10);
  }
  // Re-render the interactive process stepper (its content is i18n-driven)
  if (typeof renderProcess === 'function') renderProcess();
}

function toggleLang() {
  applyLang(currentLang === 'en' ? 'ru' : 'en');
}

// Apply saved language on load — English is the default
(function() {
  try {
    const saved = localStorage.getItem('abcalc-lang');
    if (saved === 'ru') {
      window.addEventListener('DOMContentLoaded', () => applyLang('ru'));
    } else {
      // Ensure button shows RU (switch to Russian) and lang is EN
      window.addEventListener('DOMContentLoaded', () => {
        const lbl = document.getElementById('lang-label');
        if (lbl) lbl.textContent = 'RU';
      });
    }
  } catch(e) {}
})();

// ── Theme toggle ──
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  const icon = document.getElementById('theme-icon');
  const lbl  = document.getElementById('theme-label');
  if (icon) icon.textContent = dark ? '☀️' : '🌙';
  if (lbl)  lbl.textContent  = dark ? (T[currentLang]?.theme_light || 'Light') : (T[currentLang]?.theme_dark || 'Dark');
  if (typeof RC !== 'undefined') {
    // Core neutrals
    RC.INK    = dark ? '#f4f5ff' : '#1a1a2e';
    RC.MUTED  = dark ? '#8890b8' : '#9a9cb8';
    RC.BG     = dark ? '#161828' : '#ffffff';
    RC.BORDER = dark ? '#2e3155' : '#e2e4ef';
    // Semantic chart colours — must match the CSS variables for each theme
    RC.P    = dark ? '#a59cf7' : '#5b50c8';   // accent / purple
    RC.PL   = dark ? 'rgba(165,156,247,0.20)' : 'rgba(91,80,200,0.18)';
    RC.GR   = dark ? '#66dda0' : '#1a7a4a';   // success green
    RC.GRL  = dark ? 'rgba(102,221,160,0.20)' : 'rgba(26,122,74,0.15)';
    RC.OR   = dark ? '#f7a850' : '#e8832a';   // observed-marker orange
    RC.ORL  = dark ? 'rgba(247,168,80,0.20)' : 'rgba(232,131,42,0.18)';
    RC.RED  = dark ? '#ff6b6b' : '#dc3232';   // worse / rejection
    RC.REDL = dark ? 'rgba(255,107,107,0.20)' : 'rgba(220,50,50,0.15)';
    RC.WARN = dark ? '#f7cf50' : '#7a5500';   // warning
  }
  try { localStorage.setItem('abcalc-theme', dark ? 'dark' : 'light'); } catch(e) {}
  // Redraw any visible charts so they pick up the new colours immediately
  if (typeof drawCharts === 'function' &&
      document.getElementById('tab-reference')?.classList.contains('active')) {
    drawCharts();
  }
}
function toggleTheme() {
  const dark = document.documentElement.getAttribute('data-theme') !== 'dark';
  applyTheme(dark);
}
(function() {
  try {
    if (localStorage.getItem('abcalc-theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      window.addEventListener('DOMContentLoaded', () => applyTheme(true));
    } else {
      // Explicitly initialise RC for light mode so charts match the UI
      window.addEventListener('DOMContentLoaded', () => applyTheme(false));
    }
  } catch(e) {}
})();

// ── URL State — encode inputs into query params ───────────────────────────

function encodeState() {
  try {
    const p = new URLSearchParams();
    const activeBtn = document.querySelector('.tab-btn.active');
    const tab = activeBtn?.getAttribute('data-tab') || 'plan';
    p.set('tab', tab);
    p.set('lang', currentLang);
    if (document.documentElement.getAttribute('data-theme') === 'dark') p.set('theme', 'dark');
    if (tab === 'plan') {
      const pm = planMetric || 'conversion';
      p.set('pm', pm);
      const getV = id => document.getElementById(id)?.value || '';
      const getR = name => document.querySelector(`input[name="${name}"]:checked`)?.value || '';
      p.set('pa', getR('p-alpha'));
      p.set('pp', getR('p-power'));
      p.set('pt', getR('p-tails'));
      if (pm === 'conversion') {
        p.set('cb', getV('p-conv-base'));
        p.set('cm', getV('p-conv-mde'));
      } else {
        p.set('cm2', getV('p-cont-mean'));
        p.set('cs', getV('p-cont-sd'));
        p.set('cme', getV('p-cont-mde'));
        p.set('cc', getV('p-cont-cuped'));
      }
      p.set('du', getV('p-daily-users'));
      p.set('nv', getV('p-num-variants'));
    }
    window.history.replaceState({}, '', window.location.pathname + '?' + p.toString());
  } catch(e) {}
}

function decodeState() {
  try {
    const p = new URLSearchParams(window.location.search);
    if (!p.has('tab')) return;
    if (p.get('theme') === 'dark') applyTheme(true);
    if (p.get('lang') === 'ru') applyLang('ru');
    const tab = p.get('tab') || 'plan';
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (tabBtn) {
      document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.btab').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tab)?.classList.add('active');
      tabBtn.classList.add('active');
      const btab = document.querySelector(`.btab[data-tab="${tab}"]`);
      if (btab) btab.classList.add('active');
      if (tab === 'reference') setTimeout(drawCharts, 30);
    }
    if (tab === 'plan') {
      const pm = p.get('pm') || 'conversion';
      planMetric = pm;
      document.querySelectorAll('.plan-metric-btn').forEach(b => b.classList.remove('selected'));
      document.getElementById(pm === 'conversion' ? 'plan-btn-conversion' : 'plan-btn-continuous')?.classList.add('selected');
      document.getElementById('plan-inputs-conversion')?.classList.toggle('hidden', pm !== 'conversion');
      document.getElementById('plan-inputs-continuous')?.classList.toggle('hidden', pm !== 'continuous');
      const setV = (id, val) => { if (val != null && val !== '') { const el = document.getElementById(id); if (el) el.value = val; } };
      const setR = (name, val) => { if (!val) return; const el = document.querySelector(`input[name="${name}"][value="${val}"]`); if (el) el.checked = true; };
      setR('p-alpha', p.get('pa')); setR('p-power', p.get('pp')); setR('p-tails', p.get('pt'));
      if (pm === 'conversion') { setV('p-conv-base', p.get('cb')); setV('p-conv-mde', p.get('cm')); }
      else { setV('p-cont-mean', p.get('cm2')); setV('p-cont-sd', p.get('cs')); setV('p-cont-mde', p.get('cme')); setV('p-cont-cuped', p.get('cc')); }
      setV('p-daily-users', p.get('du')); setV('p-num-variants', p.get('nv'));
      const hasData = (pm === 'conversion' && p.get('cb') && p.get('cm')) || (pm !== 'conversion' && p.get('cm2') && p.get('cs') && p.get('cme'));
      if (hasData) setTimeout(calcSampleSize, 150);
    }
  } catch(e) { console.warn('decodeState:', e); }
}

function copyShareLink() {
  encodeState();
  const url = window.location.href;
  const msg = T[currentLang]?.share_copied || 'Link copied!';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showShareToast(msg)).catch(() => { fallbackCopy(url, msg); });
  } else { fallbackCopy(url, msg); }
}
function fallbackCopy(url, msg) {
  try {
    const el = document.createElement('textarea');
    el.value = url; el.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
  } catch(e) {}
  showShareToast(msg || url);
}
function showShareToast(msg) {
  let t = document.getElementById('share-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'share-toast';
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:10px 22px;border-radius:100px;font-size:0.85rem;font-weight:600;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.25);transition:opacity 0.3s;pointer-events:none';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._timer); t._timer = setTimeout(() => { t.style.opacity = '0'; }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('change', encodeState);
    el.addEventListener('input', encodeState);
  });
  decodeState();
  renderRecentResults();
});


// ── Tabs ──
function showTab(name, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  // Sync top tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  // Sync bottom tab buttons
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  // Mark the clicked button active (could be .tab-btn or .btab)
  btn.classList.add('active');
  // Also mark the counterpart button active
  const counterpart = document.querySelector(
    btn.classList.contains('btab') ? `.tab-btn[data-tab="${name}"]` : `.btab[data-tab="${name}"]`
  );
  if (counterpart) counterpart.classList.add('active');
  if (name === 'reference') setTimeout(drawCharts, 30);
  if (typeof encodeState === 'function') encodeState();
}

// ── Plan metric select ──
let planMetric = 'conversion';
function selectPlanMetric(type, btn) {
  planMetric = type;
  document.querySelectorAll('.plan-metric-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('plan-inputs-conversion').classList.toggle('hidden', type !== 'conversion');
  document.getElementById('plan-inputs-continuous').classList.toggle('hidden', type !== 'continuous');
  document.getElementById('plan-ratio-notice').classList.toggle('hidden', type !== 'continuous');
  document.getElementById('plan-result').classList.add('hidden');
  const peEl = document.getElementById('plan-explain'); if (peEl) peEl.classList.add('hidden');
  const pemEl = document.getElementById('plan-empty'); if (pemEl) pemEl.classList.remove('hidden');
}

// ── Analyse metric select ──
let analyseMetric = 'conversion';
function selectAnalyseMetric(type, btn) {
  analyseMetric = type;
  document.querySelectorAll('#tab-analyse .plan-metric-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('analyse-section-conversion').classList.toggle('hidden', type !== 'conversion');
  document.getElementById('analyse-section-continuous').classList.toggle('hidden', type !== 'continuous');
  document.getElementById('analyse-section-ratio').classList.toggle('hidden', type !== 'ratio');
}

// ── Stats helpers ──

// ── Sample size + duration ──
function calcSampleSize() {
  const alpha = parseFloat(document.querySelector('input[name="p-alpha"]:checked').value);
  const power = parseFloat(document.querySelector('input[name="p-power"]:checked').value);
  const tails = parseInt(document.querySelector('input[name="p-tails"]:checked').value);
  // With 3+ variants you compare each variant to control: (m-1) comparisons.
  // To hold the family-wise error rate, the per-comparison alpha is Bonferroni-adjusted,
  // which raises the required sample size per arm.
  const numVariants = parseInt(document.getElementById('p-num-variants').value) || 2;
  const numComparisons = Math.max(1, numVariants - 1);
  const alphaAdj = alpha / numComparisons;
  const zAlpha = normInvCDF(tails===2 ? 1-alphaAdj/2 : 1-alphaAdj);
  const zBeta  = normInvCDF(power);
  let n, mdeAbs, testName, baseRate, mdeRel;

  if (planMetric === 'conversion') {
    const p1 = parseFloat(document.getElementById('p-conv-base').value)/100;
    mdeRel = parseFloat(document.getElementById('p-conv-mde').value)/100;
    const p2 = p1*(1+mdeRel);
    mdeAbs = ((p2-p1)*100).toFixed(2)+' pp';
    const pbar = (p1+p2)/2;
    n = Math.ceil((zAlpha*Math.sqrt(2*pbar*(1-pbar))+zBeta*Math.sqrt(p1*(1-p1)+p2*(1-p2)))**2/(p2-p1)**2);
    testName = 'Z-test';
    baseRate = p1;
  } else {
    const mu = parseFloat(document.getElementById('p-cont-mean').value);
    let sd = parseFloat(document.getElementById('p-cont-sd').value);
    mdeRel = parseFloat(document.getElementById('p-cont-mde').value)/100;
    const cupedPct = parseFloat(document.getElementById('p-cont-cuped').value)/100;
    sd *= Math.sqrt(1-cupedPct);
    const delta = mu*mdeRel;
    mdeAbs = delta.toFixed(2)+' units';
    n = Math.ceil(2*((zAlpha+zBeta)*sd/delta)**2);
    testName = cupedPct>0 ? "Welch's t + CUPED" : "Welch's t-test";
    baseRate = null;
  }

  document.getElementById('res-n').textContent = n.toLocaleString();
  document.getElementById('res-total').textContent = (n*numVariants).toLocaleString();
  document.getElementById('res-mde-abs').textContent = mdeAbs;
  document.getElementById('res-test').textContent = testName;
  document.getElementById('plan-result').classList.remove('hidden');

  // Duration calculation
  const dailyRaw = parseFloat(document.getElementById('p-daily-users').value);
  const durationWrap = document.getElementById('res-duration-wrap');
  let explainDays = null;

  if (!isNaN(dailyRaw) && dailyRaw > 0) {
    // Daily traffic split across variants; round up to whole weeks (min 2)
    const usersPerVariantPerDay = dailyRaw / numVariants;
    const rawDays = Math.ceil(n / usersPerVariantPerDay);
    // Always run whole weeks to capture weekly cycles (Kohavi et al.)
    const weeks = Math.max(2, Math.ceil(rawDays / 7));
    const days = weeks * 7;
    explainDays = days;

    document.getElementById('res-days').textContent = days;
    document.getElementById('res-weeks').textContent = weeks + (weeks===1?' week':' weeks');
    document.getElementById('res-daily').textContent = Math.round(usersPerVariantPerDay).toLocaleString();

    // Contextual tips
    const tips = [];
    if (weeks > 8)  tips.push({ icon: '⚠️', text: 'Over 8 weeks is a long test. Consider raising α to 0.10 for faster iteration, or narrowing scope to a higher-traffic surface.' });
    if (weeks < 2)  tips.push({ icon: '⚠️', text: 'Always run for at least 2 full weeks to capture weekly seasonality. Short tests often produce misleading results.' });
    if (mdeRel && mdeRel < 0.03) tips.push({ icon: '💡', text: 'Detecting a sub-3% lift requires a very large sample. Consider whether this effect size is truly worth shipping — or raise the MDE threshold.' });
    if (numVariants > 2) tips.push({ icon: '🔢', text: `With ${numVariants} variants you make ${numComparisons} comparisons vs control. The sample size above already applies a Bonferroni-adjusted α = ${alphaAdj.toFixed(4)} per comparison, which is why each arm needs more users than a simple 2-group test.` });
    if (planMetric === 'conversion' && baseRate < 0.02) tips.push({ icon: '⚠️', text: 'Very low baseline (<2%) means you need huge samples. Consider testing on a higher-converting funnel step first, or using a one-sided test if you only care about improvement.' });
    tips.push({ icon: '📅', text: 'Start on a Monday and end on a Sunday to ensure full weekly coverage. Avoid launching during atypical periods: holidays, campaigns, or major product changes.' });
    tips.push({ icon: '🔒', text: 'Pre-register your MDE and analysis plan before launch. Checking results daily and stopping early inflates false positives by up to 5×.' });

    const tipsHtml = tips.map(t =>
      `<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:7px">
        <span style="font-size:1rem;flex-shrink:0">${t.icon}</span>
        <span style="font-size:0.78rem;color:rgba(255,255,255,0.75);line-height:1.5">${t.text}</span>
      </div>`
    ).join('');
    document.getElementById('res-duration-tips').innerHTML = tipsHtml;
    durationWrap.classList.remove('hidden');
  } else {
    durationWrap.classList.add('hidden');
  }

  // ── Method line + "What this means" panel ──
  const L = T[currentLang];
  const confPct = Math.round((1 - alpha) * 100);
  const powerPct = Math.round(power * 100);
  const sided = tails === 2 ? (L.method_two_sided || 'two-sided') : (L.method_one_sided || 'one-sided');
  let methodStr;
  if (planMetric === 'conversion') {
    methodStr = (L.method_z || 'two-proportion Z-test, pooled variance, {c}% confidence, {p}% power ({s})');
  } else {
    methodStr = (L.method_t || "Welch's t-test (unequal variances), {c}% confidence, {p}% power ({s})");
  }
  methodStr = methodStr.replace('{c}', confPct).replace('{p}', powerPct).replace('{s}', sided);
  if (numVariants > 2) methodStr += ' · ' + (L.method_bonf || 'Bonferroni-adjusted for {k} comparisons').replace('{k}', numComparisons);
  document.getElementById('res-method').textContent = methodStr;

  // Build the plain-English bullets
  const items = [];
  const nStr = '<b>' + n.toLocaleString() + '</b>';
  if (planMetric === 'conversion') {
    const basePct = (baseRate*100).toFixed(1);
    const liftPct = (mdeRel*100).toFixed(0);
    items.push((L.explain_conv || 'You need {n} users per group to reliably detect a {lift}% relative lift on a {base}% baseline.')
      .replace('{n}', nStr).replace('{lift}', liftPct).replace('{base}', basePct));
  } else {
    const liftPct = (mdeRel*100).toFixed(0);
    items.push((L.explain_cont || 'You need {n} users per group to reliably detect a {lift}% change in the average.')
      .replace('{n}', nStr).replace('{lift}', liftPct));
  }
  if (explainDays !== null) {
    items.push((L.explain_days || 'At your current traffic, that is about <b>{d} days</b> of testing.')
      .replace('{d}', explainDays));
  }
  items.push(L.explain_tradeoff || 'Smaller effects need far more traffic — halving the lift roughly quadruples the sample.');
  if (numVariants > 2) {
    items.push((L.explain_multi || 'With {v} variants, each arm is sized for {k} corrected comparisons against control.')
      .replace('{v}', numVariants).replace('{k}', numComparisons));
  }
  document.getElementById('plan-explain-list').innerHTML = items.map(t => '<li>' + t + '</li>').join('');

  // Toggle empty state off, explanation on
  const emptyEl = document.getElementById('plan-empty');
  const explainEl = document.getElementById('plan-explain');
  if (emptyEl) emptyEl.classList.add('hidden');
  if (explainEl) explainEl.classList.remove('hidden');

  encodeState();
}

// ── Add / remove conversion variants (labels always follow position) ──
function relabelConvVariants() {
  const rows = document.querySelectorAll('#conv-variants .variant-row');
  rows.forEach((row, i) => {
    const tagEl = row.querySelector('.variant-tag');
    if (!tagEl) return;
    tagEl.textContent = String.fromCharCode(65 + i);   // A, B, C, …
    tagEl.classList.toggle('control', i === 0);         // only the first is control
  });
}

function removeConvVariant(btn) {
  const row = btn.closest('.variant-row');
  if (row) row.remove();
  relabelConvVariants();
}

function addConvVariant() {
  const div = document.createElement('div');
  div.className = 'variant-row';
  div.innerHTML = `<div class="variant-tag"></div>
    <div class="variant-inputs">
      <div class="vi-field"><label>${T[currentLang].lbl_exposed || 'Exposed'}</label><input type="number" class="cv-users" placeholder="5000" min="1"></div>
      <div class="vi-field"><label>${T[currentLang].lbl_converted || 'Converted'}</label><input type="number" class="cv-conv" placeholder="280" min="0"></div>
    </div>
    <button class="btn-remove" onclick="removeConvVariant(this)">×</button>`;
  document.getElementById('conv-variants').appendChild(div);
  relabelConvVariants();
}

// ── Inline validation message helper (replaces alert pop-ups) ──
function showInlineError(boxId, msg) {
  const box = document.getElementById(boxId);
  if (!box) return;
  box.innerHTML = `<div class="inline-msg"><span class="inline-msg-icon">⚠️</span><span>${msg}</span></div>`;
  box.classList.remove('hidden');
}

// ── Smooth-scroll to results on mobile after an analysis ──
function scrollToResultMobile(box) {
  if (!box || window.innerWidth > 640) return;  // mobile only
  setTimeout(() => {
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
}

// ── Recent results (saved locally on this device) ──
const RECENT_KEY = 'abcalc-history';
const RECENT_MAX = 5;

function saveRecentResult(entry) {
  // entry: { type, verdict, status: 'win'|'lose'|'neutral', meta }
  let list = [];
  try { list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch(e) { list = []; }
  list.unshift({ ...entry, ts: Date.now() });
  list = list.slice(0, RECENT_MAX);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch(e) {}
  renderRecentResults();
}

function clearRecentResults() {
  try { localStorage.removeItem(RECENT_KEY); } catch(e) {}
  renderRecentResults();
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  const L = T[currentLang];
  if (s < 60) return L.recent_just_now;
  const m = Math.floor(s / 60);
  if (m < 60) return m + ' ' + L.recent_min;
  const h = Math.floor(m / 60);
  if (h < 24) return h + ' ' + L.recent_hr;
  const d = Math.floor(h / 24);
  return d + ' ' + L.recent_day;
}

function renderRecentResults() {
  const card = document.getElementById('recent-results-card');
  const listEl = document.getElementById('recent-results-list');
  if (!card || !listEl) return;
  let list = [];
  try { list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch(e) { list = []; }
  if (!list.length) { card.style.display = 'none'; return; }
  card.style.display = '';
  const colorFor = (st) => st === 'win' ? RC.GR : st === 'lose' ? RC.RED : RC.MUTED;
  listEl.innerHTML = list.map(item => {
    const inputsHtml = (item.inputs && item.inputs.length)
      ? `<div class="recent-item-inputs">${item.inputs.map(p =>
          `<div class="recent-input-row"><span class="recent-input-k">${p.k}</span><span class="recent-input-v">${p.v}</span></div>`
        ).join('')}</div>`
      : `<div class="recent-item-inputs"><div class="recent-input-row" style="color:var(--ink-faint)">${T[currentLang].recent_no_inputs}</div></div>`;
    return `
    <details class="recent-item">
      <summary class="recent-item-summary">
        <span class="recent-item-dot" style="background:${colorFor(item.status)}"></span>
        <div class="recent-item-main">
          <div class="recent-item-verdict">${item.verdict}</div>
          <div class="recent-item-meta">${item.type} · ${item.meta}</div>
        </div>
        <span class="recent-item-time">${timeAgo(item.ts)}</span>
      </summary>
      ${inputsHtml}
    </details>`;
  }).join('');
}

// ── Analyse conversion ──
function analyseConversion() {
  const alpha = parseFloat(document.querySelector('input[name="a-alpha"]:checked').value);
  const tails = parseInt(document.querySelector('input[name="a-tails"]:checked').value);
  const preregMDE = parseFloat(document.getElementById('a-prereg-mde').value)||null;
  const rows = document.querySelectorAll('#conv-variants .variant-row');
  const variants = [];
  for (const row of rows) {
    const n = parseFloat(row.querySelector('.cv-users').value);
    const c = parseFloat(row.querySelector('.cv-conv').value);
    if (isNaN(n)||isNaN(c)||n<=0){showInlineError('conv-result', T[currentLang].js_err_fill_variant);return;}
    variants.push({n,c,p:c/n});
  }
  if (variants.length<2){showInlineError('conv-result', T[currentLang].js_err_need_two);return;}
  const A = variants[0];
  let html = `<div class="ar-header">${T[currentLang].js_results_conv}</div><div class="ar-body">`;

  if (variants.length===2) {
    const B = variants[1];
    const se = Math.sqrt(A.p*(1-A.p)/A.n+B.p*(1-B.p)/B.n);
    const z = (B.p-A.p)/se;
    const pVal = tails===2?2*(1-normCDF(Math.abs(z))):1-normCDF(z);
    const sig = pVal<alpha;
    const liftPct = (B.p-A.p)/A.p*100;
    const ci95pp = 1.96*se*100;
    const preregWarn = preregMDE&&Math.abs(liftPct)<preregMDE&&sig
      ?`<div class="notice warn" style="margin-top:12px"><strong>Note:</strong> Significant, but the observed lift (${liftPct.toFixed(1)}%) is below your pre-registered MDE of ${preregMDE}%. Is this lift meaningful for the business?</div>`:'';

    // Low data warning: fewer than 100 conversions total, or fewer than 5 per variant
    const totalConversions = A.c + B.c;
    const minConversions = Math.min(A.c, B.c);
    const lowDataWarn = (totalConversions < 100 || minConversions < 5)
      ? `<div class="notice warn" style="margin-top:12px">
          <strong>${T[currentLang].js_low_data_title}</strong>
          ${T[currentLang].js_low_data_body.replace('{n}', totalConversions)}
        </div>` : '';

    const sigBetter = sig && liftPct > 0;  // significant AND variant is better
    const sigWorse  = sig && liftPct < 0;  // significant AND variant is worse
    const verdictClass = sigBetter ? 'sig' : sigWorse ? 'worse' : 'insig';
    const verdictText  = sigBetter ? T[currentLang].js_ship
                       : sigWorse  ? T[currentLang].js_variant_worse
                       : T[currentLang].js_no_winner;
    html += `<div class="ar-verdict ${verdictClass}">${verdictText}</div>`;
    html += `<div class="ar-sub">p = ${pVal.toFixed(4)} · α = ${alpha} · ${tails===2?T[currentLang].js_two_sided:T[currentLang].js_one_sided}</div>`;
    // Sticky verdict bar — visible only on mobile (CSS hides it on desktop)
    html += `<div class="ar-sticky-verdict">
      <div class="ar-verdict ${verdictClass}">${verdictText}</div>
      <div class="ar-sub">p=${pVal.toFixed(4)}</div>
    </div>`;
    html += `<div class="ar-stats">
      <div class="ar-stat"><strong>${(A.p*100).toFixed(2)}%</strong>${T[currentLang].js_control_rate}</div>
      <div class="ar-stat"><strong>${(B.p*100).toFixed(2)}%</strong>${T[currentLang].js_variant_rate}</div>
      <div class="ar-stat"><strong>${liftPct>0?'+':''}${liftPct.toFixed(1)}%</strong>${T[currentLang].js_rel_lift}</div>
      <div class="ar-stat"><strong>±${ci95pp.toFixed(2)} pp</strong>${T[currentLang].js_margin}</div>
    </div>${lowDataWarn}${preregWarn}`;

    // Chart canvases — drawn after innerHTML is set
    html += `<div class="res-chart-grid">
      <div class="chart-card" style="margin-bottom:0">
        <div class="chart-title">Conversion rates with 95% confidence intervals</div>
        <div class="chart-sub">Bars are observed rates; whiskers are CIs. Non-overlapping intervals roughly imply a significant difference.</div>
        <div class="chart-wrap"><canvas id="res-chart-conv-bars"></canvas></div>
      </div>
      <div class="chart-card" style="margin-bottom:0">
        <div class="chart-title">How your observed difference compares to the null distribution</div>
        <div class="chart-sub">Under H₀ the difference should sit near zero. The orange marker is what you observed — the red areas are rejection zones at α = ${alpha}.</div>
        <div class="chart-wrap"><canvas id="res-chart-conv-lift"></canvas></div>
      </div>
    </div>`;

    html += '</div>';

    // Data table — same structure as t-test table
    // For a proportion p, SD = sqrt(p*(1-p)), CV = SD/p
    const sdA = Math.sqrt(A.p*(1-A.p));
    const sdB = Math.sqrt(B.p*(1-B.p));
    const cvA = sdA / A.p;
    const cvB = sdB / B.p;
    const ciAlo = ((A.p - 1.96*Math.sqrt(A.p*(1-A.p)/A.n))*100).toFixed(2);
    const ciAhi = ((A.p + 1.96*Math.sqrt(A.p*(1-A.p)/A.n))*100).toFixed(2);
    const ciBlo = ((B.p - 1.96*Math.sqrt(B.p*(1-B.p)/B.n))*100).toFixed(2);
    const ciBhi = ((B.p + 1.96*Math.sqrt(B.p*(1-B.p)/B.n))*100).toFixed(2);
    const pDisplay = pVal < 0.0001 ? '< 0.0001' : pVal.toFixed(4);
    html += `<div class="scroll-x" style="margin-top:16px">
      <table class="ref-table" style="min-width:520px">
        <thead><tr>
          <th>Variant</th><th>n</th><th>Rate</th><th>SD</th><th>CV</th>
          <th>95% CI</th><th>Δ vs A</th><th>P-value</th>
        </tr></thead>
        <tbody>
          <tr>
            <td><span style="color:${RC.P};font-weight:700">◆ A</span></td>
            <td>${A.n.toLocaleString()}</td>
            <td><strong>${(A.p*100).toFixed(2)}%</strong></td>
            <td>${(sdA*100).toFixed(2)}%</td>
            <td>${cvA.toFixed(2)}</td>
            <td>[${ciAlo}%, ${ciAhi}%]</td>
            <td>—</td><td>—</td>
          </tr>
          <tr style="background:${sigBetter?'rgba(26,122,74,0.06)':sigWorse?'rgba(220,50,50,0.06)':'rgba(91,80,200,0.04)'}">
            <td><span style="color:${sigBetter?RC.GR:sigWorse?RC.RED:RC.P};font-weight:700">${sigBetter?'★':sigWorse?'▼':'◆'} B</span></td>
            <td>${B.n.toLocaleString()}</td>
            <td><strong>${(B.p*100).toFixed(2)}%</strong></td>
            <td>${(sdB*100).toFixed(2)}%</td>
            <td>${cvB.toFixed(2)}</td>
            <td>[${ciBlo}%, ${ciBhi}%]</td>
            <td style="color:${sig?RC.GR:RC.MUTED};font-weight:600">${liftPct>0?'+':''}${liftPct.toFixed(2)}%</td>
            <td style="color:${sig?RC.GR:RC.MUTED};font-weight:600">${pDisplay}</td>
          </tr>
        </tbody>
      </table>
    </div>`;

    if (sigBetter) {
      html += `<div class="notice success" style="margin-top:12px">
        <strong>${T[currentLang].js_before_ship}</strong>
        <ul style="margin-top:6px;padding-left:16px">
          <li>${T[currentLang].js_guardrails}</li>
          <li>${T[currentLang].js_segments}</li>
        </ul>
      </div>`;
    } else {
      html += `<div class="notice info" style="margin-top:12px">
        <strong>${T[currentLang].js_not_sig}</strong> ${T[currentLang].js_keep_running}
      </div>`;
    }

    // ── Revenue projection ──────────────────────────────────────────────
    const monthlyVisitors = parseFloat(document.getElementById('a-monthly-visitors')?.value);
    const avgOrder        = parseFloat(document.getElementById('a-avg-order')?.value);
    if (monthlyVisitors > 0 && avgOrder > 0) {
      const liftAbs    = B.p - A.p;                          // absolute lift in conversion rate
      const extraConvPerMonth = liftAbs * monthlyVisitors;   // extra conversions per month
      const extraRevMonth  = extraConvPerMonth * avgOrder;   // extra revenue per month
      const extraRevYear   = extraRevMonth * 12;             // annualised
      // Conservative / expected / optimistic based on 95% CI of the lift
      const liftLo   = liftAbs - 1.96 * se;
      const liftHi   = liftAbs + 1.96 * se;
      const revLo    = Math.max(0, liftLo) * monthlyVisitors * avgOrder * 12;
      const revHi    = liftHi  * monthlyVisitors * avgOrder * 12;
      const fmt = (n) => n >= 1e6
        ? '$' + (n/1e6).toFixed(1) + 'M'
        : n >= 1e3
          ? '$' + Math.round(n/1e3) + 'k'
          : '$' + Math.round(n);

      html += `<div class="revenue-card">
        <div class="revenue-title">${T[currentLang].js_revenue_title}</div>
        <div class="revenue-cols">
          <div class="rev-col">
            <div class="rev-val rev-lo">${fmt(revLo)}</div>
            <div class="rev-label">${T[currentLang].js_rev_conservative}</div>
          </div>
          <div class="rev-col rev-col-mid">
            <div class="rev-val rev-mid">${fmt(extraRevYear)}</div>
            <div class="rev-label">${T[currentLang].js_rev_expected}</div>
          </div>
          <div class="rev-col">
            <div class="rev-val rev-hi">${fmt(revHi)}</div>
            <div class="rev-label">${T[currentLang].js_rev_optimistic}</div>
          </div>
        </div>
        <div class="rev-note">${T[currentLang].js_rev_note
          .replace('{lift}', (liftAbs*100).toFixed(2))
          .replace('{visitors}', monthlyVisitors.toLocaleString())
          .replace('{aov}', avgOrder.toFixed(0))}</div>
      </div>`;
    }

    const box=document.getElementById('conv-result');
    box.innerHTML=html; box.classList.remove('hidden');
    setTimeout(()=>drawConvCharts(A,B,se,z,pVal,sig,alpha,tails), 20);
    scrollToResultMobile(box);
    saveRecentResult({
      type: T[currentLang].js_results_conv,
      verdict: verdictText,
      status: sigBetter ? 'win' : sigWorse ? 'lose' : 'neutral',
      meta: `${(B.p*100).toFixed(2)}% vs ${(A.p*100).toFixed(2)}% · ${liftPct>0?'+':''}${liftPct.toFixed(1)}% · p=${pVal.toFixed(3)}`,
      inputs: [
        { k: T[currentLang].ri_control, v: `${A.n.toLocaleString()} ${T[currentLang].ri_users}, ${A.c.toLocaleString()} ${T[currentLang].ri_conv} (${(A.p*100).toFixed(2)}%)` },
        { k: T[currentLang].ri_variant, v: `${B.n.toLocaleString()} ${T[currentLang].ri_users}, ${B.c.toLocaleString()} ${T[currentLang].ri_conv} (${(B.p*100).toFixed(2)}%)` },
        { k: T[currentLang].ri_settings, v: `α=${alpha}, ${tails===2?T[currentLang].js_two_sided:T[currentLang].js_one_sided}` },
      ],
    });

  } else {
    // multi-variant
    const total=variants.reduce((s,v)=>s+v.n,0);
    const totalConv=variants.reduce((s,v)=>s+v.c,0);
    const pPool=totalConv/total;
    let chi2=0;
    for(const v of variants){const exp=v.n*pPool;chi2+=(v.c-exp)**2/exp+((v.n-v.c)-v.n*(1-pPool))**2/(v.n*(1-pPool));}
    const df=variants.length-1;
    // Wilson–Hilferty approximation: ((χ²/df)^(1/3) - (1 - 2/(9df))) / sqrt(2/(9df)) ~ N(0,1)
    const zChi=((Math.cbrt(chi2/df))-(1-2/(9*df)))/Math.sqrt(2/(9*df));
    const pChi=1-normCDF(zChi);
    const sigChi=pChi<alpha;
    html+=`<div class="ar-verdict ${sigChi?'sig':'insig'}">${sigChi?T[currentLang].js_variants_diff:T[currentLang].js_no_diff}</div>`;
    html+=`<div class="ar-sub">χ²(${df}) = ${chi2.toFixed(3)}, p = ${pChi.toFixed(4)}</div>`;

    // Multi-variant bar chart
    html += `<div style="margin-top:16px">
      <div style="font-size:0.72rem;font-weight:700;color:var(--ink-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Conversion rate by variant</div>
      <div style="position:relative;height:160px"><canvas id="res-chart-multi-bars"></canvas></div>
    </div>`;

    if(sigChi){
      // Holm–Bonferroni step-down across the (m-1) variant-vs-control comparisons.
      const k = variants.length - 1;
      // 1) compute raw p-values and lifts for each variant vs control A
      const comps = variants.map((v, i) => {
        if (i === 0) return null;
        const seAB = Math.sqrt(A.p*(1-A.p)/A.n + v.p*(1-v.p)/v.n);
        const zAB = (v.p - A.p) / seAB;
        const pvAB = 2*(1-normCDF(Math.abs(zAB)));
        return { i, p: pvAB, lift: (v.p-A.p)/A.p*100 };
      });
      // 2) Holm step-down: sort ascending, threshold alpha/(k-rank), stop at first non-rejection
      const ordered = comps.filter(Boolean).slice().sort((a,b)=>a.p-b.p);
      const holmSig = {};
      let stillRejecting = true;
      ordered.forEach((c, rank) => {
        const thr = alpha / (k - rank);
        c.thr = thr;
        const rejected = stillRejecting && c.p < thr;
        holmSig[c.i] = rejected;
        if (!rejected) stillRejecting = false;
      });
      // 3) pick the best variant to highlight: highest rate among Holm-significant winners
      //    (positive lift); if none significant, highlight the highest observed rate.
      let bestIdx = -1, bestRate = -Infinity;
      variants.forEach((v, i) => {
        const qualifies = i === 0 ? false : (holmSig[i] && comps[i].lift > 0);
        if (qualifies && v.p > bestRate) { bestRate = v.p; bestIdx = i; }
      });
      if (bestIdx === -1) { // no significant winner — flag the top raw rate (non-committal)
        variants.forEach((v, i) => { if (v.p > bestRate) { bestRate = v.p; bestIdx = i; } });
      }
      const anyWinner = Object.values(holmSig).some(Boolean);

      if (anyWinner && bestIdx > 0) {
        html += `<div class="best-variant-banner">🏆 ${T[currentLang].js_best_variant || 'Best variant'}: <strong>${String.fromCharCode(65+bestIdx)}</strong> — ${(variants[bestIdx].p*100).toFixed(2)}% (${comps[bestIdx].lift>0?'+':''}${comps[bestIdx].lift.toFixed(1)}% ${T[currentLang].js_vs_control || 'vs control'})</div>`;
      }

      // Full table for all variants
      html += `<div class="scroll-x" style="margin-top:16px">
        <table class="ref-table" style="min-width:560px">
          <thead><tr>
            <th>Variant</th><th>n</th><th>Rate</th><th>SD</th><th>CV</th>
            <th>95% CI</th><th>Δ vs A</th><th>P-value</th><th>${T[currentLang].js_holm_col || 'Holm'}</th>
          </tr></thead><tbody>`;
      variants.forEach((v, i) => {
        const tag = String.fromCharCode(65+i);
        const sd = Math.sqrt(v.p*(1-v.p));
        const cv = sd / v.p;
        const cilo = ((v.p - 1.96*Math.sqrt(v.p*(1-v.p)/v.n))*100).toFixed(2);
        const cihi = ((v.p + 1.96*Math.sqrt(v.p*(1-v.p)/v.n))*100).toFixed(2);
        let liftTd = '—', pTd = '—', holmTd = '—';
        if (i > 0) {
          const c = comps[i];
          const sig = holmSig[i];
          const col = sig ? RC.GR : RC.MUTED;
          liftTd = `<span style="color:${col};font-weight:600">${c.lift>0?'+':''}${c.lift.toFixed(2)}%</span>`;
          pTd = `<span style="color:${col};font-weight:600">${c.p<0.0001?'< 0.0001':c.p.toFixed(4)}</span>`;
          holmTd = sig ? `<span style="color:${RC.GR};font-weight:700">✓ ${T[currentLang].js_holm_sig || 'significant'}</span>`
                       : `<span style="color:var(--ink-faint)">${T[currentLang].js_holm_ns || 'not sig.'}</span>`;
        }
        const isBest = (i === bestIdx && anyWinner && bestIdx > 0);
        const rowStyle = isBest ? `style="background:${RC.GRL || 'rgba(26,122,74,0.10)'}"`
                                : (i===0 ? '' : `style="background:rgba(91,80,200,0.03)"`);
        html += `<tr ${rowStyle}>
          <td><span style="color:${RC.P};font-weight:700">${isBest?'🏆':(i===0?'◆':'◇')} ${tag}${i===0?` <small style="font-weight:400;color:var(--ink-faint)">(${T[currentLang].lbl_control_word||'control'})</small>`:''}</span></td>
          <td>${v.n.toLocaleString()}</td>
          <td><strong>${(v.p*100).toFixed(2)}%</strong></td>
          <td>${(sd*100).toFixed(2)}%</td>
          <td>${cv.toFixed(2)}</td>
          <td>[${cilo}%, ${cihi}%]</td>
          <td>${liftTd}</td>
          <td>${pTd}</td>
          <td>${holmTd}</td>
        </tr>`;
      });
      html += `</tbody></table></div>`;
      html += `<p style="font-size:0.78rem;color:var(--ink-faint);margin-top:8px">${(T[currentLang].js_holm_note || 'Pairwise comparisons (each variant vs control A) use the Holm–Bonferroni step-down correction across {k} comparisons — uniformly more powerful than plain Bonferroni while controlling the family-wise error rate at α = {a}.').replace('{k}', k).replace('{a}', alpha)}</p>`;
    }
    html+='</div>';
    const box=document.getElementById('conv-result');
    box.innerHTML=html; box.classList.remove('hidden');
    setTimeout(()=>drawMultiConvChart(variants), 20);
    scrollToResultMobile(box);
  }
}

// ── Toggle summary stat inputs ──
function toggleSummaryInputs(tag) {
  const ids = { A:'cont-summary-A', B:'cont-summary-B', ratioA:'ratio-summary-A', ratioB:'ratio-summary-B' };
  const el = document.getElementById(ids[tag]);
  if (!el) return;
  el.style.display = el.style.display === 'none' ? 'grid' : 'none';
}

// ── Parse a variant block (textarea or summary stats) ──
function parseBlock(block) {
  const ta = block.querySelector('.cv-raw-ta');
  const raw = ta ? ta.value.trim() : '';
  if (raw) {
    const vals = raw.split(/[\s,;]+/).map(Number).filter(v => !isNaN(v));
    if (vals.length < 2) return null;
    const m = mean(vals);
    const sd = Math.sqrt(variance(vals));
    return { vals, mean: m, sd, n: vals.length };
  }
  const m = parseFloat(block.querySelector('.cv-mean')?.value);
  const s = parseFloat(block.querySelector('.cv-sd')?.value);
  const n = parseFloat(block.querySelector('.cv-n')?.value);
  if (isNaN(m)||isNaN(s)||isNaN(n)||s<0||n<2) return null;
  return { mean: m, sd: s, n };
}

// ── Variance diagnostics ──
function varianceDiagnostics(A, B) {
  const warnings = [];
  const cvA = A.sd / Math.abs(A.mean);
  const cvB = B.sd / Math.abs(B.mean);
  const varRatio = A.sd > 0 && B.sd > 0 ? Math.max(A.sd**2, B.sd**2) / Math.min(A.sd**2, B.sd**2) : 1;
  const minN = Math.min(A.n, B.n);

  if (cvA > 1 || cvB > 1) {
    const which = cvA > cvB ? `A (CV=${cvA.toFixed(2)})` : `B (CV=${cvB.toFixed(2)})`;
    warnings.push({ level:'warn', text:
      `<strong>High variance in variant ${which}:</strong> the standard deviation exceeds the mean, which usually means a heavy-tailed distribution — a few whale users dominating. Welch's t-test still works at large n, but consider <strong>winsorising at the 99th percentile</strong> to cap outliers, or using <strong>CUPED</strong> with pre-experiment data to reduce variance by 30–50%. Both reduce noise without biasing your result.`
    });
  }

  if (varRatio > 4) {
    warnings.push({ level:'warn', text:
      `<strong>Unequal variances:</strong> one group's variance is ${varRatio.toFixed(1)}× larger than the other's. Welch's t handles this correctly (unlike Student's t), so the p-value is still valid. But the large variance difference itself is a finding — the variant may affect some users much more than others.`
    });
  }

  if (minN < 30 && (cvA > 0.5 || cvB > 0.5)) {
    warnings.push({ level:'warn', text:
      `<strong>Small sample + skewed data (n = ${minN}):</strong> the Central Limit Theorem hasn't fully applied yet. Consider <strong>Mann–Whitney U</strong> — it's more reliable than t-test when n < 30 and data is non-normal. It tests whether values in B tend to be higher than in A, without assuming a distribution shape.`
    });
  } else if (minN < 200 && (cvA > 1 || cvB > 1)) {
    warnings.push({ level:'info', text:
      `With n = ${minN} and high variance you may have low power. Even if p > 0.05, a real effect might exist but be invisible at this sample size. Run the sample size calculator to check how much data you actually need.`
    });
  }

  if (A.vals && B.vals) {
    const zerosA = A.vals.filter(v => v === 0).length / A.n;
    const zerosB = B.vals.filter(v => v === 0).length / B.n;
    if (zerosA > 0.3 || zerosB > 0.3) {
      warnings.push({ level:'warn', text:
        `<strong>${Math.round(Math.max(zerosA,zerosB)*100)}% of values are zero</strong> — zero-inflated distribution, common for revenue. Welch's t still works at large n, but consider separating the analysis: (1) <strong>conversion test</strong> — did they buy at all? (use Z-test), then (2) <strong>average value among buyers only</strong> — how much did they spend? This gives cleaner, more actionable signals.`
      });
    }
  }
  return warnings;
}

function renderDiagnostics(warnings) {
  if (!warnings.length) return '';
  return warnings.map(w =>
    `<div class="notice ${w.level === 'warn' ? 'warn' : 'info'}" style="margin-top:10px;font-size:0.82rem;line-height:1.55">${w.text}</div>`
  ).join('');
}

// ── Shared t-test result builder ──
function runWelchT(A, B, alpha, tails, resultBoxId, chartBarId, chartNullId, headerLabel, fmtFn) {
  const se   = Math.sqrt(A.sd**2/A.n + B.sd**2/B.n);
  const t    = (B.mean - A.mean) / se;
  const df   = (A.sd**2/A.n + B.sd**2/B.n)**2 / ((A.sd**2/A.n)**2/(A.n-1) + (B.sd**2/B.n)**2/(B.n-1));
  const pVal = tails === 2 ? 2*(1-normCDF(Math.abs(t))) : 1-normCDF(t);
  const sig  = pVal < alpha;
  const liftPct = (B.mean - A.mean) / A.mean * 100;
  const sigBetter = sig && liftPct > 0;
  const sigWorse  = sig && liftPct < 0;
  const ci95 = 1.96 * se;
  const diags = varianceDiagnostics(A, B);

  let html = `<div class='ar-header'>${headerLabel}</div><div class='ar-body'>`;
  const verdictClassW = sigBetter ? 'sig' : sigWorse ? 'worse' : 'insig';
  const verdictTextW  = sigBetter ? T[currentLang].js_ship
                      : sigWorse  ? T[currentLang].js_variant_worse
                      : T[currentLang].js_no_winner;
  html += `<div class="ar-verdict ${verdictClassW}">${verdictTextW}</div>`;
  html += `<div class="ar-sub">p = ${pVal.toFixed(4)} · α = ${alpha} · ${tails===2?T[currentLang].js_two_sided:T[currentLang].js_one_sided}</div>`;
  html += `<div class="ar-stats">
    <div class="ar-stat"><strong>${fmtFn(A.mean)}</strong>${T[currentLang].js_control_avg}</div>
    <div class="ar-stat"><strong>${fmtFn(B.mean)}</strong>${T[currentLang].js_variant_avg}</div>
    <div class="ar-stat"><strong>${liftPct>0?'+':''}${liftPct.toFixed(1)}%</strong>${T[currentLang].js_rel_lift}</div>
    <div class="ar-stat"><strong>±${fmtFn(ci95)}</strong>${T[currentLang].js_margin}</div>
    <div class="ar-stat"><strong>${A.sd.toFixed(2)} / ${B.sd.toFixed(2)}</strong>${T[currentLang].js_ctrl_var}</div>
    <div class="ar-stat"><strong>${(A.sd/Math.abs(A.mean)).toFixed(2)} / ${(B.sd/Math.abs(B.mean)).toFixed(2)}</strong>${T[currentLang].js_cv_ctrl_var}</div>
  </div>`;

  html += renderDiagnostics(diags);

  html += `<div class="res-chart-grid">
    <div class="chart-card" style="margin-bottom:0">
      <div class="chart-title">Values with 95% confidence intervals</div>
      <div class="chart-sub">Bars are observed averages; whiskers are CIs. Non-overlapping intervals roughly imply a significant difference.</div>
      <div class="chart-wrap"><canvas id="${chartBarId}"></canvas></div>
    </div>
    <div class="chart-card" style="margin-bottom:0">
      <div class="chart-title">How your observed difference compares to the null distribution</div>
      <div class="chart-sub">Under H₀ the difference should sit near zero. The orange marker is what you observed — red areas are rejection zones at α = ${alpha}.</div>
      <div class="chart-wrap"><canvas id="${chartNullId}"></canvas></div>
    </div>
  </div>`;

  const ciAlo = (A.mean - 1.96*A.sd/Math.sqrt(A.n)).toFixed(4);
  const ciAhi = (A.mean + 1.96*A.sd/Math.sqrt(A.n)).toFixed(4);
  const ciBlo = (B.mean - 1.96*B.sd/Math.sqrt(B.n)).toFixed(4);
  const ciBhi = (B.mean + 1.96*B.sd/Math.sqrt(B.n)).toFixed(4);
  const pDisplay = pVal < 0.0001 ? '< 0.0001' : pVal.toFixed(4);
  html += `<div class="scroll-x" style="margin-top:16px">
    <table class="ref-table" style="min-width:500px">
      <thead><tr><th>Variant</th><th>n</th><th>Mean</th><th>SD</th><th>CV</th><th>95% CI</th><th>Δ vs A</th><th>P-value</th></tr></thead>
      <tbody>
        <tr>
          <td><span style="color:${RC.P};font-weight:700">◆ A</span></td>
          <td>${A.n.toLocaleString()}</td><td><strong>${fmtFn(A.mean)}</strong></td>
          <td>${A.sd.toFixed(3)}</td><td>${(A.sd/Math.abs(A.mean)).toFixed(2)}</td>
          <td>[${ciAlo}, ${ciAhi}]</td><td>—</td><td>—</td>
        </tr>
        <tr style="background:${sigBetter?'rgba(26,122,74,0.06)':sigWorse?'rgba(220,50,50,0.06)':'rgba(91,80,200,0.04)'}">
          <td><span style="color:${sigBetter?RC.GR:sigWorse?RC.RED:RC.P};font-weight:700">${sigBetter?'★':sigWorse?'▼':'◆'} B</span></td>
          <td>${B.n.toLocaleString()}</td><td><strong>${fmtFn(B.mean)}</strong></td>
          <td>${B.sd.toFixed(3)}</td><td>${(B.sd/Math.abs(B.mean)).toFixed(2)}</td>
          <td>[${ciBlo}, ${ciBhi}]</td>
          <td style="color:${sigBetter?RC.GR:sigWorse?RC.RED:RC.MUTED};font-weight:600">${liftPct>0?'+':''}${liftPct.toFixed(2)}%</td>
          <td style="color:${sigBetter?RC.GR:sigWorse?RC.RED:RC.MUTED};font-weight:600">${pDisplay}</td>
        </tr>
      </tbody>
    </table>
  </div>`;

  html += sigBetter
    ? `<div class="notice success" style="margin-top:12px"><strong>${T[currentLang].js_before_ship}</strong><ul style="margin-top:6px;padding-left:16px"><li>${T[currentLang].js_guardrails}</li><li>${T[currentLang].js_segments}</li></ul></div>`
    : `<div class="notice info" style="margin-top:12px"><strong>${T[currentLang].js_not_sig}</strong> ${T[currentLang].js_keep_running}</div>`;

  html += '</div>';
  const box = document.getElementById(resultBoxId);
  box.innerHTML = html; box.classList.remove('hidden');
  scrollToResultMobile(box);
  saveRecentResult({
    type: headerLabel,
    verdict: verdictTextW,
    status: sigBetter ? 'win' : sigWorse ? 'lose' : 'neutral',
    meta: `${fmtFn(B.mean)} vs ${fmtFn(A.mean)} · ${liftPct>0?'+':''}${liftPct.toFixed(1)}% · p=${pVal.toFixed(3)}`,
    inputs: [
      { k: T[currentLang].ri_control, v: `${T[currentLang].ri_mean} ${fmtFn(A.mean)}, SD ${A.sd.toFixed(2)}, n=${A.n.toLocaleString()}` },
      { k: T[currentLang].ri_variant, v: `${T[currentLang].ri_mean} ${fmtFn(B.mean)}, SD ${B.sd.toFixed(2)}, n=${B.n.toLocaleString()}` },
      { k: T[currentLang].ri_settings, v: `α=${alpha}, ${tails===2?T[currentLang].js_two_sided:T[currentLang].js_one_sided}` },
    ],
  });

  setTimeout(() => {
    const ciA = 1.96 * A.sd / Math.sqrt(A.n);
    const ciB = 1.96 * B.sd / Math.sqrt(B.n);
    drawBarsCI(chartBarId,
      [{label:'A', subLabel:'CONTROL', val:A.mean, ci:ciA, col:RC.P, colFill:RC.PL},
       {label:'B', subLabel:'', val:B.mean, ci:ciB, col:sig?RC.GR:RC.P, colFill:sig?RC.GRL:RC.PL}],
      fmtFn);
    drawNullDist(chartNullId, A.mean, B.mean, se, t, alpha, tails, sig, fmtFn);
  }, 20);
}

// ── Analyse continuous ──
function analyseContinuous() {
  const blocks = document.querySelectorAll('#cont-variants .cont-variant-block');
  if (blocks.length < 2) { showInlineError('cont-result', T[currentLang].js_err_need_two); return; }
  const A = parseBlock(blocks[0]);
  const B = parseBlock(blocks[1]);
  if (!A||!B) { showInlineError('cont-result', T[currentLang].js_err_paste_values); return; }
  const alpha = parseFloat(document.querySelector('input[name="ac-alpha"]:checked').value);
  const tails = parseInt(document.querySelector('input[name="ac-tails"]:checked').value);
  runWelchT(A, B, alpha, tails, 'cont-result', 'res-chart-cont-bars', 'res-chart-cont-lift',
    "Results — Continuous metric (Welch's t-test)", v => v.toFixed(2));
}

// ── Analyse ratio ──
function analyseRatio() {
  const blocks = document.querySelectorAll('#ratio-variants .cont-variant-block');
  if (blocks.length < 2) { showInlineError('ratio-result', T[currentLang].js_err_need_two); return; }
  const A = parseBlock(blocks[0]);
  const B = parseBlock(blocks[1]);
  if (!A||!B) { showInlineError('ratio-result', T[currentLang].js_err_paste_ratio); return; }
  const alpha = parseFloat(document.querySelector('input[name="ar-alpha"]:checked').value);
  const tails = parseInt(document.querySelector('input[name="ar-tails"]:checked').value);
  runWelchT(A, B, alpha, tails, 'ratio-result', 'res-chart-ratio-bars', 'res-chart-ratio-lift',
    "Results — Ratio metric (Welch's t on aggregated per-user values)", v => v.toFixed(3));
}

// ── Result charts ────────────────────────────────────
function resCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
  const wrap = canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const W = wrap.clientWidth, H = wrap.clientHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  return { ctx, W, H };
}
let RC = {
  P: '#5b50c8', PL: 'rgba(91,80,200,0.18)',
  OR: '#e8832a', ORL: 'rgba(232,131,42,0.18)',
  GR: '#1a7a4a', GRL: 'rgba(26,122,74,0.15)',
  RED: '#dc3232', REDL: 'rgba(220,50,50,0.15)',
  MUTED: '#9a9cb8', INK: '#1a1a2e', BG: '#ffffff',
  BORDER: '#e2e4ef'
};

// ── Download a chart canvas as a PNG (with solid background + padding) ──
function downloadChart(canvasId, filename) {
  const src = document.getElementById(canvasId);
  if (!src) return;
  const pad = 24;
  const out = document.createElement('canvas');
  out.width = src.width + pad * 2;
  out.height = src.height + pad * 2;
  const ctx = out.getContext('2d');
  // solid background matching the current theme card colour
  ctx.fillStyle = RC.BG || '#ffffff';
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(src, pad, pad);
  // small watermark
  ctx.fillStyle = RC.MUTED || '#9a9cb8';
  ctx.font = '12px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('A/B Testing Calculator', out.width - pad, out.height - 8);
  out.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (filename || 'chart') + '.png';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}

// ── Case-study mini distribution charts ──
function drawCaseStudyCharts() {
  const dpr = window.devicePixelRatio || 1;
  function csInit(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const wrap = canvas.parentElement;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    if (!W || !H) return null;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    return { ctx, W, H };
  }
  function grad(ctx, hex, topY, botY) {
    const g = ctx.createLinearGradient(0, topY, 0, botY);
    const h = hex.replace('#',''); const n = parseInt(h, 16);
    const rgb = `${(n>>16)&255},${(n>>8)&255},${n&255}`;
    g.addColorStop(0, `rgba(${rgb},0.34)`);
    g.addColorStop(1, `rgba(${rgb},0.03)`);
    return g;
  }
  function curve(ctx, W, H, f, hex, opts) {
    opts = opts || {};
    const pad = { t: 14, b: 16, l: 12, r: 12 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const N = 90; const ys = []; let maxY = 0;
    for (let j=0;j<=N;j++){ const y=Math.max(0,f(j/N)); ys.push(y); if(y>maxY)maxY=y; }
    const toX = j => pad.l + (j/N)*pw;
    const toY = y => pad.t + ph - (y/maxY)*ph*0.9;
    ctx.beginPath(); ctx.moveTo(toX(0), pad.t+ph);
    ys.forEach((y,j)=>ctx.lineTo(toX(j),toY(y)));
    ctx.lineTo(toX(N), pad.t+ph); ctx.closePath();
    ctx.fillStyle = grad(ctx, hex, pad.t, pad.t+ph); ctx.fill();
    ctx.beginPath();
    ys.forEach((y,j)=>j===0?ctx.moveTo(toX(j),toY(y)):ctx.lineTo(toX(j),toY(y)));
    ctx.strokeStyle = hex; ctx.lineWidth = 2.4; ctx.stroke();
    // baseline
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t+ph); ctx.lineTo(pad.l+pw, pad.t+ph);
    ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();
    // optional vertical markers at given t positions: [{t, color, label}]
    (opts.markers || []).forEach(m => {
      const x = toX(m.t * N);
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t+ph);
      ctx.strokeStyle = m.color; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = m.color; ctx.font = '600 9.5px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(m.label, x, pad.t + 9);
    });
  }
  function bars(ctx, W, H, vals, hex) {
    const pad = { t: 14, b: 16, l: 12, r: 12 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const m = vals.length; const maxY = Math.max(...vals);
    const gap = pw/m*0.22; const bw = (pw - gap*(m+1))/m;
    const g = grad(ctx, hex, pad.t, pad.t+ph);
    vals.forEach((v,j)=>{
      const x = pad.l + gap + j*(bw+gap);
      const h = (v/maxY)*ph*0.9; const y = pad.t+ph-h;
      ctx.fillStyle = g; ctx.strokeStyle = hex; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.roundRect(x, y, bw, h, Math.min(3,bw/2)); ctx.fill(); ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t+ph); ctx.lineTo(pad.l+pw, pad.t+ph);
    ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();
  }

  // Case 1: binary proportion — two bars (did not convert vs converted)
  (function(){ const c = csInit('cs-chart-1'); if(!c) return;
    bars(c.ctx, c.W, c.H, [97, 3], RC.P);
    c.ctx.fillStyle = RC.MUTED; c.ctx.font = '600 9.5px Inter, sans-serif'; c.ctx.textAlign='center';
    const pad=12, pw=c.W-pad*2, bw=(pw-(pw/2*0.22)*3)/2, gap=pw/2*0.22;
    c.ctx.fillText('0 (no)', pad+gap+bw/2, c.H-4);
    c.ctx.fillText('1 (yes)', pad+gap*2+bw+bw/2, c.H-4);
  })();
  // Case 2: extreme right-skew with a far outlier — mean ≫ median
  (function(){ const c = csInit('cs-chart-2'); if(!c) return;
    curve(c.ctx, c.W, c.H, t => { const x=t*5; return (x*Math.exp(-x))/0.37 + 0.04/(1+Math.pow((t-0.86)/0.05,2)); }, RC.OR,
      { markers: [ {t:0.16, color:RC.GR, label:'median'}, {t:0.40, color:RC.RED, label:'mean'} ] });
  })();
  // Case 3: bimodal — two humps with the misleading mean in the empty valley
  (function(){ const c = csInit('cs-chart-3'); if(!c) return;
    curve(c.ctx, c.W, c.H, t => Math.exp(-Math.pow((t-0.22)/0.10,2)/2) + 0.9*Math.exp(-Math.pow((t-0.78)/0.10,2)/2), RC.P,
      { markers: [ {t:0.5, color:RC.RED, label:'mean'} ] });
  })();
}

// ── Distribution anatomy charts (mean/median/mode + SD rule) ──
function drawAnatomyCharts() {
  const dpr = window.devicePixelRatio || 1;
  function aInit(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const wrap = canvas.parentElement;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    if (!W || !H) return null;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    return { ctx, W, H };
  }
  function grad(ctx, hex, topY, botY, ta, ba) {
    const g = ctx.createLinearGradient(0, topY, 0, botY);
    const h = hex.replace('#',''); const n = parseInt(h, 16);
    const rgb = `${(n>>16)&255},${(n>>8)&255},${n&255}`;
    g.addColorStop(0, `rgba(${rgb},${ta})`); g.addColorStop(1, `rgba(${rgb},${ba})`);
    return g;
  }
  const L = T[currentLang];

  // Normal with per-segment shares (68-95-99.7), styled like the classic reference figure
  (function(){ const c = aInit('anat-chart-normal'); if(!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 30, b: 34, l: 16, r: 16 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const mu = pad.l + pw/2;
    const sd = pw / 8.0;                       // px per 1 SD (±4 SD visible)
    const f = x => Math.exp(-0.5 * Math.pow((x-mu)/sd, 2));
    const toY = v => pad.t + ph - v*ph*0.86;
    const hx = RC.P.replace('#',''); const rn = parseInt(hx,16);
    const R=(rn>>16)&255, G=(rn>>8)&255, B=rn&255;
    // Per-segment fills with increasing depth toward the centre (mirrors the reference image)
    // segments defined by [from*sd, to*sd] from the mean, with a fill alpha and a % label
    const segs = [
      { a:0, b:1, alpha:0.55, pct:'34.1%' },
      { a:1, b:2, alpha:0.32, pct:'13.6%' },
      { a:2, b:3, alpha:0.16, pct:'2.1%' },
      { a:3, b:4, alpha:0.07, pct:'0.1%' },
    ];
    function fillSeg(x0, x1, alpha){
      ctx.beginPath(); ctx.moveTo(x0, toY(0));
      for (let x=x0; x<=x1; x+=1) ctx.lineTo(x, toY(f(x)));
      ctx.lineTo(x1, toY(0)); ctx.closePath();
      ctx.fillStyle = `rgba(${R},${G},${B},${alpha})`; ctx.fill();
    }
    // draw both sides of each segment
    segs.forEach(s => {
      fillSeg(mu + s.a*sd, mu + s.b*sd, s.alpha);     // right
      fillSeg(mu - s.b*sd, mu - s.a*sd, s.alpha);     // left
    });
    // σ gridlines
    ctx.textAlign = 'center';
    for (let k=-4; k<=4; k++){
      const x = mu + k*sd;
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, toY(0));
      ctx.strokeStyle = k===0 ? '#ffffff' : 'rgba(255,255,255,0.5)';
      ctx.lineWidth = k===0 ? 1.5 : 1;
      if (Math.abs(k)<=3) ctx.stroke();
      ctx.fillStyle = RC.MUTED; ctx.font = '600 9.5px Inter, sans-serif';
      if (Math.abs(k)<=3) ctx.fillText(k===0?'0':(k>0?`${k}σ`:`${k}σ`), x, H - 18);
    }
    // curve outline
    ctx.beginPath();
    for (let x=pad.l; x<=pad.l+pw; x+=1) (x===pad.l?ctx.moveTo(x,toY(f(x))):ctx.lineTo(x,toY(f(x))));
    ctx.strokeStyle = RC.P; ctx.lineWidth = 2.5; ctx.stroke();
    // baseline
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(pad.l+pw, toY(0));
    ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();
    // segment % labels — centred in each segment, inside the curve where there is room
    ctx.font = '700 10px Inter, sans-serif';
    const lblY = [ toY(0.30), toY(0.30) ];   // 34.1% sits high inside the central band
    // 34.1% both sides
    ctx.fillStyle = '#fff';
    ctx.fillText('34.1%', mu - 0.5*sd, toY(0.34));
    ctx.fillText('34.1%', mu + 0.5*sd, toY(0.34));
    // 13.6% both sides (white on mid band)
    ctx.fillStyle = '#1c3d5a';
    ctx.fillText('13.6%', mu - 1.5*sd, toY(0.07));
    ctx.fillText('13.6%', mu + 1.5*sd, toY(0.07));
    // 2.1% and 0.1% sit above the curve with little leader text
    ctx.fillStyle = RC.MUTED; ctx.font = '600 9px Inter, sans-serif';
    ctx.fillText('2.1%', mu - 2.5*sd, toY(0.10));
    ctx.fillText('2.1%', mu + 2.5*sd, toY(0.10));
    ctx.fillText('0.1%', mu - 3.4*sd, toY(0.05));
    ctx.fillText('0.1%', mu + 3.4*sd, toY(0.05));
    // top summary brackets: 68% / 95% / 99.7%
    ctx.fillStyle = RC.INK; ctx.font = '700 9.5px Inter, sans-serif'; ctx.textAlign='center';
    ctx.fillText('68%', mu, pad.t - 18);
    ctx.fillStyle = RC.MUTED; ctx.font = '600 9px Inter, sans-serif';
    ctx.fillText('95% within ±2σ · 99.7% within ±3σ', mu, pad.t - 6);
    // mean=median=mode marker
    ctx.fillStyle = RC.GR; ctx.font = '700 9.5px Inter, sans-serif';
    ctx.fillText(L.anat_mmm || 'mean = median = mode', mu, H - 4);
  })();

  // Skewed helper: gamma-like shape, with mode/median/mean markers
  function drawSkew(id, mirror) {
    const c = aInit(id); if(!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 18, b: 40, l: 16, r: 16 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    // gamma-ish density on t in [0,1]
    const dens = u => { const x = u*6; return x*x*Math.exp(-x); };
    const N = 160;
    const raw = [];
    let maxY = 0;
    for (let i=0;i<=N;i++){ const u=i/N; const y=dens(u); raw.push(y); if(y>maxY)maxY=y; }
    // compute mode/median/mean in u-space
    let modeU = 0, best=-1;
    raw.forEach((y,i)=>{ if(y>best){best=y;modeU=i/N;} });
    const total = raw.reduce((s,y)=>s+y,0);
    let cum=0, medianU=0;
    for (let i=0;i<=N;i++){ cum+=raw[i]; if(cum>=total/2){ medianU=i/N; break; } }
    let meanNum=0; raw.forEach((y,i)=>meanNum+=y*(i/N)); const meanU=meanNum/total;
    const tx = u => mirror ? (1-u) : u;
    const toX = u => pad.l + tx(u)*pw;
    const toY = y => pad.t + ph - (y/maxY)*ph*0.9;
    const hex = mirror ? RC.GR : RC.OR;
    // fill
    ctx.beginPath(); ctx.moveTo(toX(0), toY(0));
    for (let i=0;i<=N;i++) ctx.lineTo(toX(i/N), toY(raw[i]));
    ctx.lineTo(toX(1), toY(0)); ctx.closePath();
    ctx.fillStyle = grad(ctx, hex, pad.t, pad.t+ph, 0.30, 0.03); ctx.fill();
    // curve
    ctx.beginPath();
    for (let i=0;i<=N;i++) (i===0?ctx.moveTo(toX(0),toY(raw[0])):ctx.lineTo(toX(i/N),toY(raw[i])));
    ctx.strokeStyle = hex; ctx.lineWidth = 2.5; ctx.stroke();
    // baseline
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(pad.l+pw, toY(0));
    ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();
    // markers — ordered by position so labels stagger cleanly
    const marks = [
      { u: modeU,  color: RC.P,  label: L.anat_mode   || 'mode' },
      { u: medianU,color: RC.GR2 || '#0d9488', label: L.anat_median || 'median' },
      { u: meanU,  color: RC.RED, label: L.anat_mean  || 'mean' },
    ].sort((a,b)=> tx(a.u) - tx(b.u)); // left-to-right on screen
    marks.forEach((m, idx) => {
      const x = toX(m.u);
      ctx.beginPath(); ctx.moveTo(x, pad.t+2); ctx.lineTo(x, toY(0));
      ctx.strokeStyle = m.color; ctx.lineWidth = 1.6; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = m.color; ctx.font = '700 9.5px Inter, sans-serif';
      // stack labels top-to-bottom (each ~13px lower) and align away from the crowded centre
      const labelY = pad.t + 9 + idx*13;
      // nudge left-most label left, right-most right, so they don't sit on the lines
      ctx.textAlign = idx===0 ? 'end' : (idx===marks.length-1 ? 'start' : 'center');
      const dx = idx===0 ? -3 : (idx===marks.length-1 ? 3 : 0);
      ctx.fillText(m.label, x + dx, labelY);
    });
  }
  drawSkew('anat-chart-right', false);
  drawSkew('anat-chart-left', true);

  // Binomial: discrete bars, n=20 p=0.3, mean=np marker
  (function(){ const c = aInit('anat-chart-binom'); if(!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 18, b: 40, l: 16, r: 16 };
    const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    const n = 20, p = 0.3;
    // binomial pmf
    function choose(n,k){ let r=1; for(let i=0;i<k;i++) r=r*(n-i)/(i+1); return r; }
    const pmf = [];
    let maxY = 0;
    for (let k=0;k<=n;k++){ const v = choose(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k); pmf.push(v); if(v>maxY)maxY=v; }
    const m = n+1;
    const gap = pw/m*0.22; const bw = (pw - gap*(m+1))/m;
    const toY = v => pad.t + ph - (v/maxY)*ph*0.9;
    const g = grad(ctx, RC.P, pad.t, pad.t+ph, 0.5, 0.12);
    for (let k=0;k<=n;k++){
      const x = pad.l + gap + k*(bw+gap);
      const h = (pmf[k]/maxY)*ph*0.9; const y = pad.t+ph-h;
      ctx.fillStyle = g; ctx.strokeStyle = RC.P; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.roundRect(x, y, bw, h, Math.min(2.5,bw/2)); ctx.fill(); ctx.stroke();
    }
    // baseline
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(pad.l+pw, toY(0));
    ctx.strokeStyle = RC.MUTED; ctx.lineWidth = 1; ctx.stroke();
    // mean = n*p marker
    const meanK = n*p;
    const xMean = pad.l + gap + meanK*(bw+gap) + bw/2;
    ctx.beginPath(); ctx.moveTo(xMean, pad.t+6); ctx.lineTo(xMean, toY(0));
    ctx.strokeStyle = RC.RED; ctx.lineWidth = 1.6; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = RC.RED; ctx.font = '700 9.5px Inter, sans-serif'; ctx.textAlign='center';
    ctx.fillText((L.anat_binom_mean || 'mean = n·p = 6'), xMean, pad.t + 4);
    // x ticks
    ctx.fillStyle = RC.MUTED; ctx.font = '600 9px Inter, sans-serif';
    [0,5,10,15,20].forEach(k=>{ const x=pad.l+gap+k*(bw+gap)+bw/2; ctx.fillText(k, x, H-24); });
    ctx.fillText(L.anat_binom_x || 'number of successes (k)', pad.l+pw/2, H-8);
  })();
}


// Bar chart with CI whiskers — conversion rates or means
function drawBarCI(canvasId, labels, values, cis, colors, yLabel) {
  const c = resCanvas(canvasId); if (!c) return;
  const { ctx, W, H } = c;
  const pad = { t: 16, b: 36, l: 8, r: 8 };
  const n = labels.length;
  const barW = Math.min(60, (W - pad.l - pad.r) / n * 0.5);
  const gap   = (W - pad.l - pad.r - barW * n) / (n + 1);
  const yMax  = Math.max(...values.map((v,i) => v + cis[i])) * 1.25;
  const ch    = H - pad.t - pad.b;

  function toY(v) { return pad.t + ch - (v / yMax) * ch; }
  function barX(i) { return pad.l + gap * (i + 1) + barW * i; }

  // y gridlines (3)
  [0.33, 0.66, 1].forEach(f => {
    const y = toY(yMax * f);
    ctx.beginPath(); ctx.setLineDash([2, 4]);
    ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
    ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '10px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.MUTED; ctx.textAlign = 'right';
    const val = yMax * f;
    ctx.fillText(val < 1 ? (val*100).toFixed(1)+'%' : val.toFixed(1), pad.l + 36, y + 3);
  });

  values.forEach((v, i) => {
    const x = barX(i);
    const yTop = toY(v);
    const yBase = toY(0);

    // bar
    ctx.beginPath();
    ctx.roundRect(x, yTop, barW, yBase - yTop, 4);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // CI whisker
    const ciPx = (cis[i] / yMax) * ch;
    const mid = x + barW / 2;
    ctx.beginPath();
    ctx.moveTo(mid, yTop - ciPx);
    ctx.lineTo(mid, yTop + ciPx);
    ctx.strokeStyle = i === 0 ? 'rgba(91,80,200,0.6)' : 'rgba(232,131,42,0.8)';
    ctx.lineWidth = 2; ctx.stroke();
    // caps
    [yTop - ciPx, yTop + ciPx].forEach(y => {
      ctx.beginPath(); ctx.moveTo(mid - 5, y); ctx.lineTo(mid + 5, y);
      ctx.stroke();
    });

    // value label above bar
    ctx.font = 'bold 11px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.INK; ctx.textAlign = 'center';
    ctx.fillText(v < 1 ? (v*100).toFixed(2)+'%' : v.toFixed(2), mid, yTop - ciPx - 5);

    // x label
    ctx.font = '11px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.MUTED; ctx.textAlign = 'center';
    ctx.fillText(labels[i], mid, H - 6);
  });
}

// Lift meter: horizontal bar from 0, CI range shaded, confidence arc
function drawLiftMeter(canvasId, liftPct, ciPct, sig, pVal, alpha) {
  const c = resCanvas(canvasId); if (!c) return;
  const { ctx, W, H } = c;

  // ── Confidence arc (top half) ──
  const confidence = Math.min((1 - pVal) * 100, 99.99);
  const cx = W / 2, cy = H * 0.44, r = Math.min(W * 0.3, H * 0.38);

  // background track
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.strokeStyle = RC.BG; ctx.lineWidth = 12; ctx.stroke();

  // filled arc
  const endAngle = Math.PI + (confidence / 100) * Math.PI;
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, endAngle);
  ctx.strokeStyle = sig ? RC.GR : RC.MUTED;
  ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.stroke();

  // needle
  const needleAngle = Math.PI + (confidence / 100) * Math.PI;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(needleAngle) * (r - 4), cy + Math.sin(needleAngle) * (r - 4));
  ctx.strokeStyle = RC.INK; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();

  // centre dot
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2);
  ctx.fillStyle = RC.INK; ctx.fill();

  // confidence %
  ctx.font = 'bold 18px Inter,system-ui,sans-serif';
  ctx.fillStyle = sig ? RC.GR : RC.MUTED;
  ctx.textAlign = 'center';
  ctx.fillText(confidence.toFixed(1) + '%', cx, cy - 4);

  ctx.font = '10px Inter,system-ui,sans-serif';
  ctx.fillStyle = RC.MUTED;
  ctx.fillText('confidence', cx, cy + 12);

  // ── Lift label below ──
  const liftStr = (liftPct > 0 ? '+' : '') + liftPct.toFixed(1) + '%';
  const ciStr   = '±' + ciPct.toFixed(1) + '%';
  ctx.font = 'bold 13px Inter,system-ui,sans-serif';
  ctx.fillStyle = liftPct > 0 ? RC.GR : liftPct < 0 ? RC.RED : RC.MUTED;
  ctx.fillText(liftStr + ' lift', cx, H - 22);
  ctx.font = '10px Inter,system-ui,sans-serif';
  ctx.fillStyle = RC.MUTED;
  ctx.fillText(ciStr + ' margin of error', cx, H - 8);
}

// Multi-variant horizontal bar chart
function drawMultiConvChart(variants) {
  const c = resCanvas('res-chart-multi-bars'); if (!c) return;
  const { ctx, W, H } = c;
  const pad = { t: 12, b: 12, l: 36, r: 60 };
  const ch = H - pad.t - pad.b;
  const barH = Math.min(24, ch / variants.length * 0.6);
  const gap  = (ch - barH * variants.length) / (variants.length + 1);
  const maxP = Math.max(...variants.map(v => v.p)) * 1.2;
  const cw   = W - pad.l - pad.r;
  const colors = [RC.PL.replace('0.18','0.7'), RC.ORL.replace('0.18','0.7'),
                  'rgba(26,122,74,0.7)', 'rgba(220,50,50,0.6)'];
  const strokes= [RC.P, RC.OR, RC.GR, RC.RED];

  function toX(p) { return pad.l + (p / maxP) * cw; }

  variants.forEach((v, i) => {
    const y = pad.t + gap * (i + 1) + barH * i;
    const tag = String.fromCharCode(65 + i);
    const ci = 1.96 * Math.sqrt(v.p*(1-v.p)/v.n);

    // bar
    ctx.beginPath();
    ctx.roundRect(pad.l, y, (v.p / maxP) * cw, barH, 3);
    ctx.fillStyle = i === 0 ? RC.PL.replace('0.18','0.65') : colors[i] || 'rgba(91,80,200,0.4)';
    ctx.fill();
    ctx.strokeStyle = strokes[i] || RC.P; ctx.lineWidth = 1.5; ctx.stroke();

    // CI whisker
    const ciX = (ci / maxP) * cw;
    const mid = y + barH / 2;
    const barEnd = toX(v.p);
    ctx.beginPath();
    ctx.moveTo(barEnd - ciX, mid); ctx.lineTo(barEnd + ciX, mid);
    ctx.strokeStyle = 'rgba(100,100,120,0.5)'; ctx.lineWidth = 2; ctx.stroke();
    [barEnd - ciX, barEnd + ciX].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, mid-4); ctx.lineTo(x, mid+4); ctx.stroke();
    });

    // label
    ctx.font = '11px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.MUTED; ctx.textAlign = 'right';
    ctx.fillText(tag, pad.l - 4, mid + 4);

    // value
    ctx.font = 'bold 11px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.INK; ctx.textAlign = 'left';
    ctx.fillText((v.p*100).toFixed(2)+'%', toX(v.p) + ciX + 4, mid + 4);
  });
}

function drawConvCharts(A, B, se, z, pVal, sig, alpha, tails) {
  const ciA = 1.96 * Math.sqrt(A.p*(1-A.p)/A.n);
  const ciB = 1.96 * Math.sqrt(B.p*(1-B.p)/B.n);
  drawBarsCI('res-chart-conv-bars',
    [{label:'A', subLabel:'CONTROL', val:A.p, ci:ciA, col:RC.P, colFill:RC.PL},
     {label:'B', subLabel:'', val:B.p, ci:ciB, col:sig?RC.GR:RC.P, colFill:sig?RC.GRL:RC.PL}],
    v => (v*100).toFixed(2)+'%');
  drawNullDist('res-chart-conv-lift', A.p, B.p, se, z, alpha, tails, sig,
    v => (v*100).toFixed(2)+'%');
}

function drawContCharts(A, B, se, t, pVal, sig, alpha, ci95, liftPct) {
  const ciA = 1.96 * A.sd / Math.sqrt(A.n);
  const ciB = 1.96 * B.sd / Math.sqrt(B.n);
  drawBarsCI('res-chart-cont-bars',
    [{label:'A', subLabel:'CONTROL', val:A.mean, ci:ciA, col:RC.P, colFill:'rgba(91,80,200,0.25)'},
     {label:'B', subLabel:'', val:B.mean, ci:ciB, col:sig?RC.GR:RC.P, colFill:sig?'rgba(26,122,74,0.3)':'rgba(91,80,200,0.55)'}],
    v => v.toFixed(2));
  drawNullDist('res-chart-cont-lift', A.mean, B.mean, se, t, alpha, tails, sig,
    v => v.toFixed(3));
}

// Chart 1: Vertical bars with CI whiskers, zoomed y-axis
function drawBarsCI(canvasId, bars, fmt) {
  const c = resCanvas(canvasId); if (!c) return;
  const { ctx, W, H } = c;

  // Adaptive left padding: wider canvas gets more room for y-labels
  const lpad = W > 300 ? 46 : 38;
  const pad = { t: 28, b: 42, l: lpad, r: 10 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const n = bars.length;
  const barW = Math.min(80, cw / n * 0.5);
  const spacing = cw / n;

  // y range: zoom into data with margin
  const allWithCI = bars.flatMap(b => [b.val - b.ci, b.val + b.ci]);
  const dataMin = Math.min(...allWithCI);
  const dataMax = Math.max(...allWithCI);
  const range = dataMax - dataMin || dataMax * 0.1;
  const yMin = Math.max(0, dataMin - range * 0.5);
  const yMax = dataMax + range * 0.45;

  function toY(v) { return pad.t + ch - ((v - yMin) / (yMax - yMin)) * ch; }
  function barLeft(i) { return pad.l + spacing * i + (spacing - barW) / 2; }

  // Gridlines + y labels (right-aligned, drawn into pad.l space)
  const nGrids = 3;
  for (let g = 0; g <= nGrids; g++) {
    const v = yMin + (yMax - yMin) * g / nGrids;
    const y = toY(v);
    ctx.beginPath(); ctx.setLineDash([2, 4]);
    ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
    ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '9px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.MUTED; ctx.textAlign = 'right';
    ctx.fillText(fmt(v), pad.l - 3, y + 3);
  }

  // Baseline
  ctx.beginPath();
  ctx.moveTo(pad.l, toY(yMin)); ctx.lineTo(W - pad.r, toY(yMin));
  ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();

  bars.forEach((b, i) => {
    const x = barLeft(i);
    const yTop = toY(b.val);
    const yBase = toY(yMin);
    const mid = x + barW / 2;

    // Bar
    ctx.beginPath();
    ctx.roundRect(x, yTop, barW, yBase - yTop, 4);
    ctx.fillStyle = b.colFill; ctx.fill();
    ctx.strokeStyle = b.col; ctx.lineWidth = 1.5; ctx.stroke();

    // CI whisker
    const ciPx = (b.ci / (yMax - yMin)) * ch;
    ctx.beginPath();
    ctx.moveTo(mid, yTop - ciPx); ctx.lineTo(mid, yTop + ciPx);
    ctx.strokeStyle = 'rgba(60,60,80,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    [yTop - ciPx, yTop + ciPx].forEach(y => {
      ctx.beginPath(); ctx.moveTo(mid - 5, y); ctx.lineTo(mid + 5, y);
      ctx.strokeStyle = 'rgba(60,60,80,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Value label above whisker
    ctx.font = 'bold 10px Inter,system-ui,sans-serif';
    ctx.fillStyle = RC.INK; ctx.textAlign = 'center';
    ctx.fillText(fmt(b.val), mid, yTop - ciPx - 5);

    // Variant letter
    ctx.font = 'bold 11px Inter,system-ui,sans-serif';
    ctx.fillStyle = b.col; ctx.textAlign = 'center';
    ctx.fillText(b.label, mid, H - 24);

    // Sub-label (CONTROL)
    if (b.subLabel) {
      ctx.font = 'bold 8px Inter,system-ui,sans-serif';
      ctx.fillStyle = 'rgba(91,80,200,0.7)';
      ctx.fillText(b.subLabel, mid, H - 13);
    }
  });
}

// Chart 2: Null distribution of differences + observed marker
function drawNullDist(canvasId, muA, muB, se, stat, alpha, tails, sig, fmt) {
  const c = resCanvas(canvasId); if (!c) return;
  const { ctx, W, H } = c;

  const diff = muB - muA;           // observed difference
  const zCrit = normInvCDF(tails === 1 ? 1 - alpha : 1 - alpha / 2);
  const pad = { t: 36, b: 40, l: 12, r: 12 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

  // x range: centre on 0 (null), show ±4 SE, always include the observed diff
  const halfRange = Math.max(zCrit * se * 1.6, Math.abs(diff) * 1.25);
  const xMin = -halfRange, xMax = halfRange;
  const yMax = normPDF(0, 0, se) * 1.2;

  function toX(v) { return pad.l + (v - xMin) / (xMax - xMin) * cw; }
  function toY(y) { return pad.t + ch - (y / yMax) * ch; }

  // Rejection fills
  const critL = -zCrit * se, critR = zCrit * se;

  function fillTail(from, to) {
    ctx.beginPath();
    ctx.moveTo(toX(from), toY(0));
    const step = (to - from) / 60;
    for (let x = from; x <= to; x += step)
      ctx.lineTo(toX(x), toY(normPDF(x, 0, se)));
    ctx.lineTo(toX(to), toY(0)); ctx.closePath();
    ctx.fillStyle = 'rgba(220,50,50,0.18)'; ctx.fill();
  }
  fillTail(xMin, critL);
  fillTail(critR, xMax);

  // Main bell fill
  ctx.beginPath();
  ctx.moveTo(toX(xMin), toY(0));
  for (let x = xMin; x <= xMax; x += (xMax-xMin)/300)
    ctx.lineTo(toX(x), toY(normPDF(x, 0, se)));
  ctx.lineTo(toX(xMax), toY(0)); ctx.closePath();
  ctx.fillStyle = 'rgba(91,80,200,0.1)'; ctx.fill();

  // Bell curve
  ctx.beginPath();
  for (let x = xMin; x <= xMax; x += (xMax-xMin)/300) {
    const px = toX(x), py = toY(normPDF(x, 0, se));
    x === xMin ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.strokeStyle = RC.P; ctx.lineWidth = 2; ctx.stroke();

  // Critical lines
  [critL, critR].forEach((cx, i) => {
    ctx.beginPath(); ctx.setLineDash([4, 4]);
    ctx.moveTo(toX(cx), toY(0));
    ctx.lineTo(toX(cx), toY(normPDF(cx, 0, se) * 0.9));
    ctx.strokeStyle = RC.MUTED; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '9px Inter,system-ui,sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = RC.MUTED;
    const lbl = i === 0 ? `−${zCrit.toFixed(2)} SE` : `+${zCrit.toFixed(2)} SE (critical)`;
    ctx.fillText(lbl, toX(cx), pad.t - 20);
  });

  // Baseline
  ctx.beginPath();
  ctx.moveTo(pad.l, toY(0)); ctx.lineTo(W - pad.r, toY(0));
  ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke();

  // Observed marker line
  const obsX = toX(diff);
  const obsCol = sig ? RC.OR : RC.MUTED;
  ctx.beginPath();
  ctx.moveTo(obsX, toY(0));
  ctx.lineTo(obsX, pad.t + 4);
  ctx.strokeStyle = obsCol; ctx.lineWidth = 2.5; ctx.stroke();

  // Observed dot on baseline
  ctx.beginPath(); ctx.arc(obsX, toY(0), 4, 0, Math.PI*2);
  ctx.fillStyle = obsCol; ctx.fill();

  // Observed label — clamped within canvas bounds
  ctx.font = 'bold 9px Inter,system-ui,sans-serif';
  ctx.fillStyle = obsCol;
  const obsLabel = `Observed: ${fmt(diff)}`;
  const obsLabelW = ctx.measureText(obsLabel).width;
  let obsLabelX, obsAlign;
  if (obsX + 6 + obsLabelW > W - pad.r) {
    obsLabelX = obsX - 6; obsAlign = 'right';
  } else {
    obsLabelX = obsX + 6; obsAlign = 'left';
  }
  ctx.textAlign = obsAlign;
  ctx.fillText(obsLabel, obsLabelX, pad.t + 14);

  // X-axis tick labels — show fewer on narrow canvases
  ctx.font = '8px Inter,system-ui,sans-serif'; ctx.fillStyle = RC.MUTED; ctx.textAlign = 'center';
  const narrow = W < 280;
  const ticks = narrow ? [xMin, 0, xMax] : [xMin, critL, 0, critR, xMax];
  const tickLabels = narrow
    ? [fmt(xMin), `${fmt(0)}`, fmt(xMax)]
    : [fmt(xMin), fmt(critL), `${fmt(0)} (no diff)`, fmt(critR), fmt(xMax)];
  ticks.forEach((v, i) => {
    const tx = toX(v);
    if (tx > pad.l + 4 && tx < W - pad.r - 4)
      ctx.fillText(tickLabels[i], tx, H - 5);
  });
}

// ── Charts ──────────────────────────────────────────

function drawCharts() {
  // Theme-aware colours — read from RC at draw time
  const P    = RC.P;
  const PL   = RC.PL;
  const OR   = RC.OR;
  const ORL  = RC.ORL;
  const RED  = RC.REDL || 'rgba(220,50,50,0.25)';
  const GREY = 'rgba(120,120,140,0.2)';
  const INK   = () => RC.INK;
  const MUTED = () => RC.MUTED;
  const dpr = window.devicePixelRatio || 1;

  function initCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const wrap = canvas.parentElement;
    const W = wrap.clientWidth, H = wrap.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);
    // Modern rendering defaults: smooth joins/caps for all strokes
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    return { ctx, W, H };
  }

  // Vertical gradient from a solid colour (top) fading to transparent (bottom)
  function vGrad(ctx, hex, topY, botY, topAlpha, botAlpha) {
    const g = ctx.createLinearGradient(0, topY, 0, botY);
    const rgb = hexToRgb(hex);
    g.addColorStop(0, `rgba(${rgb},${topAlpha != null ? topAlpha : 0.32})`);
    g.addColorStop(1, `rgba(${rgb},${botAlpha != null ? botAlpha : 0.02})`);
    return g;
  }
  function hexToRgb(hex) {
    const h = hex.replace('#','');
    const n = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
    return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
  }

  function labelStyle(ctx) {
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillStyle = MUTED();
  }

  // ── Chart 1: Significance ──
  (function() {
    const c = initCanvas('chart-significance'); if (!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 20, b: 32, l: 16, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const zCrit = 1.96;
    const xMin = -4, xMax = 4;
    const yMax = normPDF(0, 0, 1) * 1.15;
    function toX(z) { return pad.l + (z - xMin) / (xMax - xMin) * cw; }
    function toY(y) { return pad.t + ch - (y / yMax) * ch; }

    // rejection fills
    [[xMin, -zCrit], [zCrit, xMax]].forEach(([from, to]) => {
      ctx.beginPath();
      ctx.moveTo(toX(from), toY(0));
      for (let z = from; z <= to; z += 0.05) ctx.lineTo(toX(z), toY(normPDF(z, 0, 1)));
      ctx.lineTo(toX(to), toY(0)); ctx.closePath();
      ctx.fillStyle = RED; ctx.fill();
    });

    // main fill
    ctx.beginPath();
    ctx.moveTo(toX(xMin), toY(0));
    for (let z = xMin; z <= xMax; z += 0.05) ctx.lineTo(toX(z), toY(normPDF(z, 0, 1)));
    ctx.lineTo(toX(xMax), toY(0)); ctx.closePath();
    ctx.fillStyle = PL; ctx.fill();

    // curve
    ctx.beginPath();
    for (let z = xMin; z <= xMax; z += 0.05)
      z === xMin ? ctx.moveTo(toX(z), toY(normPDF(z,0,1))) : ctx.lineTo(toX(z), toY(normPDF(z,0,1)));
    ctx.strokeStyle = P; ctx.lineWidth = 2; ctx.stroke();

    // critical lines
    [zCrit, -zCrit].forEach(z => {
      ctx.beginPath(); ctx.setLineDash([4, 4]);
      ctx.moveTo(toX(z), toY(0)); ctx.lineTo(toX(z), toY(normPDF(z, 0, 1)));
      ctx.strokeStyle = MUTED(); ctx.lineWidth = 1.5; ctx.stroke();
      ctx.setLineDash([]);
    });

    // baseline
    ctx.beginPath();
    ctx.moveTo(pad.l, toY(0)); ctx.lineTo(W - pad.r, toY(0));
    ctx.strokeStyle = MUTED(); ctx.lineWidth = 1; ctx.stroke();

    // labels
    labelStyle(ctx); ctx.textAlign = 'center';
    ctx.fillText('−z₀.₀₅ = −1.96', toX(-zCrit), H - 10);
    ctx.fillText('+1.96', toX(zCrit), H - 10);
    ctx.fillText('0', toX(0), H - 10);
    ctx.fillStyle = OR;
    ctx.fillText(T[currentLang].chart_reject||'reject H₀', toX(-3.2), pad.t + 14);
    ctx.fillText(T[currentLang].chart_reject||'reject H₀', toX(3.2), pad.t + 14);
    ctx.fillStyle = P;
    ctx.fillText(T[currentLang].chart_fail_reject||'fail to reject H₀', toX(0), pad.t + 14);
  })();

  // ── Chart 2: Type I & II errors ──
  (function() {
    const c = initCanvas('chart-errors'); if (!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 24, b: 32, l: 16, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const mu0 = 0, mu1 = 2.5, sig = 1;
    const zCrit = 1.645;
    const critX = mu0 + zCrit * sig;
    const xMin = -3.5, xMax = 6;
    const yMax = normPDF(0, 0, sig) * 1.2;
    function toX(x) { return pad.l + (x - xMin) / (xMax - xMin) * cw; }
    function toY(y) { return pad.t + ch - (y / yMax) * ch; }

    // β region (missed — grey)
    ctx.beginPath();
    ctx.moveTo(toX(xMin > mu1 - 3*sig ? xMin : mu1 - 3*sig), toY(0));
    for (let x = mu1 - 3*sig; x <= critX; x += 0.05)
      ctx.lineTo(toX(x), toY(normPDF(x, mu1, sig)));
    ctx.lineTo(toX(critX), toY(0)); ctx.closePath();
    ctx.fillStyle = GREY; ctx.fill();

    // α region (false positive — red)
    ctx.beginPath();
    ctx.moveTo(toX(critX), toY(0));
    for (let x = critX; x <= xMax; x += 0.05)
      ctx.lineTo(toX(x), toY(normPDF(x, mu0, sig)));
    ctx.lineTo(toX(xMax), toY(0)); ctx.closePath();
    ctx.fillStyle = RED; ctx.fill();

    // H0 fill
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += 0.05)
      x === xMin ? ctx.moveTo(toX(x), toY(normPDF(x,mu0,sig))) : ctx.lineTo(toX(x), toY(normPDF(x,mu0,sig)));
    ctx.lineTo(toX(xMax), toY(0)); ctx.lineTo(toX(xMin), toY(0)); ctx.closePath();
    ctx.fillStyle = PL; ctx.fill();

    // H1 fill
    ctx.beginPath();
    for (let x = xMin; x <= xMax; x += 0.05)
      x === xMin ? ctx.moveTo(toX(x), toY(normPDF(x,mu1,sig))) : ctx.lineTo(toX(x), toY(normPDF(x,mu1,sig)));
    ctx.lineTo(toX(xMax), toY(0)); ctx.lineTo(toX(xMin), toY(0)); ctx.closePath();
    ctx.fillStyle = ORL; ctx.fill();

    // curves
    [{ mu: mu0, col: P }, { mu: mu1, col: OR }].forEach(({ mu, col }) => {
      ctx.beginPath();
      for (let x = xMin; x <= xMax; x += 0.05)
        x === xMin ? ctx.moveTo(toX(x), toY(normPDF(x,mu,sig))) : ctx.lineTo(toX(x), toY(normPDF(x,mu,sig)));
      ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
    });

    // critical line
    ctx.beginPath(); ctx.setLineDash([4, 4]);
    ctx.moveTo(toX(critX), toY(0)); ctx.lineTo(toX(critX), toY(normPDF(critX, mu0, sig)));
    ctx.strokeStyle = MUTED(); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);

    // baseline
    ctx.beginPath();
    ctx.moveTo(pad.l, toY(0)); ctx.lineTo(W - pad.r, toY(0));
    ctx.strokeStyle = MUTED(); ctx.lineWidth = 1; ctx.stroke();

    // labels
    labelStyle(ctx); ctx.textAlign = 'center';
    ctx.fillStyle = P;    ctx.fillText(T[currentLang].chart_h0_null||'H₀ (null)',  toX(mu0), pad.t + 12);
    ctx.fillStyle = OR;   ctx.fillText(T[currentLang].chart_h1_effect||'H₁ (true effect)', toX(mu1), pad.t + 12);
    ctx.fillStyle = 'rgba(200,50,50,0.8)'; ctx.fillText('α', toX(critX + 0.55), toY(0.04));
    ctx.fillStyle = MUTED(); ctx.fillText('β', toX(critX - 0.6), toY(0.06));
  })();

  // ── Chart 3: Sample size vs MDE ──
  (function() {
    const c = initCanvas('chart-samplesize'); if (!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 16, b: 46, l: 52, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const mdes = [], ns = [];
    for (let mde = 0.01; mde <= 0.30; mde += 0.005) {
      const p = 0.05, p2 = p*(1+mde);
      const pb = (p+p2)/2;
      const z_a = 1.96, z_b = 0.842;
      const n = Math.ceil((z_a*Math.sqrt(2*pb*(1-pb)) + z_b*Math.sqrt(p*(1-p)+p2*(1-p2)))**2 / (p2-p)**2);
      mdes.push(mde*100); ns.push(Math.min(n, 200000));
    }
    const xMin = mdes[0], xMax = mdes[mdes.length-1];
    const yMin = 0, yMax = Math.max(...ns) * 1.05;
    function toX(v) { return pad.l + (v - xMin) / (xMax - xMin) * cw; }
    function toY(v) { return pad.t + ch - ((v - yMin) / (yMax - yMin)) * ch; }

    // gridlines
    [0.25, 0.5, 0.75, 1].forEach(f => {
      const y = toY(yMax * f);
      ctx.beginPath(); ctx.setLineDash([2, 4]);
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.setLineDash([]);
      labelStyle(ctx); ctx.textAlign = 'right';
      const val = yMax * f;
      ctx.fillText(val >= 1000 ? (val/1000).toFixed(0)+'k' : val.toFixed(0), pad.l - 4, y + 4);
    });

    // curve fill
    ctx.beginPath();
    mdes.forEach((x, i) => i === 0 ? ctx.moveTo(toX(x), toY(ns[i])) : ctx.lineTo(toX(x), toY(ns[i])));
    ctx.lineTo(toX(xMax), toY(0)); ctx.lineTo(toX(xMin), toY(0)); ctx.closePath();
    ctx.fillStyle = PL; ctx.fill();

    // curve line
    ctx.beginPath();
    mdes.forEach((x, i) => i === 0 ? ctx.moveTo(toX(x), toY(ns[i])) : ctx.lineTo(toX(x), toY(ns[i])));
    ctx.strokeStyle = P; ctx.lineWidth = 2; ctx.stroke();

    // x axis labels (MDE %)
    labelStyle(ctx); ctx.textAlign = 'center';
    [5, 10, 15, 20, 25, 30].forEach(v => {
      ctx.fillText(v + '%', toX(v), H - 16);
    });
    ctx.fillStyle = RC.MUTED; ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText(T[currentLang].chart_mde_axis || 'Minimum Detectable Effect (relative %)', pad.l + cw/2, H - 3);
  })();

  // ── Chart 4: Power curve ──
  (function() {
    const c = initCanvas('chart-power'); if (!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 16, b: 36, l: 44, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const p = 0.05, mde = 0.05, p2 = p*(1+mde);
    const pb = (p+p2)/2;
    const z_a = 1.96;
    const ns = [], powers = [];
    for (let n = 100; n <= 20000; n += 100) {
      const se = Math.sqrt(p*(1-p)/n + p2*(1-p2)/n);
      const z_beta = (Math.abs(p2-p)/se) - z_a;
      const power = Math.max(0, Math.min(1, 0.5 * (1 + Math.tanh(z_beta * 0.8))));
      ns.push(n); powers.push(power);
    }
    const xMin = ns[0], xMax = ns[ns.length-1];
    function toX(v) { return pad.l + (v - xMin) / (xMax - xMin) * cw; }
    function toY(v) { return pad.t + ch - v * ch; }

    // gridlines + y labels
    [0, 0.25, 0.5, 0.75, 0.8, 0.9, 1].forEach(f => {
      const y = toY(f);
      ctx.beginPath(); ctx.setLineDash([2, 4]);
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.setLineDash([]);
      labelStyle(ctx); ctx.textAlign = 'right';
      ctx.fillText((f * 100).toFixed(0) + '%', pad.l - 4, y + 4);
    });

    // threshold lines
    [0.8, 0.9].forEach(thresh => {
      ctx.beginPath(); ctx.setLineDash([6, 3]);
      ctx.moveTo(pad.l, toY(thresh)); ctx.lineTo(W - pad.r, toY(thresh));
      ctx.strokeStyle = thresh === 0.8 ? OR : P; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.setLineDash([]);
    });

    // fill
    ctx.beginPath();
    ns.forEach((x, i) => i === 0 ? ctx.moveTo(toX(x), toY(powers[i])) : ctx.lineTo(toX(x), toY(powers[i])));
    ctx.lineTo(toX(xMax), toY(0)); ctx.lineTo(toX(xMin), toY(0)); ctx.closePath();
    ctx.fillStyle = PL; ctx.fill();

    // curve
    ctx.beginPath();
    ns.forEach((x, i) => i === 0 ? ctx.moveTo(toX(x), toY(powers[i])) : ctx.lineTo(toX(x), toY(powers[i])));
    ctx.strokeStyle = P; ctx.lineWidth = 2; ctx.stroke();

    // x axis ticks
    labelStyle(ctx); ctx.textAlign = 'center';
    [2000, 5000, 10000, 15000, 20000].forEach(v => {
      ctx.fillText(v >= 1000 ? (v/1000)+'k' : v, toX(v), H - 6);
    });
  })();

  // ── Chart 5: CUPED variance reduction ──
  (function() {
    const c = initCanvas('chart-cuped'); if (!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 46, b: 38, l: 16, r: 16 };  // extra top room for callout
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const reduction = (parseFloat(document.getElementById('cuped-slider')?.value) || 30) / 100;
    const baseN = 100;
    const cupedN = baseN * (1 - reduction);
    const bars = [
      { label: T[currentLang].cuped_bar_base || 'Without CUPED', val: baseN, col: RC.MUTED, fill: 'rgba(120,120,140,0.25)' },
      { label: T[currentLang].cuped_bar_cuped || 'With CUPED', val: cupedN, col: RC.GR, fill: RC.GRL },
    ];
    const yMax = baseN * 1.18;
    const barW = Math.min(90, cw / 2 * 0.5);
    const gap = (cw - barW * 2) / 3;
    function toY(v) { return pad.t + ch - (v / yMax) * ch; }

    // savings callout — centred at the very top, its own row
    if (reduction > 0) {
      ctx.fillStyle = RC.GR; ctx.font = '700 13px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('−' + Math.round(reduction*100) + '% ' + (T[currentLang].cuped_savings || 'fewer users'), pad.l + cw/2, 18);
    }

    // baseline axis
    ctx.beginPath(); ctx.moveTo(pad.l, toY(0)); ctx.lineTo(W - pad.r, toY(0));
    ctx.strokeStyle = RC.MUTED; ctx.lineWidth = 1; ctx.stroke();

    bars.forEach((b, i) => {
      const x = pad.l + gap + i * (barW + gap);
      const y = toY(b.val);
      ctx.fillStyle = b.fill;
      ctx.strokeStyle = b.col; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, barW, toY(0) - y, 8); ctx.fill(); ctx.stroke();
      // value label sits just above each bar (never near the callout)
      ctx.textAlign = 'center';
      ctx.fillStyle = RC.INK; ctx.font = '600 14px "JetBrains Mono", monospace';
      ctx.fillText(Math.round(b.val) + '%', x + barW/2, y - 10);
      // category label below axis
      ctx.fillStyle = RC.MUTED; ctx.font = '11px Inter, sans-serif';
      ctx.fillText(b.label, x + barW/2, H - 8);
    });
  })();

  // ── Chart 6: Peeking false-positive inflation ──
  (function() {
    const c = initCanvas('chart-peeking'); if (!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 18, b: 46, l: 44, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const maxPeeks = parseInt(document.getElementById('peek-slider')?.value) || 5;
    // Approximate inflated FP rate with k independent-ish looks: 1-(1-α)^effective
    // Use a damped model (looks are correlated): effective looks ≈ sqrt-ish growth
    function fpRate(k) {
      // empirically, daily peeking ~ alpha * (1 + ln(k)) capped; use a smooth approximation
      return Math.min(0.5, 1 - Math.pow(1 - 0.05, Math.sqrt(k) * 1.6));
    }
    const yMax = 0.5;
    function toX(k) { return pad.l + (k - 1) / (30 - 1) * cw; }
    function toY(v) { return pad.t + ch - (v / yMax) * ch; }
    // gridlines
    [0.05, 0.1, 0.2, 0.3, 0.4, 0.5].forEach(f => {
      const y = toY(f);
      ctx.beginPath(); ctx.setLineDash([2,4]);
      ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y);
      ctx.strokeStyle = f === 0.05 ? RC.GR : RC.BORDER;
      ctx.lineWidth = f === 0.05 ? 1.5 : 0.8; ctx.stroke(); ctx.setLineDash([]);
      labelStyle(ctx); ctx.textAlign = 'right';
      ctx.fillStyle = f === 0.05 ? RC.GR : RC.MUTED;
      ctx.fillText((f*100).toFixed(0) + '%', pad.l - 4, y + 4);
    });
    // curve fill
    ctx.beginPath();
    for (let k = 1; k <= 30; k++) (k === 1 ? ctx.moveTo(toX(k), toY(fpRate(k))) : ctx.lineTo(toX(k), toY(fpRate(k))));
    ctx.lineTo(toX(30), toY(0)); ctx.lineTo(toX(1), toY(0)); ctx.closePath();
    ctx.fillStyle = RC.REDL || 'rgba(220,50,50,0.15)'; ctx.fill();
    // curve
    ctx.beginPath();
    for (let k = 1; k <= 30; k++) (k === 1 ? ctx.moveTo(toX(k), toY(fpRate(k))) : ctx.lineTo(toX(k), toY(fpRate(k))));
    ctx.strokeStyle = RC.RED; ctx.lineWidth = 2; ctx.stroke();
    // marker at current slider value
    const fx = toX(maxPeeks), fy = toY(fpRate(maxPeeks));
    ctx.beginPath(); ctx.moveTo(fx, toY(0)); ctx.lineTo(fx, fy);
    ctx.strokeStyle = RC.INK; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(fx, fy, 5, 0, 2*Math.PI); ctx.fillStyle = RC.RED; ctx.fill();
    ctx.fillStyle = RC.INK; ctx.font = '600 12px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText((fpRate(maxPeeks)*100).toFixed(0) + '% ' + (T[currentLang].peek_actual || 'actual FP rate'), fx, fy - 12);
    // x axis
    labelStyle(ctx); ctx.textAlign = 'center'; ctx.fillStyle = RC.MUTED;
    [1, 10, 20, 30].forEach(k => ctx.fillText(k, toX(k), H - 16));
    ctx.fillStyle = RC.MUTED; ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText(T[currentLang].peek_axis || 'Number of times you peek', pad.l + cw/2, H - 3);
  })();

  // ── Chart 7: Common distribution shapes (8 in a 4x2 grid) ──
  (function() {
    const c = initCanvas('chart-distshapes'); if (!c) return;
    const { ctx, W, H } = c;
    const cols = (W < 520) ? 2 : 4;
    const items = [
      { title: T[currentLang].dist_normal   || 'Normal',        kind:'curve', f: t => Math.exp(-Math.pow((t-0.5)/0.16,2)/2) },
      { title: T[currentLang].dist_skew     || 'Right-skewed',  kind:'curve', f: t => { const x=t*4; return (x*x*Math.exp(-x))/0.55; } },
      { title: T[currentLang].dist_leftskew || 'Left-skewed',   kind:'curve', f: t => { const x=(1-t)*4; return (x*x*Math.exp(-x))/0.55; } },
      { title: T[currentLang].dist_bimodal  || 'Bimodal',       kind:'curve', f: t => Math.exp(-Math.pow((t-0.30)/0.11,2)/2) + 0.85*Math.exp(-Math.pow((t-0.72)/0.11,2)/2) },
      { title: T[currentLang].dist_uniform  || 'Uniform',       kind:'bars',  bars:[1,1,1,1,1,1] },
      { title: T[currentLang].dist_triangular || 'Triangular (2 dice)', kind:'bars', bars:[1,2,3,4,5,6,5,4,3,2,1] },
      { title: T[currentLang].dist_exponential || 'Exponential',kind:'curve', f: t => Math.exp(-t*3.2) },
      { title: T[currentLang].dist_poisson  || 'Poisson (counts)', kind:'bars', bars:[2.2,4.2,5,3.8,2.2,1.0,0.4,0.15] },
    ];
    const rows = Math.ceil(items.length / cols);
    const cellW = W / cols, cellH = H / rows;
    items.forEach((item, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const ox = col * cellW, oy = row * cellH;
      const pad = { t: 24, b: 14, l: 12, r: 12 };
      const pw = cellW - pad.l - pad.r, ph = cellH - pad.t - pad.b;
      const bx = ox + pad.l, by = oy + pad.t;
      // baseline
      const drawBaseline = () => { ctx.beginPath(); ctx.moveTo(bx, by+ph); ctx.lineTo(bx+pw, by+ph); ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 1; ctx.stroke(); };
      if (item.kind === 'curve') {
        const N = 80; const ys = []; let maxY = 0;
        for (let j=0; j<=N; j++){ const y = Math.max(0, item.f(j/N)); ys.push(y); if (y>maxY) maxY=y; }
        const toX = j => bx + (j/N)*pw;
        const toY = y => by + ph - (y/maxY)*ph*0.90;
        // gradient fill under the curve
        ctx.beginPath(); ctx.moveTo(toX(0), by+ph);
        ys.forEach((y,j) => ctx.lineTo(toX(j), toY(y)));
        ctx.lineTo(toX(N), by+ph); ctx.closePath();
        ctx.fillStyle = vGrad(ctx, RC.P, by, by+ph, 0.34, 0.03); ctx.fill();
        // smooth curve line
        ctx.beginPath();
        ys.forEach((y,j) => j===0 ? ctx.moveTo(toX(j), toY(y)) : ctx.lineTo(toX(j), toY(y)));
        ctx.strokeStyle = RC.P; ctx.lineWidth = 2.5; ctx.stroke();
        drawBaseline();
      } else {
        const bars = item.bars; const m = bars.length; const maxY = Math.max(...bars);
        const gap = pw / m * 0.16;
        const bw = (pw - gap*(m+1)) / m;
        const grad = vGrad(ctx, RC.P, by, by+ph, 0.55, 0.12);
        bars.forEach((v,j) => {
          const x = bx + gap + j*(bw+gap);
          const h = (v/maxY)*ph*0.90;
          const y = by + ph - h;
          ctx.fillStyle = grad; ctx.strokeStyle = RC.P; ctx.lineWidth = 1.4;
          const r = Math.min(3, bw/2);
          ctx.beginPath(); ctx.roundRect(x, y, bw, h, r); ctx.fill(); ctx.stroke();
        });
        drawBaseline();
      }
      // title
      ctx.fillStyle = RC.INK; ctx.font = '700 10.5px Inter, sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(item.title, ox + cellW/2, oy + 15);
    });
  })();

  // ── Chart 8: Central Limit Theorem demo (interactive) ──
  (function() {
    const c = initCanvas('chart-clt'); if (!c) return;
    const { ctx, W, H } = c;
    const n = parseInt(document.getElementById('clt-slider')?.value) || 1;
    const pad = { t: 30, b: 40, l: 16, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    // Population is strongly right-skewed (exponential-like).
    // We show the distribution of the SAMPLE MEAN for sample size n.
    // Mean of exp(1) = 1; sampling dist of mean has mean 1, sd = 1/sqrt(n).
    // As n grows it becomes tight + normal-shaped (CLT).
    const popMean = 1;
    const binN = 70;
    const sd = 1 / Math.sqrt(n);
    // For n=1 show the skewed population itself; for n>1 show normal approx of the mean
    const vals = [];
    let maxY = 0;
    const xLo = 0, xHi = 2.6;
    for (let j = 0; j <= binN; j++) {
      const x = xLo + (j/binN)*(xHi-xLo);
      let y;
      if (n === 1) {
        y = x >= 0 ? Math.exp(-x) : 0;           // exponential population
      } else {
        y = Math.exp(-Math.pow((x-popMean)/sd, 2) / 2); // normal sampling dist of the mean
      }
      vals.push({x, y}); if (y>maxY) maxY=y;
    }
    const toX = x => pad.l + ((x-xLo)/(xHi-xLo))*cw;
    const toY = y => pad.t + ch - (y/maxY)*ch;
    // true-mean reference line
    ctx.beginPath(); ctx.moveTo(toX(popMean), pad.t); ctx.lineTo(toX(popMean), pad.t+ch);
    ctx.strokeStyle = RC.GR; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = RC.GR; ctx.font = '600 10px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(T[currentLang].clt_truemean || 'true mean', toX(popMean), pad.t - 6);
    // fill (gradient)
    const fillHex = (n===1) ? RC.OR : RC.GR;
    ctx.beginPath(); ctx.moveTo(toX(xLo), pad.t+ch);
    vals.forEach(p => ctx.lineTo(toX(p.x), toY(p.y)));
    ctx.lineTo(toX(xHi), pad.t+ch); ctx.closePath();
    ctx.fillStyle = vGrad(ctx, fillHex, pad.t, pad.t+ch, 0.30, 0.03); ctx.fill();
    // line
    ctx.beginPath();
    vals.forEach((p,i) => i===0 ? ctx.moveTo(toX(p.x), toY(p.y)) : ctx.lineTo(toX(p.x), toY(p.y)));
    ctx.strokeStyle = fillHex; ctx.lineWidth = 2.5; ctx.stroke();
    // baseline
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t+ch); ctx.lineTo(pad.l+cw, pad.t+ch);
    ctx.strokeStyle = RC.MUTED; ctx.lineWidth = 1; ctx.stroke();
    // caption
    ctx.fillStyle = RC.INK; ctx.font = '600 11px Inter, sans-serif'; ctx.textAlign = 'center';
    const cap = (n===1)
      ? (T[currentLang].clt_cap_pop || 'n = 1: the raw population (very skewed)')
      : (T[currentLang].clt_cap_mean || 'distribution of the sample mean').replace('{n}', n);
    ctx.fillText(cap, pad.l + cw/2, H - 8);
  })();

  // ── Confidence interval narrows as n grows ──
  (function(){
    const c = initCanvas('chart-ci-n'); if(!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 18, b: 42, l: 44, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const p = 0.30;                          // illustrative conversion rate
    const nSel = parseInt(document.getElementById('ci-n-slider')?.value) || 1000;
    // x axis: n on a log scale from 100 to 20000; y axis: conversion rate 0..60%
    const nMin = 100, nMax = 20000;
    const logMin = Math.log(nMin), logMax = Math.log(nMax);
    const toX = n => pad.l + (Math.log(n)-logMin)/(logMax-logMin)*cw;
    const yMax = 0.6;
    const toY = v => pad.t + ch - (v/yMax)*ch;
    const hw = n => 1.96*Math.sqrt(p*(1-p)/n);
    // y gridlines
    ctx.textAlign='right'; ctx.font='600 9.5px Inter, sans-serif';
    [0,0.15,0.30,0.45,0.60].forEach(g=>{
      const y=toY(g);
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle=RC.BORDER; ctx.lineWidth=0.8; ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle=RC.MUTED; ctx.fillText((g*100).toFixed(0)+'%', pad.l-8, y+3);
    });
    // true-rate reference line at 30%
    ctx.beginPath(); ctx.moveTo(pad.l,toY(p)); ctx.lineTo(pad.l+cw,toY(p));
    ctx.strokeStyle=RC.GR; ctx.lineWidth=1.5; ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=RC.GR; ctx.font='700 9px Inter, sans-serif'; ctx.textAlign='left';
    ctx.fillText('p = 30%', pad.l+4, toY(p)-5);
    // CI band (upper and lower envelopes) with gradient fill
    const upper=[], lower=[];
    for (let i=0;i<=100;i++){ const n=Math.exp(logMin+(logMax-logMin)*i/100); upper.push({x:toX(n),y:toY(p+hw(n))}); lower.push({x:toX(n),y:toY(p-hw(n))}); }
    ctx.beginPath(); ctx.moveTo(upper[0].x,upper[0].y);
    upper.forEach(pt=>ctx.lineTo(pt.x,pt.y));
    for (let i=lower.length-1;i>=0;i--) ctx.lineTo(lower[i].x,lower[i].y);
    ctx.closePath();
    const hxc=RC.P.replace('#',''); const rn=parseInt(hxc,16);
    ctx.fillStyle=`rgba(${(rn>>16)&255},${(rn>>8)&255},${rn&255},0.16)`; ctx.fill();
    // envelope lines
    [upper,lower].forEach(arr=>{ ctx.beginPath(); arr.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y)); ctx.strokeStyle=RC.P; ctx.lineWidth=1.8; ctx.stroke(); });
    // highlight selected n: vertical line + error bar + label
    const xs=toX(nSel), h=hw(nSel);
    ctx.beginPath(); ctx.moveTo(xs,pad.t); ctx.lineTo(xs,pad.t+ch);
    ctx.strokeStyle=RC.OR; ctx.lineWidth=1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    // error bar at selected n
    ctx.strokeStyle=RC.OR; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(xs,toY(p+h)); ctx.lineTo(xs,toY(p-h)); ctx.stroke();
    [p+h,p-h].forEach(v=>{ ctx.beginPath(); ctx.moveTo(xs-5,toY(v)); ctx.lineTo(xs+5,toY(v)); ctx.stroke(); });
    ctx.beginPath(); ctx.arc(xs,toY(p),4,0,2*Math.PI); ctx.fillStyle=RC.OR; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke();
    // bubble
    const lab=`±${(h*100).toFixed(2)} pp`;
    ctx.font='700 10px Inter, sans-serif'; const tw=ctx.measureText(lab).width;
    let bx=xs+8; if (bx+tw+12>pad.l+cw) bx=xs-tw-20;
    ctx.fillStyle=RC.OR;
    if (ctx.roundRect){ctx.beginPath();ctx.roundRect(bx,toY(p+h)-22,tw+12,18,5);ctx.fill();} else ctx.fillRect(bx,toY(p+h)-22,tw+12,18);
    ctx.fillStyle='#fff'; ctx.textAlign='left'; ctx.fillText(lab,bx+6,toY(p+h)-9);
    // x ticks
    ctx.fillStyle=RC.MUTED; ctx.font='600 9px Inter, sans-serif'; ctx.textAlign='center';
    [100,500,2000,8000,20000].forEach(n=>ctx.fillText(n>=1000?(n/1000)+'k':n, toX(n), H-24));
    ctx.fillText(T[currentLang].cifac_axis || 'users per group (n) — log scale', pad.l+cw/2, H-8);
  })();

  // ── Total users vs treatment share (unequal split) ──
  (function(){
    const c = initCanvas('chart-split'); if(!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 18, b: 42, l: 52, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const p1 = 0.05, p2 = p1*1.10, delta = p2-p1;
    const zA = normInvCDF(0.975), zB = normInvCDF(0.80);
    // total users needed as a function of treatment fraction f (control = 1-f)
    function totalUsers(f){
      const r = (1-f)/f;                       // control / treatment ratio
      const pbar = (p1 + r*p2)/(1+r);
      const n_t = Math.pow(zA*Math.sqrt((1+1/r)*pbar*(1-pbar)) + zB*Math.sqrt(p1*(1-p1)/r + p2*(1-p2)), 2) / (delta*delta);
      const n_c = n_t * r;
      return Math.ceil(n_t) + Math.ceil(n_c);
    }
    const fMin = 0.05, fMax = 0.50;
    const fSel = (parseInt(document.getElementById('split-slider')?.value)||10)/100;
    // y range
    const totals = [];
    for (let f=fMin; f<=fMax+1e-9; f+=0.01) totals.push(totalUsers(f));
    const yMax = Math.max(...totals)*1.05;
    const toX = f => pad.l + (f-fMin)/(fMax-fMin)*cw;
    const toY = v => pad.t + ch - (v/yMax)*ch;
    // y gridlines
    ctx.textAlign='right'; ctx.font='600 9px Inter, sans-serif';
    for (let g=0; g<=4; g++){
      const val = yMax*g/4, y = toY(val);
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(pad.l+cw,y);
      ctx.strokeStyle=RC.BORDER; ctx.lineWidth=0.8; ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle=RC.MUTED; ctx.fillText(Math.round(val/1000)+'k', pad.l-8, y+3);
    }
    // curve + fill
    const pts=[];
    for (let f=fMin; f<=fMax+1e-9; f+=0.005) pts.push({x:toX(f),y:toY(totalUsers(f))});
    ctx.beginPath(); ctx.moveTo(pts[0].x,toY(0));
    pts.forEach(pt=>ctx.lineTo(pt.x,pt.y));
    ctx.lineTo(pts[pts.length-1].x,toY(0)); ctx.closePath();
    ctx.fillStyle=vGrad(ctx,RC.P,pad.t,pad.t+ch,0.20,0.02); ctx.fill();
    ctx.beginPath(); pts.forEach((pt,i)=>i===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));
    ctx.strokeStyle=RC.P; ctx.lineWidth=2.5; ctx.stroke();
    // mark 50/50 (most efficient) at right edge
    ctx.fillStyle=RC.GR; ctx.font='700 9px Inter, sans-serif'; ctx.textAlign='center';
    ctx.fillText('50/50 ' + (T[currentLang].split_best||'(most efficient)'), toX(0.46), toY(totalUsers(0.5))-8);
    // highlight selected fraction
    const xs=toX(fSel), ys=toY(totalUsers(fSel));
    ctx.beginPath(); ctx.moveTo(xs,toY(0)); ctx.lineTo(xs,ys);
    ctx.strokeStyle=RC.OR; ctx.lineWidth=1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(xs,ys,5,0,2*Math.PI); ctx.fillStyle=RC.OR; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
    const lab=Math.round(totalUsers(fSel)/1000)+'k';
    ctx.font='700 10px Inter, sans-serif'; const tw=ctx.measureText(lab).width;
    let bx=xs+8; if (bx+tw+12>pad.l+cw) bx=xs-tw-20;
    ctx.fillStyle=RC.OR; if(ctx.roundRect){ctx.beginPath();ctx.roundRect(bx,ys-22,tw+12,18,5);ctx.fill();}else ctx.fillRect(bx,ys-22,tw+12,18);
    ctx.fillStyle='#fff'; ctx.textAlign='left'; ctx.fillText(lab,bx+6,ys-9);
    // x ticks (share to variant)
    ctx.fillStyle=RC.MUTED; ctx.font='600 9px Inter, sans-serif'; ctx.textAlign='center';
    [0.05,0.1,0.2,0.3,0.4,0.5].forEach(f=>ctx.fillText(Math.round(f*100)+'%', toX(f), H-24));
    ctx.fillText(T[currentLang].split_axis || 'share of traffic sent to the variant', pad.l+cw/2, H-8);
  })();

  // ── FWER vs number of comparisons (multiple testing) ──
  (function(){
    const c = initCanvas('chart-fwer'); if(!c) return;
    const { ctx, W, H } = c;
    const pad = { t: 18, b: 42, l: 44, r: 16 };
    const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
    const mMax = 20, a = 0.05;
    const mSel = parseInt(document.getElementById('fwer-slider')?.value) || 3;
    const toX = m => pad.l + ((m-1)/(mMax-1))*cw;
    const toY = y => pad.t + ch - y*ch;          // y in [0,1]
    // horizontal gridlines + y labels (0,25,50,75,100%)
    ctx.textAlign = 'right'; ctx.font = '600 9.5px Inter, sans-serif';
    [0,0.25,0.5,0.75,1].forEach(g => {
      const y = toY(g);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l+cw, y);
      ctx.strokeStyle = RC.BORDER; ctx.lineWidth = 0.8; ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = RC.MUTED; ctx.fillText((g*100)+'%', pad.l-8, y+3);
    });
    // Bonferroni flat line at 5%
    const yB = toY(a);
    ctx.beginPath(); ctx.moveTo(pad.l, yB); ctx.lineTo(pad.l+cw, yB);
    ctx.strokeStyle = RC.GR; ctx.lineWidth = 2; ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = RC.GR; ctx.font = '700 9.5px Inter, sans-serif'; ctx.textAlign='left';
    ctx.fillText(T[currentLang].mt_lbl_bonf || 'with Bonferroni (5%)', pad.l+6, yB-5);
    // FWER curve 1-(1-a)^m with gradient fill
    const pts = [];
    for (let m=1;m<=mMax;m++){ pts.push({ m, y: 1-Math.pow(1-a, m) }); }
    ctx.beginPath(); ctx.moveTo(toX(1), toY(0));
    pts.forEach(p=>ctx.lineTo(toX(p.m), toY(p.y)));
    ctx.lineTo(toX(mMax), toY(0)); ctx.closePath();
    ctx.fillStyle = vGrad(ctx, RC.OR, pad.t, pad.t+ch, 0.26, 0.02); ctx.fill();
    ctx.beginPath();
    pts.forEach((p,i)=> i===0?ctx.moveTo(toX(p.m),toY(p.y)):ctx.lineTo(toX(p.m),toY(p.y)));
    ctx.strokeStyle = RC.OR; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = RC.OR; ctx.font = '700 9.5px Inter, sans-serif'; ctx.textAlign='left';
    ctx.fillText(T[currentLang].mt_lbl_fwer || 'uncorrected FWER', toX(8), toY(pts[7].y)-8);
    // highlight the selected m: vertical guide + dot + value bubble
    const ySel = 1-Math.pow(1-a, mSel);
    const xSel = toX(mSel);
    ctx.beginPath(); ctx.moveTo(xSel, toY(0)); ctx.lineTo(xSel, toY(ySel));
    ctx.strokeStyle = RC.P; ctx.lineWidth = 1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(xSel, toY(ySel), 5, 0, 2*Math.PI);
    ctx.fillStyle = RC.P; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    // value bubble
    const label = `m=${mSel}: ${(ySel*100).toFixed(1)}%`;
    ctx.font = '700 10px Inter, sans-serif';
    const tw = ctx.measureText(label).width;
    let bx = xSel + 8; if (bx + tw + 12 > pad.l+cw) bx = xSel - tw - 20;
    const by = toY(ySel) - 22;
    ctx.fillStyle = RC.P;
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(bx, by, tw+12, 18, 5); ctx.fill(); }
    else ctx.fillRect(bx, by, tw+12, 18);
    ctx.fillStyle = '#fff'; ctx.textAlign='left'; ctx.fillText(label, bx+6, by+13);
    // x axis ticks + label
    ctx.fillStyle = RC.MUTED; ctx.font = '600 9.5px Inter, sans-serif'; ctx.textAlign='center';
    [1,5,10,15,20].forEach(m => ctx.fillText(m, toX(m), H-24));
    ctx.fillText(T[currentLang].mt_axis || 'number of simultaneous comparisons (m)', pad.l+cw/2, H-8);
  })();

  // Case-study mini charts live in the same Reference tab
  if (typeof drawCaseStudyCharts === 'function') drawCaseStudyCharts();
  if (typeof drawAnatomyCharts === 'function') drawAnatomyCharts();
}

// Draw reference charts on resize
window.addEventListener('resize', () => {
  if (document.getElementById('tab-reference').classList.contains('active')) drawCharts();
});

// Interactive slider handlers for the CUPED and peeking charts
document.addEventListener('DOMContentLoaded', () => {
  const cupedSlider = document.getElementById('cuped-slider');
  const cupedVal = document.getElementById('cuped-slider-val');
  if (cupedSlider) {
    cupedSlider.addEventListener('input', () => {
      if (cupedVal) cupedVal.textContent = cupedSlider.value + '%';
      if (document.getElementById('tab-reference')?.classList.contains('active')) drawCharts();
    });
  }
  const peekSlider = document.getElementById('peek-slider');
  const peekVal = document.getElementById('peek-slider-val');
  if (peekSlider) {
    peekSlider.addEventListener('input', () => {
      if (peekVal) peekVal.textContent = peekSlider.value;
      if (document.getElementById('tab-reference')?.classList.contains('active')) drawCharts();
    });
  }
  const cltSlider = document.getElementById('clt-slider');
  const cltVal = document.getElementById('clt-slider-val');
  if (cltSlider) {
    cltSlider.addEventListener('input', () => {
      if (cltVal) cltVal.textContent = cltSlider.value;
      if (document.getElementById('tab-reference')?.classList.contains('active')) drawCharts();
    });
  }

  // FWER (multiple-testing) interactive slider + live formula
  const fwerSlider = document.getElementById('fwer-slider');
  function updateFwerFormula() {
    if (!fwerSlider) return;
    const m = parseInt(fwerSlider.value) || 1;
    const fwer = 1 - Math.pow(1 - 0.05, m);
    const valEl = document.getElementById('fwer-slider-val');
    const mEl = document.getElementById('fwer-m');
    const resEl = document.getElementById('fwer-val');
    if (valEl) valEl.textContent = m;
    if (mEl) mEl.textContent = m;
    if (resEl) resEl.textContent = (fwer*100).toFixed(1) + '%';
    if (document.getElementById('tab-reference')?.classList.contains('active')) drawCharts();
  }
  if (fwerSlider) {
    fwerSlider.addEventListener('input', updateFwerFormula);
    updateFwerFormula();
  }

  // CI-vs-n interactive slider + live formula
  const ciSlider = document.getElementById('ci-n-slider');
  function updateCiFormula() {
    if (!ciSlider) return;
    const n = parseInt(ciSlider.value) || 1000;
    const hw = 1.96 * Math.sqrt(0.3*0.7/n);
    const valEl = document.getElementById('ci-n-slider-val');
    const nDisp = document.getElementById('ci-n-disp');
    const resEl = document.getElementById('ci-val');
    if (valEl) valEl.textContent = n.toLocaleString();
    if (nDisp) nDisp.textContent = n.toLocaleString();
    if (resEl) resEl.textContent = '±' + (hw*100).toFixed(2) + ' pp';
    if (document.getElementById('tab-reference')?.classList.contains('active')) drawCharts();
  }
  if (ciSlider) {
    ciSlider.addEventListener('input', updateCiFormula);
    updateCiFormula();
  }

  // Unequal-split interactive slider + live formula
  const splitSlider = document.getElementById('split-slider');
  function splitTotal(f){
    const p1=0.05, p2=p1*1.10, delta=p2-p1;
    const zA=normInvCDF(0.975), zB=normInvCDF(0.80);
    const r=(1-f)/f;
    const pbar=(p1+r*p2)/(1+r);
    const n_t=Math.pow(zA*Math.sqrt((1+1/r)*pbar*(1-pbar))+zB*Math.sqrt(p1*(1-p1)/r+p2*(1-p2)),2)/(delta*delta);
    return Math.ceil(n_t)+Math.ceil(n_t*r);
  }
  function updateSplitFormula(){
    if (!splitSlider) return;
    const f = (parseInt(splitSlider.value)||10)/100;
    const total = splitTotal(f);
    const mult = total / splitTotal(0.5);
    const valEl=document.getElementById('split-slider-val');
    const treatEl=document.getElementById('split-treat');
    const totalEl=document.getElementById('split-total');
    const multEl=document.getElementById('split-mult');
    if (valEl) valEl.textContent = Math.round(f*100)+'%';
    if (treatEl) treatEl.textContent = Math.round(f*100)+'%';
    if (totalEl) totalEl.textContent = total.toLocaleString();
    if (multEl) multEl.textContent = mult.toFixed(1)+'×';
    if (document.getElementById('tab-reference')?.classList.contains('active')) drawCharts();
  }
  if (splitSlider) {
    splitSlider.addEventListener('input', updateSplitFormula);
    updateSplitFormula();
  }
});

// ── Table-of-contents: scroll-spy highlighting + mobile toggle ──
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('toc-sidebar');
  const toggle  = document.getElementById('toc-mobile-toggle');
  const links   = Array.from(document.querySelectorAll('.toc-nav .toc-link'));
  if (!links.length) return;

  // Map each section id -> its TOC link
  const linkFor = {};
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    linkFor[id] = a;
  });
  const sections = Object.keys(linkFor)
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    links.forEach(a => a.classList.remove('active'));
    const a = linkFor[id];
    if (a) {
      a.classList.add('active');
      // keep the active item visible inside a scrollable desktop sidebar
      if (window.innerWidth >= 1024) {
        const nav = document.getElementById('toc-nav');
        if (nav && nav.scrollHeight > nav.clientHeight) {
          const top = a.offsetTop - nav.clientHeight / 2;
          nav.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }
  }

  // IntersectionObserver highlights whichever section is nearest the top
  let visible = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
      else visible.delete(e.target.id);
    });
    if (visible.size) {
      // pick the section closest to the top of the viewport
      let best = null, bestTop = Infinity;
      visible.forEach((ratio, id) => {
        const rect = document.getElementById(id).getBoundingClientRect();
        const dist = Math.abs(rect.top - 90);
        if (dist < bestTop) { bestTop = dist; best = id; }
      });
      if (best) setActive(best);
    }
  }, { rootMargin: '-80px 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] });

  sections.forEach(s => observer.observe(s));

  // Mobile collapsible toggle
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // tapping a link closes the drawer on mobile
    links.forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        sidebar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  // Highlight the first section initially
  setActive(sections[0]?.id);
});

// ── Interactive A/B process walkthrough ──
const PROCESS_STEPS = [
  { emoji: '💡', key: 'hypo' },
  { emoji: '📐', key: 'metric' },
  { emoji: '🔢', key: 'size' },
  { emoji: '🅰️', key: 'aacheck' },
  { emoji: '🚀', key: 'run' },
  { emoji: '📊', key: 'analyse' },
  { emoji: '🧭', key: 'decide' },
];
let processCurrent = 0;

function renderProcess() {
  const track = document.getElementById('process-track');
  const panel = document.getElementById('process-panel');
  const bar = document.getElementById('process-progress-bar');
  if (!track || !panel) return;
  const L = T[currentLang];

  // build step chips
  track.innerHTML = PROCESS_STEPS.map((s, i) => `
    <div class="process-step ${i===processCurrent?'active':''}" data-step="${i}">
      <span class="process-step-emoji">${s.emoji}</span>
      <span class="process-step-num">${(L.proc_step || 'Step')} ${i+1}</span>
      <span class="process-step-label">${L['proc_'+s.key+'_t'] || s.key}</span>
    </div>`).join('');

  // progress bar
  if (bar) bar.style.width = ((processCurrent+1) / PROCESS_STEPS.length * 100) + '%';

  // panel
  const s = PROCESS_STEPS[processCurrent];
  panel.innerHTML = `
    <div class="process-panel-title">${s.emoji} ${L['proc_'+s.key+'_t'] || ''}</div>
    <div class="process-panel-goal">${(L.proc_goal || 'Goal')}: ${L['proc_'+s.key+'_g'] || ''}</div>
    <div class="process-panel-body">${L['proc_'+s.key+'_b'] || ''}</div>
    <div class="process-example"><strong>${L.proc_example || 'Example'}:</strong> ${L['proc_'+s.key+'_e'] || ''}</div>
    <div class="process-nav">
      <button id="proc-prev" ${processCurrent===0?'disabled':''}>← ${L.proc_prev || 'Back'}</button>
      <button id="proc-next" class="primary" ${processCurrent===PROCESS_STEPS.length-1?'disabled':''}>${L.proc_next || 'Next'} →</button>
    </div>`;

  // wire chips + nav
  track.querySelectorAll('.process-step').forEach(el => {
    el.addEventListener('click', () => { processCurrent = parseInt(el.dataset.step); renderProcess(); });
  });
  const prev = document.getElementById('proc-prev');
  const next = document.getElementById('proc-next');
  if (prev) prev.addEventListener('click', () => { if (processCurrent>0){ processCurrent--; renderProcess(); } });
  if (next) next.addEventListener('click', () => { if (processCurrent<PROCESS_STEPS.length-1){ processCurrent++; renderProcess(); } });
}

document.addEventListener('DOMContentLoaded', renderProcess);

