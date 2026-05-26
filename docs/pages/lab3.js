import { sectionBlock, figure, statsGrid, table, codeBlock, note, toc } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab3;
const verdict = (ok) => ok
  ? `<span class="verdict accept">✓ принимаем $H_0$</span>`
  : `<span class="verdict reject">✗ отвергаем $H_0$</span>`;

export function renderLab3(container) {
  const accM = d.M0 >= d.m_low && d.M0 <= d.m_high;
  const accD = d.A0 >= d.D_low && d.A0 <= d.D_high;

  container.innerHTML = `
  ${toc([
    {text:"Исходная выборка и предварительные оценки"},
    {text:"Доверительный интервал для математического ожидания"},
    {text:"Доверительный интервал для дисперсии"},
    {text:"Параметрические гипотезы H₀⁽¹⁾, H₀⁽²⁾"},
    {text:"Критерий χ² Пирсона на нормальность"},
    {text:"Имитационная иллюстрация"},
  ])}

  ${sectionBlock({
    num:"1", title:"Исходная выборка из ЛР-1",
    subtitle:"$n=50$, выборочное среднее и СКО",
    body: `
      ${statsGrid([
        {label:"$n$", value:d.n},
        {label:"$\\bar{x}$", value:d.mean.toFixed(4)},
        {label:"$s$", value:d.s.toFixed(4)},
        {label:"$\\alpha$", value:d.alpha},
        {label:"$\\gamma = 1-\\alpha$", value:(1-d.alpha).toFixed(2)},
      ])}
      ${note({title:"Предположение",
        body:"Выборка получена из нормально распределённой генеральной совокупности $N(m, \\sigma^2)$ с неизвестными параметрами."})}
    `
  })}

  ${sectionBlock({
    num:"2", title:"Доверительный интервал для математического ожидания",
    body: `
      <p class="solution-text">При неизвестной дисперсии используем статистику $T = (\\bar{x} - m)\\sqrt{n}/s \\sim t(n-1)$.</p>
      <p class="solution-text">$$\\bar{x} - t_{1-\\alpha/2}(n-1)\\,\\dfrac{s}{\\sqrt{n}} \\,<\\, m \\,<\\, \\bar{x} + t_{1-\\alpha/2}(n-1)\\,\\dfrac{s}{\\sqrt{n}}$$</p>
      ${statsGrid([
        {label:"$t_{0{,}975}(49)$", value:d.t_q.toFixed(4)},
        {label:"граница", value:`±\\,${(d.t_q * d.s/Math.sqrt(d.n)).toFixed(4)}`},
      ])}
      <p class="solution-text mt-2 text-center text-lg"><b>$m \\in (${d.m_low.toFixed(4)};\\ ${d.m_high.toFixed(4)})$</b></p>
      ${codeBlock(`import numpy as np
from scipy import stats
x = np.array([${D.lab1.sample.join(", ")}])
n, m, s, a = len(x), x.mean(), x.std(ddof=1), 0.05
t = stats.t.ppf(1-a/2, n-1)
print(f"ДИ для m: ({m-t*s/np.sqrt(n):.4f}; {m+t*s/np.sqrt(n):.4f})")`, "python")}
    `
  })}

  ${sectionBlock({
    num:"3", title:"Доверительный интервал для дисперсии",
    body: `
      <p class="solution-text">Используем статистику $(n-1)s^2/\\sigma^2 \\sim \\chi^2(n-1)$.</p>
      <p class="solution-text">$$\\dfrac{(n-1)s^2}{\\chi^2_{1-\\alpha/2}(n-1)} \\,<\\, D \\,<\\, \\dfrac{(n-1)s^2}{\\chi^2_{\\alpha/2}(n-1)}$$</p>
      ${statsGrid([
        {label:"$\\chi^2_{0{,}025}(49)$", value:d.chi2_lo.toFixed(2)},
        {label:"$\\chi^2_{0{,}975}(49)$", value:d.chi2_hi.toFixed(2)},
      ])}
      <p class="solution-text mt-2 text-center text-lg"><b>$D \\in (${d.D_low.toFixed(4)};\\ ${d.D_high.toFixed(4)})$</b></p>
    `
  })}

  ${sectionBlock({
    num:"4", title:"Параметрические гипотезы",
    body: `
      <p class="solution-text">По методическим указаниям: $H_0^{(1)}\\!: m_X = M_0$, $H_0^{(2)}\\!: D_X = A_0$, где $M_0 = \\bar{x} + 0{,}5\\,s$, $A_0 = 2s^2$.</p>
      ${statsGrid([
        {label:"$M_0 = \\bar{x}+0{,}5s$", value:d.M0.toFixed(4)},
        {label:"$A_0 = 2s^2$", value:d.A0.toFixed(4)},
      ])}
      <div class="grid md:grid-cols-2 gap-3 mt-3">
        <div class="card-info">
          <div class="text-xs uppercase tracking-wider text-slate-400 mb-2">Гипотеза $H_0^{(1)}$</div>
          <p class="solution-text text-sm">$M_0 = ${d.M0.toFixed(4)}$ ${accM?"∈":"∉"} $(${d.m_low.toFixed(4)};\\ ${d.m_high.toFixed(4)})$</p>
          <div class="mt-2">${verdict(accM)}</div>
        </div>
        <div class="card-info">
          <div class="text-xs uppercase tracking-wider text-slate-400 mb-2">Гипотеза $H_0^{(2)}$</div>
          <p class="solution-text text-sm">$A_0 = ${d.A0.toFixed(4)}$ ${accD?"∈":"∉"} $(${d.D_low.toFixed(4)};\\ ${d.D_high.toFixed(4)})$</p>
          <div class="mt-2">${verdict(accD)}</div>
        </div>
      </div>
    `
  })}

  ${sectionBlock({
    num:"5", title:"Критерий $\\chi^2$ Пирсона на нормальность",
    body: `
      <p class="solution-text">Сравниваем эмпирические частоты $n_i$ с теоретическими $np_i$, где $p_i = F(\\xi_{i+1}) - F(\\xi_i)$ — вероятность попадания в $i$-й интервал по нормальному закону $N(\\bar{x}, s^2)$. Крайние интервалы расширяем до $(-\\infty; +\\infty)$.</p>
      ${table(
        ["№","Интервал","$n_i$","$p_i$","$np_i$","$\\dfrac{(n_i-np_i)^2}{np_i}$"],
        d.chi2_table.map(r => [r.i, r.interval, r.ni, r.pi.toFixed(4), r.npi.toFixed(2), r.term.toFixed(4)]),
        { footer: ["", "Σ", 50, "—", d.chi2_sum_npi.toFixed(2), `<b>${d.chi2_obs.toFixed(4)}</b>`] }
      )}
      <p class="solution-text mt-3">Число степеней свободы $\\nu = k - 1 - r = 7 - 1 - 2 = ${d.df}$ (вычли 2 оценённых параметра $m, \\sigma$).</p>
      ${statsGrid([
        {label:"$\\chi^2_{набл}$", value:d.chi2_obs.toFixed(4)},
        {label:"$\\chi^2_{крит}(0{,}05; ${d.df})$", value:d.chi2_crit.toFixed(4)},
        {label:"Решение", value:d.chi2_accept ? "<span class='text-emerald-400'>принимаем</span>" : "<span class='text-rose-400'>отвергаем</span>"},
      ])}
      <p class="solution-text mt-2">$\\chi^2_{набл} = ${d.chi2_obs.toFixed(4)} < \\chi^2_{крит} = ${d.chi2_crit.toFixed(4)}$ ⇒ ${verdict(d.chi2_accept)}: гипотеза о нормальности распределения <b>${d.chi2_accept ? "согласуется" : "не согласуется"}</b> с данными.</p>
    `
  })}

  ${sectionBlock({
    num:"6", title:"Имитация выборок из трёх теоретических распределений",
    body: `
      ${figure("./public/figures/lab3_three_samples.png",
        "<b>Рис. 3.1.</b> Гистограммы выборок объёмом 200, смоделированных из $N(16,16)$, $R(16,32)$ и $E(3{,}2)$")}
    `
  })}

  ${sectionBlock({
    num:"▣", title:"Выводы",
    body: `
      <ul class="solution-text" style="list-style: disc; padding-left: 1.4rem;">
        <li>ДИ для $m$ при $\\gamma=0{,}95$: $(${d.m_low.toFixed(3)};\\ ${d.m_high.toFixed(3)})$, длина $\\approx ${(d.m_high - d.m_low).toFixed(3)}$.</li>
        <li>ДИ для $D$: $(${d.D_low.toFixed(3)};\\ ${d.D_high.toFixed(3)})$.</li>
        <li>Гипотезы $H_0^{(1)},\\ H_0^{(2)}$ — <b>${accM ? "принимаются" : "отвергаются"}/${accD ? "принимаются" : "отвергаются"}</b>: значения $M_0$ и $A_0$ выбраны вне ДИ.</li>
        <li>Критерий $\\chi^2$: $\\chi^2_{набл} = ${d.chi2_obs.toFixed(2)} \\ll \\chi^2_{крит} = ${d.chi2_crit.toFixed(2)}$ ⇒ нормальность <b>принимается</b> с большим запасом.</li>
      </ul>
    `
  })}
  `;
}
