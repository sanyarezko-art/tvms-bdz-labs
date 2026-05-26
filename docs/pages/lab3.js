import { sectionBlock, figure, statsGrid } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab3;
const verdict = (ok) => ok
  ? `<span class="verdict accept">✓ принимаем $H_0$</span>`
  : `<span class="verdict reject">✗ отвергаем $H_0$</span>`;

export function renderLab3(container) {
  container.innerHTML = `
  ${sectionBlock({
    title: "1. Исходная выборка из ЛР-1",
    subtitle: `$n=50$, выборочное среднее и СКО`,
    body: `
      ${statsGrid([
        {label:"n", value:d.n},
        {label:"среднее $\\bar{x}$", value:d.mean.toFixed(4)},
        {label:"СКО $s$", value:d.s.toFixed(4)},
        {label:"$\\alpha$", value:d.alpha},
        {label:"$\\gamma=1-\\alpha$", value:(1-d.alpha).toFixed(2)},
      ])}
      <p class="solution-text mt-3">
        Предполагаем, что выборка из нормальной генеральной совокупности с неизвестными $m$ и $\\sigma^2$.
      </p>
    `,
  })}

  ${sectionBlock({
    title: "2. Доверительный интервал для математического ожидания",
    subtitle: "$t$-распределение Стьюдента с $k=n-1=49$ степенями свободы",
    body: `
      <p class="solution-text">$t_{1-\\alpha/2}(n-1) = ${d.t_q.toFixed(4)}$.</p>
      <p class="solution-text">
        $\\bar{x}\\pm t_{1-\\alpha/2}(n-1)\\cdot \\dfrac{s}{\\sqrt{n}} = ${d.mean.toFixed(3)} \\pm ${d.t_q.toFixed(3)}\\cdot\\dfrac{${d.s.toFixed(3)}}{\\sqrt{50}}$
      </p>
      <div class="answer-box">
        $m\\in(${d.m_low.toFixed(4)};\\ ${d.m_high.toFixed(4)})$ с доверительной вероятностью $0{,}95$.
      </div>
    `,
    code:
`import numpy as np
from scipy import stats
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
n = len(X); xb = X.mean(); s = X.std(ddof=1); a = 0.05
tq = stats.t.ppf(1-a/2, n-1)
m_lo = xb - tq*s/np.sqrt(n); m_hi = xb + tq*s/np.sqrt(n)
print(f"t = {tq:.4f}")
print(f"m в ({m_lo:.4f}; {m_hi:.4f})")`
  })}

  ${sectionBlock({
    title: "3. Доверительный интервал для дисперсии",
    subtitle: "Распределение $\\chi^2$ с $k=n-1=49$ степенями свободы",
    body: `
      <p class="solution-text">$\\chi^2_{\\alpha/2}=${d.chi2_lo.toFixed(4)}$, $\\chi^2_{1-\\alpha/2}=${d.chi2_hi.toFixed(4)}$.</p>
      <p class="solution-text">
        $\\dfrac{(n-1)s^2}{\\chi^2_{1-\\alpha/2}} \\le D \\le \\dfrac{(n-1)s^2}{\\chi^2_{\\alpha/2}}$
      </p>
      <div class="answer-box">
        $D \\in (${d.D_low.toFixed(4)};\\ ${d.D_high.toFixed(4)})$ с доверительной вероятностью $0{,}95$.
      </div>
    `,
    code:
`import numpy as np
from scipy import stats
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
n = len(X); s = X.std(ddof=1); a = 0.05
chi_lo = stats.chi2.ppf(a/2, n-1); chi_hi = stats.chi2.ppf(1-a/2, n-1)
D_lo = (n-1)*s**2/chi_hi; D_hi = (n-1)*s**2/chi_lo
print(f"D в ({D_lo:.4f}; {D_hi:.4f})")`
  })}

  ${sectionBlock({
    title: "4. Проверка гипотез по доверительным интервалам",
    body: `
      <p class="solution-text"><b>$H_0^{(1)}$: $m_X = M_0$</b>, где $M_0 = \\bar{x}+0{,}5s = ${d.M0.toFixed(4)}$.</p>
      <p class="solution-text">
        $M_0 = ${d.M0.toFixed(4)}$, доверительный интервал $(${d.m_low.toFixed(4)};\\ ${d.m_high.toFixed(4)})$. ${verdict(d.H1)}
      </p>
      <p class="solution-text mt-4"><b>$H_0^{(2)}$: $D_X = A_0$</b>, где $A_0 = 2s^2 = ${d.A0.toFixed(4)}$.</p>
      <p class="solution-text">
        $A_0 = ${d.A0.toFixed(4)}$, доверительный интервал $(${d.D_low.toFixed(4)};\\ ${d.D_high.toFixed(4)})$. ${verdict(d.H2)}
      </p>
    `,
  })}

  ${sectionBlock({
    title: "5. Критерий χ² на нормальность",
    subtitle: "$k=7$ интервалов, $\\alpha=0{,}05$, число степеней свободы $df = k-1-2 = 4$",
    body: `
      <p class="solution-text">
        Под нулевой гипотезой $H_0$: выборка из $N(m,\\sigma^2)$ с $m=\\bar{x},\\ \\sigma=s$. Теоретические вероятности интервалов: $p_i = F_{N(m,\\sigma)}(b_i) - F_{N(m,\\sigma)}(a_i)$.
        Статистика
        $$\\chi^2_{набл} = \\sum_{i=1}^{k}\\frac{(n_i - n p_i)^2}{n p_i}.$$
      </p>
      ${statsGrid([
        {label:"$\\chi^2_{набл}$", value:d.chi2_obs.toFixed(4)},
        {label:"$\\chi^2_{крит}$", value:d.chi2_crit.toFixed(4)},
        {label:"df", value:d.df},
      ])}
      <div class="answer-box">
        $\\chi^2_{набл} = ${d.chi2_obs.toFixed(4)} ${d.chi2_accept ? "<" : ">"} \\chi^2_{крит} = ${d.chi2_crit.toFixed(4)}$ → ${verdict(d.chi2_accept)} о нормальности.
      </div>
    `,
    code:
`import numpy as np
from scipy import stats
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
n = len(X); xb = X.mean(); s = X.std(ddof=1)
edges = np.linspace(X.min(), X.max(), 8)
counts, _ = np.histogram(X, bins=edges)
edges[0] = -np.inf; edges[-1] = np.inf
p_i = np.diff(stats.norm.cdf(edges, loc=xb, scale=s))
np_i = n * p_i
chi2 = np.sum((counts - np_i)**2 / np_i)
df = 7 - 1 - 2
chi_cr = stats.chi2.ppf(0.95, df)
print(f"χ² набл = {chi2:.4f}")
print(f"χ² крит = {chi_cr:.4f}, df = {df}")
print("принимаем нормальность" if chi2 < chi_cr else "отвергаем")`
  })}

  ${sectionBlock({
    title: "6. Анализ трёх выборок объёма 200",
    subtitle: "Имитация программы forlab3: экспоненциальная, нормальная, равномерная выборки",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab3_three_samples.png", "Гистограммы трёх выборок объёма 200.")}</div>
      <h4 class="font-semibold text-white mt-4 mb-2">Выборочные характеристики</h4>
      ${statsGrid(Object.entries(d.samples_summary).flatMap(([k,v]) => [
        {label:`${k} — среднее`, value:v.mean.toFixed(3)},
        {label:`${k} — D`, value:v.D.toFixed(3)},
      ]))}
      <p class="solution-text mt-3">
        Гистограммы характерны: «колокол» $\\Rightarrow$ нормальное, плоская $\\Rightarrow$ равномерное, экспоненциальное убывание из нуля $\\Rightarrow$ показательное распределение.
      </p>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
np.random.seed(160)
lam, m, sigma, a, b = 3.2, 16, 16, 16, 32
sE = np.random.exponential(1/lam, 200)
sN = np.random.normal(m, sigma, 200)
sR = np.random.uniform(a, b, 200)
fig, axes = plt.subplots(1,3, figsize=(13,3.8))
for ax,(d,name,c) in zip(axes, [(sE,"экспоненциальная","#f59e0b"),
                                  (sN,"нормальная","#6366f1"),
                                  (sR,"равномерная","#10b981")]):
    ax.hist(d, bins=7, density=True, color=c, alpha=0.75, edgecolor="white")
    ax.set_title(f"{name}\\nmean={d.mean():.2f} D={d.var(ddof=1):.2f}")
plt.tight_layout(); plt.show()`
  })}
  `;
}
