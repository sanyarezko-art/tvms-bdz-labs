import { sectionBlock, figure, statsGrid } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab4;
const verdict = (ok) => ok
  ? `<span class="verdict accept">✓ принимаем $H_0$</span>`
  : `<span class="verdict reject">✗ отвергаем $H_0$</span>`;

export function renderLab4(container) {
  const xs = d.X.map(v => v.toFixed(2)).join(", ");
  const ys = d.Y.map(v => v.toFixed(2)).join(", ");

  container.innerHTML = `
  ${sectionBlock({
    title: "1. Исходные данные",
    subtitle: "Парная выборка $(x_i, y_i)$, $n=50$, приложение 2 практикума",
    body: `
      <h4 class="font-semibold text-white mb-1">X (вариант 16)</h4>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${xs}</pre>
      <h4 class="font-semibold text-white mt-3 mb-1">Y (вариант 16)</h4>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${ys}</pre>
    `,
  })}

  ${sectionBlock({
    title: "2. Числовые характеристики",
    body: `
      ${statsGrid([
        {label:"$\\bar{x}$",  value:d.x_bar.toFixed(4)},
        {label:"$\\bar{y}$",  value:d.y_bar.toFixed(4)},
        {label:"$S_X$",       value:d.sX.toFixed(4)},
        {label:"$S_Y$",       value:d.sY.toFixed(4)},
        {label:"$\\text{cov}(X,Y)$", value:d.cov.toFixed(4)},
        {label:"$r_{XY}$",    value:d.r.toFixed(4)},
      ])}
      <p class="solution-text mt-3">
        Коэффициент корреляции $r \\approx ${d.r.toFixed(3)}$ — сильная отрицательная линейная связь.
      </p>
    `,
    code:
`import numpy as np
X = np.array([${d.X.join(",")}])
Y = np.array([${d.Y.join(",")}])
print(f"x̄ = {X.mean():.4f}, ȳ = {Y.mean():.4f}")
print(f"S_X = {X.std(ddof=1):.4f}, S_Y = {Y.std(ddof=1):.4f}")
cov = np.cov(X,Y, ddof=1)[0,1]
r = cov / (X.std(ddof=1)*Y.std(ddof=1))
print(f"cov = {cov:.4f}")
print(f"r = {r:.4f}")`
  })}

  ${sectionBlock({
    title: "3. Гипотеза об отсутствии корреляции",
    subtitle: "$H_0: \\rho_{XY}=0$ против $H_1: \\rho_{XY}\\neq 0$ при $\\alpha=0{,}05$",
    body: `
      <p class="solution-text">
        Статистика $t = \\dfrac{r\\sqrt{n-2}}{\\sqrt{1-r^2}}$.
      </p>
      ${statsGrid([
        {label:"$t_{набл}$", value:d.t_stat.toFixed(4)},
        {label:"$t_{крит}$ (n-2=48)", value:d.t_crit.toFixed(4)},
      ])}
      <div class="answer-box">
        $|t_{набл}| = ${Math.abs(d.t_stat).toFixed(2)} > t_{крит} = ${d.t_crit.toFixed(2)}$ → ${verdict(false)} ⇒ корреляция значима.
      </div>
    `,
  })}

  ${sectionBlock({
    title: "4. Интервальная оценка коэффициента корреляции",
    subtitle: "Преобразование Фишера",
    body: `
      <p class="solution-text">
        $z = \\frac{1}{2}\\ln\\frac{1+r}{1-r}$, $\\sigma_z = \\dfrac{1}{\\sqrt{n-3}}$, доверит. интервал для $z$ → обратное преобразование → интервал для $\\rho$.
      </p>
      <div class="answer-box">
        $\\rho \\in (${d.r_lo.toFixed(4)};\\ ${d.r_hi.toFixed(4)})$ с доверительной вероятностью $0{,}95$.
      </div>
    `,
  })}

  ${sectionBlock({
    title: "5. Уравнения линейной регрессии",
    body: `
      <p class="solution-text">
        Метод наименьших квадратов: $a = \\dfrac{\\text{cov}(X,Y)}{S_X^2}$, $b = \\bar{y} - a\\bar{x}$.
      </p>
      <div class="answer-box">
        <div class="mb-1"><b>$Y$ на $x$:</b>  $\\hat{y} = ${d.a_yx.toFixed(4)}\\,x + (${d.b_yx.toFixed(4)})$</div>
        <div><b>$X$ на $y$:</b>  $\\hat{x} = ${d.a_xy.toFixed(4)}\\,y + ${d.b_xy.toFixed(4)}$</div>
      </div>
    `,
  })}

  ${sectionBlock({
    title: "6. Диаграмма рассеяния и прямые регрессии",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab4_scatter.png", "Диаграмма рассеяния и прямые регрессии $Y$ на $x$ (сплошная), $X$ на $y$ (пунктир).")}</div>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
X = np.array([${d.X.join(",")}])
Y = np.array([${d.Y.join(",")}])
xb, yb = X.mean(), Y.mean()
sX2 = X.var(ddof=1); sY2 = Y.var(ddof=1)
cov = np.cov(X,Y, ddof=1)[0,1]
a_yx = cov/sX2; b_yx = yb - a_yx*xb
a_xy = cov/sY2; b_xy = xb - a_xy*yb
r = cov/(np.sqrt(sX2)*np.sqrt(sY2))

fig, ax = plt.subplots(figsize=(8,5))
ax.scatter(X, Y, color="#6366f1", s=45, edgecolor="white", linewidth=1.1, alpha=0.85)
xs = np.linspace(X.min(), X.max(), 100)
ax.plot(xs, a_yx*xs + b_yx, color="#ef4444", lw=2.4, label=f"Y на x")
ys = np.linspace(Y.min(), Y.max(), 100)
ax.plot(a_xy*ys + b_xy, ys, "--", color="#10b981", lw=2.4, label=f"X на y")
ax.set_title(f"Диаграмма рассеяния, r = {r:.3f}")
ax.legend(frameon=False); plt.show()`
  })}

  ${sectionBlock({
    title: "7. Коэффициент детерминации и доверительные интервалы",
    body: `
      ${statsGrid([
        {label:"$R^2$", value:d.R2.toFixed(4)},
        {label:"$s^2$ ошибок", value:d.s2_err.toFixed(4)},
        {label:"ДИ для $a$", value:`(${d.ci_a[0].toFixed(3)}; ${d.ci_a[1].toFixed(3)})`},
        {label:"ДИ для $b$", value:`(${d.ci_b[0].toFixed(3)}; ${d.ci_b[1].toFixed(3)})`},
        {label:"ДИ для $\\sigma^2$", value:`(${d.ci_s2[0].toFixed(3)}; ${d.ci_s2[1].toFixed(3)})`},
      ])}
      <p class="solution-text mt-2">
        $R^2 = ${(d.R2*100).toFixed(1)}\\%$ — линия регрессии объясняет почти всю дисперсию $Y$.
      </p>
    `,
  })}

  ${sectionBlock({
    title: "8. Значимость линейной регрессии (F-тест)",
    subtitle: "$F = \\dfrac{(SS_{tot}-SS_{res})/1}{s^2_{ош}}$ vs $F_{крит}(1, n-2)$",
    body: `
      ${statsGrid([
        {label:"$F_{набл}$", value:d.F_stat.toFixed(4)},
        {label:"$F_{крит}$", value:d.F_crit.toFixed(4)},
      ])}
      <div class="answer-box">
        $F_{набл} = ${d.F_stat.toFixed(2)} \\gg F_{крит} = ${d.F_crit.toFixed(2)}$ → регрессия значима.
      </div>
    `,
  })}

  ${sectionBlock({
    title: "9. Гипотеза о равенстве средних $H_0: m_X = m_Y$",
    subtitle: "$t$-тест для парных наблюдений",
    body: `
      ${statsGrid([
        {label:"$t_{набл}$", value:d.t_pair.toFixed(4)},
        {label:"$t_{крит}$", value:d.t_pair_crit.toFixed(4)},
      ])}
      <div class="answer-box">
        $|t_{набл}| = ${Math.abs(d.t_pair).toFixed(2)} > t_{крит} = ${d.t_pair_crit.toFixed(2)}$ → ${verdict(false)}, средние различаются.
      </div>
    `,
  })}

  ${sectionBlock({
    title: "10. Группировка и корреляционная таблица (7×7)",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab4_corr_table.png", "Корреляционная таблица 7×7 (частоты).")}</div>
      <p class="solution-text mt-3">Числовые характеристики по группированной выборке:</p>
      ${statsGrid([
        {label:"$\\bar{x}_г$", value:d.grouped.mxg.toFixed(4)},
        {label:"$\\bar{y}_г$", value:d.grouped.myg.toFixed(4)},
        {label:"$S_{X,г}$",    value:d.grouped.sxg.toFixed(4)},
        {label:"$S_{Y,г}$",    value:d.grouped.syg.toFixed(4)},
        {label:"$r_г$",        value:d.grouped.rg.toFixed(4)},
      ])}
      <p class="solution-text mt-3">
        Различия с негруппированными значениями невелики — группировка не сильно искажает оценки.
      </p>
    `,
  })}
  `;
}
