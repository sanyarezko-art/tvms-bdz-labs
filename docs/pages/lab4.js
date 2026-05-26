import { sectionBlock, figure, statsGrid, table, codeBlock, note, toc } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab4;
const verdict = (ok) => ok
  ? `<span class="verdict accept">✓ принимаем $H_0$</span>`
  : `<span class="verdict reject">✗ отвергаем $H_0$</span>`;

export function renderLab4(container) {
  const xs = d.X.map(v => v.toFixed(2)).join(", ");
  const ys = d.Y.map(v => v.toFixed(2)).join(", ");

  container.innerHTML = `
  ${toc([
    {text:"Исходные данные — парная выборка"},
    {text:"Точечные характеристики, коэффициент корреляции"},
    {text:"Проверка значимости коэффициента корреляции"},
    {text:"ДИ для коэффициента корреляции"},
    {text:"Уравнения линейной регрессии"},
    {text:"Корреляционная таблица 7×7"},
    {text:"Значимость регрессии (F-тест)"},
    {text:"Сравнение математических ожиданий"},
  ])}

  ${sectionBlock({
    num:"1", title:"Исходные данные",
    subtitle:"Парная выборка $(x_i, y_i)$, $n=50$, приложение 2 практикума",
    body: `
      <h4 class="font-semibold text-white mt-1 mb-1">X (вариант 16):</h4>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${xs}</pre>
      <h4 class="font-semibold text-white mt-3 mb-1">Y (вариант 16):</h4>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${ys}</pre>
    `
  })}

  ${sectionBlock({
    num:"2", title:"Точечные характеристики и коэффициент корреляции",
    body: `
      ${statsGrid([
        {label:"$\\bar{x}$", value:d.mx.toFixed(4)},
        {label:"$\\bar{y}$", value:d.my.toFixed(4)},
        {label:"$s_x$", value:d.sx.toFixed(4)},
        {label:"$s_y$", value:d.sy.toFixed(4)},
        {label:"$\\mathrm{cov}(X,Y)$", value:d.cov.toFixed(4)},
        {label:"$r_{xy}$", value:d.r.toFixed(4)},
      ])}
      <p class="solution-text mt-2">$|r| = ${Math.abs(d.r).toFixed(3)} > 0{,}9$ ⇒ <b>сильная отрицательная линейная связь</b> между $X$ и $Y$.</p>
      ${codeBlock(`import numpy as np
from scipy import stats
X = np.array([${d.X.map(v=>v.toFixed(2)).join(", ")}])
Y = np.array([${d.Y.map(v=>v.toFixed(2)).join(", ")}])
print(f"mx={X.mean():.4f}, my={Y.mean():.4f}")
print(f"sx={X.std(ddof=1):.4f}, sy={Y.std(ddof=1):.4f}")
print(f"r = {np.corrcoef(X,Y)[0,1]:.4f}")`, "python")}
    `
  })}

  ${sectionBlock({
    num:"3", title:"Проверка значимости коэффициента корреляции",
    body: `
      <p class="solution-text">$H_0\\!: \\rho = 0$, $H_1\\!: \\rho \\ne 0$. Статистика: $T = r\\,\\sqrt{n-2}/\\sqrt{1-r^2} \\sim t(n-2)$.</p>
      ${statsGrid([
        {label:"$T_{набл}$", value:d.T_corr.toFixed(4)},
        {label:"$t_{0{,}975}(48)$", value:d.t_crit.toFixed(4)},
      ])}
      <p class="solution-text mt-2">$|T_{набл}| = ${Math.abs(d.T_corr).toFixed(2)} \\gg ${d.t_crit.toFixed(2)}$ ⇒ ${verdict(false)} — корреляция статистически значима.</p>
    `
  })}

  ${sectionBlock({
    num:"4", title:"Доверительный интервал для $\\rho$",
    body: `
      <p class="solution-text">Через преобразование Фишера: $Z = \\tfrac{1}{2}\\ln\\!\\dfrac{1+r}{1-r} \\sim N(z_{\\rho}, 1/(n-3))$.</p>
      <p class="solution-text mt-2 text-center text-lg"><b>$\\rho \\in (${d.r_lo.toFixed(4)};\\ ${d.r_hi.toFixed(4)})$</b></p>
    `
  })}

  ${sectionBlock({
    num:"5", title:"Уравнения линейной регрессии",
    body: `
      <p class="solution-text">Метод наименьших квадратов: $\\hat{b}_{yx} = \\mathrm{cov}/s_x^2$, $\\hat{a}_{yx} = \\bar{y} - \\hat{b}_{yx}\\bar{x}$.</p>
      <div class="grid md:grid-cols-2 gap-3 mt-2">
        <div class="stat-cell"><div class="lbl">$Y$ на $X$</div><div class="val">$\\hat{y} = ${d.b_yx.toFixed(4)}\\,x + ${d.a_yx.toFixed(4)}$</div></div>
        <div class="stat-cell"><div class="lbl">$X$ на $Y$</div><div class="val">$\\hat{x} = ${d.b_xy.toFixed(4)}\\,y + ${d.a_xy.toFixed(4)}$</div></div>
      </div>
      ${figure("./public/figures/lab4_scatter.png",
        "<b>Рис. 4.1.</b> Диаграмма рассеяния и две линии регрессии. Угол между линиями отражает силу связи: при $|r|\\to 1$ линии сливаются")}
      <p class="solution-text mt-2">Коэффициент детерминации $R^2 = r^2 = ${d.R2.toFixed(4)}$ ⇒ <b>${(d.R2*100).toFixed(1)}%</b> разброса $Y$ объясняется линейной зависимостью от $X$.</p>
    `
  })}

  ${sectionBlock({
    num:"6", title:"Корреляционная таблица (группировка 7×7)",
    body: `
      ${figure("./public/figures/lab4_corr_table.png",
        "<b>Рис. 4.2.</b> Корреляционная таблица. Чёткая отрицательная диагональная структура подтверждает сильную обратную связь")}
    `
  })}

  ${sectionBlock({
    num:"7", title:"Проверка значимости линейной регрессии (F-тест)",
    body: `
      <p class="solution-text">$H_0\\!: b = 0$ (нет линейной зависимости). $F = \\dfrac{SS_{рег}/1}{SS_{ост}/(n-2)} \\sim F(1, n-2)$.</p>
      ${statsGrid([
        {label:"$F_{набл}$", value:d.F.toFixed(2)},
        {label:"$F_{крит}(0{,}95; 1; 48)$", value:d.F_crit.toFixed(4)},
        {label:"$s^2$ остатков", value:d.s2_err.toFixed(4)},
      ])}
      <p class="solution-text mt-2">$F_{набл} = ${d.F.toFixed(1)} \\gg F_{крит} = ${d.F_crit.toFixed(2)}$ ⇒ ${verdict(false)} — линейная модель статистически значима.</p>
    `
  })}

  ${sectionBlock({
    num:"8", title:"Сравнение математических ожиданий $m_X$ и $m_Y$",
    body: `
      <p class="solution-text">Парный t-тест: $H_0\\!: m_X = m_Y$ (т.е. среднее разностей $D = X - Y$ равно нулю).</p>
      ${statsGrid([
        {label:"$t_{набл}$", value:d.t_pair.toFixed(4)},
        {label:"$t_{0{,}975}(49)$", value:d.t_pair_crit.toFixed(4)},
      ])}
      <p class="solution-text mt-2">$|t_{набл}| = ${Math.abs(d.t_pair).toFixed(2)} > ${d.t_pair_crit.toFixed(2)}$ ⇒ ${verdict(false)} — $m_X$ и $m_Y$ значимо различны.</p>
    `
  })}

  ${sectionBlock({
    num:"▣", title:"Выводы",
    body: `
      <ul class="solution-text" style="list-style: disc; padding-left: 1.4rem;">
        <li>$r = ${d.r.toFixed(3)}$ — сильная отрицательная линейная связь; ДИ: $(${d.r_lo.toFixed(3)};\\ ${d.r_hi.toFixed(3)})$.</li>
        <li>Уравнение регрессии: $\\hat{y} = ${d.b_yx.toFixed(3)}\\,x + ${d.a_yx.toFixed(3)}$.</li>
        <li>$R^2 = ${d.R2.toFixed(4)}$ — модель объясняет ${(d.R2*100).toFixed(1)}% дисперсии $Y$.</li>
        <li>F-критерий: $F = ${d.F.toFixed(0)} \\gg ${d.F_crit.toFixed(2)}$ — регрессия высоко значима.</li>
        <li>$m_X \\ne m_Y$: парный t-тест отвергает равенство.</li>
      </ul>
    `
  })}
  `;
}
