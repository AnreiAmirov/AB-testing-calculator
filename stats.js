/**
 * stats.js
 * Pure statistical functions — no DOM, no side effects.
 * Shared between index.html (browser) and stats.test.js (Node.js).
 *
 * Functions:
 *   normInvCDF(p)                   — inverse normal CDF
 *   normCDF(z)                      — normal CDF
 *   normPDF(x, mu, sigma)           — normal PDF
 *   mean(arr)                       — sample mean
 *   variance(arr)                   — sample variance (n-1)
 */

function normInvCDF(p) {
  const a = [0,-3.969683028665376e+01,2.209460984245205e+02,-2.759285104469687e+02,1.383577518672690e+02,-3.066479806614716e+01,2.506628277459239e+00];
  const b = [0,-5.447609879822406e+01,1.615858368580409e+02,-1.556989798598866e+02,6.680131188771972e+01,-1.328068155288572e+01];
  const c = [0,-7.784894002430293e-03,-3.223964580411365e-01,-2.400758277161838e+00,-2.549732539343734e+00,4.374664141464968e+00,2.938163982698783e+00];
  const d = [0,7.784695709041462e-03,3.224671290700398e-01,2.445134137142996e+00,3.754408661907416e+00];
  const pLow=0.02425, pHigh=1-pLow; let q,r;
  if(p<pLow){q=Math.sqrt(-2*Math.log(p));return(((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6])/((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);}
  else if(p<=pHigh){q=p-0.5;r=q*q;return(((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q/(((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1);}
  else{q=Math.sqrt(-2*Math.log(1-p));return-(((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6])/((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);}
}
function normCDF(z){const t=1/(1+0.2316419*Math.abs(z));const p=1-(1/Math.sqrt(2*Math.PI))*Math.exp(-0.5*z*z)*(0.319381530*t-0.356563782*t**2+1.781477937*t**3-1.821255978*t**4+1.330274429*t**5);return z>=0?p:1-p;}
function mean(arr){return arr.reduce((s,v)=>s+v,0)/arr.length;}
function variance(arr){const m=mean(arr);return arr.reduce((s,v)=>s+(v-m)**2,0)/(arr.length-1);}

function normPDF(x, mu, sigma) {
  return Math.exp(-0.5*((x-mu)/sigma)**2) / (sigma * Math.sqrt(2*Math.PI));
}

// Export for Node.js test runner (no effect in browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { normInvCDF, normCDF, normPDF, mean, variance };
}
