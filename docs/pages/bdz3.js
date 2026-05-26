import { sectionBlock, figure, statsGrid, table, codeBlock, note, h, toc } from "./_components.js";
import { D } from "./_data.js";

const verdict = (ok) => ok
  ? `<span class="verdict accept">✓ принимаем $H_0$</span>`
  : `<span class="verdict reject">✗ отвергаем $H_0$</span>`;

export function renderBDZ3(container) {
  const L1 = D.lab1;
  const L3 = D.lab3;
  const L4 = D.lab4;

  // -------- Часть 1 (ЛР-1) --------
  const part1 = `
    ${h("1.1", "Исходные данные и вариационный ряд")}
    <p class="solution-text">Дана выборка объёма $n=50$ из приложения 1 практикума (столбец $N=16$):</p>
    <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${L1.sample.join(", ")}</pre>
    <p class="solution-text">Вариационный ряд (по возрастанию):</p>
    <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${L1.var_row.join(", ")}</pre>
    ${statsGrid([
      {label:"объём n", value:50},
      {label:"размах R", value:`${L1.max} − ${L1.min} = ${L1.max-L1.min}`},
      {label:"число значений", value:L1.uniq.length},
    ])}

    ${h("1.2", "Статистический ряд и группировка (7 интервалов)")}
    ${table(
      ["$x_i$","$n_i$","$w_i = n_i/n$"],
      L1.uniq.map((u,i)=>[u, L1.freq[i], (L1.freq[i]/50).toFixed(3)])
    )}
    <p class="solution-text mt-3">Длина интервала $h = (x_{\\max} - x_{\\min})/7 = ${L1.max-L1.min}/7 = ${((L1.max-L1.min)/7).toFixed(4)}$.</p>
    ${table(
      ["№","Интервал","$n_i$","$w_i$","центр $c_i$"],
      L1.counts.map((c,i)=>[i+1, `[${L1.edges[i].toFixed(3)}; ${L1.edges[i+1].toFixed(3)}]`, c, L1.rel[i].toFixed(3), L1.centers[i].toFixed(3)])
    )}

    ${h("1.3", "Числовые характеристики выборки")}
    ${statsGrid([
      {label:"$\\bar{x}$ (среднее)", value:L1.mean.toFixed(4)},
      {label:"$D_x$ (смещ.)", value:L1.D.toFixed(4)},
      {label:"$S^2$ (несмещ.)", value:L1.S2.toFixed(4)},
      {label:"$s$ (СКО)", value:L1.s.toFixed(4)},
      {label:"медиана", value:L1.median},
      {label:"мода", value:L1.mode},
    ])}
    <p class="solution-text mt-2">Для группированной выборки (по центрам интервалов): $\\bar{x}_г = ${L1.mean_g.toFixed(4)}$, $S^2_г = ${L1.S2_g.toFixed(4)}$, $s_г = ${L1.s_g.toFixed(4)}$.</p>

    ${h("1.4", "Графическое представление")}
    ${figure("./public/figures/lab1_hist_polygon.png", "<b>Рис. 1.</b> Гистограмма частот и полигон выборки (7 интервалов)")}
    ${figure("./public/figures/lab1_empirical_cdf.png", "<b>Рис. 2.</b> Эмпирическая функция распределения $F_n(x)$")}

    ${codeBlock(`# Часть 1 — обработка одномерной выборки
import numpy as np
x = np.array([${L1.sample.join(", ")}])
n = len(x)
print(f"n = {n}, размах = {x.max()-x.min()}")
print(f"среднее = {x.mean():.4f}")
print(f"D (смещ) = {x.var():.4f}")
print(f"S^2 (несм) = {x.var(ddof=1):.4f}")
print(f"медиана = {np.median(x)}")
vals, cnts = np.unique(x, return_counts=True)
print(f"мода = {vals[cnts.argmax()]} (частота {cnts.max()})")`, "python · часть 1")}
  `;

  // -------- Часть 2 (ЛР-3) --------
  const accM = L3.M0 >= L3.m_low && L3.M0 <= L3.m_high;
  const accD = L3.A0 >= L3.D_low && L3.A0 <= L3.D_high;
  const part2 = `
    ${h("2.1", "Точечные оценки и доверительные интервалы")}
    <p class="solution-text">В предположении нормальности генеральной совокупности с неизвестными $m$ и $\\sigma^2$ строим доверительные интервалы при $\\gamma = 1 - \\alpha = 0{,}95$.</p>
    ${statsGrid([
      {label:"$\\bar{x}$", value:L3.mean.toFixed(4)},
      {label:"$s$", value:L3.s.toFixed(4)},
      {label:"$t_{0{,}975}(49)$", value:L3.t_q.toFixed(4)},
      {label:"$\\chi^2_{0{,}025}(49)$", value:L3.chi2_lo.toFixed(2)},
      {label:"$\\chi^2_{0{,}975}(49)$", value:L3.chi2_hi.toFixed(2)},
    ])}
    <p class="solution-text mt-2">
      $\\displaystyle \\bar{x} - t_{1-\\alpha/2}(n-1)\\,\\frac{s}{\\sqrt{n}} < m < \\bar{x} + t_{1-\\alpha/2}(n-1)\\,\\frac{s}{\\sqrt{n}}$ ⇒
      <b>$m \\in (${L3.m_low.toFixed(4)};\\ ${L3.m_high.toFixed(4)})$</b>
    </p>
    <p class="solution-text mt-1">
      $\\displaystyle \\frac{(n-1)s^2}{\\chi^2_{1-\\alpha/2}(n-1)} < D < \\frac{(n-1)s^2}{\\chi^2_{\\alpha/2}(n-1)}$ ⇒
      <b>$D \\in (${L3.D_low.toFixed(4)};\\ ${L3.D_high.toFixed(4)})$</b>
    </p>

    ${h("2.2", "Проверка параметрических гипотез")}
    <p class="solution-text">Согласно методическим указаниям, рассматриваем $H_0^{(1)}\\!: m_X = M_0$ и $H_0^{(2)}\\!: D_X = A_0$, где $M_0 = \\bar{x} + 0{,}5s$, $A_0 = 2s^2$.</p>
    ${statsGrid([
      {label:"$M_0 = \\bar{x}+0{,}5s$", value:L3.M0.toFixed(4)},
      {label:"$A_0 = 2s^2$", value:L3.A0.toFixed(4)},
    ])}
    <p class="solution-text mt-2">$M_0 = ${L3.M0.toFixed(4)}$ ${accM?"∈":"∉"} $(${L3.m_low.toFixed(4)}; ${L3.m_high.toFixed(4)})$ ⇒ ${verdict(accM)}.</p>
    <p class="solution-text">$A_0 = ${L3.A0.toFixed(4)}$ ${accD?"∈":"∉"} $(${L3.D_low.toFixed(4)}; ${L3.D_high.toFixed(4)})$ ⇒ ${verdict(accD)}.</p>

    ${h("2.3", "Критерий $\\chi^2$ Пирсона на нормальность")}
    <p class="solution-text">Сравниваем эмпирические частоты $n_i$ с теоретическими $n p_i$ для нормального распределения с оценёнными параметрами $\\hat{m}=\\bar{x},\\ \\hat{\\sigma}=s$. Число степеней свободы $\\nu = k - 1 - r = 7 - 1 - 2 = ${L3.df}$.</p>
    ${table(
      ["i","Интервал","$n_i$","$p_i$","$np_i$","$\\dfrac{(n_i-np_i)^2}{np_i}$"],
      L3.chi2_table.map(r => [r.i, r.interval, r.ni, r.pi.toFixed(4), r.npi.toFixed(2), r.term.toFixed(4)]),
      { footer: ["","Σ", 50, "—", L3.chi2_sum_npi?.toFixed(2)||"—", `<b>${L3.chi2_obs.toFixed(4)}</b>`] }
    )}
    ${statsGrid([
      {label:"$\\chi^2_{набл}$", value:L3.chi2_obs.toFixed(4)},
      {label:"$\\chi^2_{крит}$", value:L3.chi2_crit.toFixed(4)},
      {label:"степ. свободы", value:L3.df},
      {label:"уровень α", value:0.05},
    ])}
    <p class="solution-text mt-2">$\\chi^2_{набл} = ${L3.chi2_obs.toFixed(4)} < \\chi^2_{крит} = ${L3.chi2_crit.toFixed(4)}$ ⇒ ${verdict(L3.chi2_obs < L3.chi2_crit)}: данные согласуются с нормальным распределением.</p>

    ${codeBlock(`# Часть 2 — доверительные интервалы и критерий χ²
import numpy as np
from scipy import stats
x = np.array([${D.lab1.sample.join(", ")}])
n = len(x); m, s = x.mean(), x.std(ddof=1); alpha = 0.05
t = stats.t.ppf(1-alpha/2, n-1)
print(f"ДИ для m: ({m-t*s/np.sqrt(n):.4f}; {m+t*s/np.sqrt(n):.4f})")
c_lo, c_hi = stats.chi2.ppf(alpha/2, n-1), stats.chi2.ppf(1-alpha/2, n-1)
print(f"ДИ для D: ({(n-1)*s*s/c_hi:.4f}; {(n-1)*s*s/c_lo:.4f})")

# χ²-критерий на нормальность (7 интервалов)
edges = np.linspace(x.min(), x.max(), 8); edges[0]=-np.inf; edges[-1]=np.inf
ni, _ = np.histogram(x, bins=np.linspace(x.min(), x.max(), 8))
pi = np.diff(stats.norm.cdf(edges, m, s))
chi2_obs = np.sum((ni - n*pi)**2 / (n*pi))
print(f"χ²_набл = {chi2_obs:.4f}, χ²_крит = {stats.chi2.ppf(0.95, 7-1-2):.4f}")`, "python · часть 2")}
  `;

  // -------- Часть 3 (ЛР-4) --------
  const part3 = `
    ${h("3.1", "Парная выборка $(x_i,y_i)$, $n=50$")}
    <p class="solution-text">Данные взяты из приложения 2 практикума для $N=16$.</p>
    <details class="my-2 text-sm">
      <summary class="text-slate-400 cursor-pointer hover:text-white">Показать выборку (X, Y)</summary>
      <div class="mt-2">
        <div class="text-xs text-slate-500 mb-1">X:</div>
        <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${L4.X.map(v=>v.toFixed(2)).join(", ")}</pre>
        <div class="text-xs text-slate-500 mb-1 mt-2">Y:</div>
        <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${L4.Y.map(v=>v.toFixed(2)).join(", ")}</pre>
      </div>
    </details>

    ${h("3.2", "Точечные характеристики и коэффициент корреляции")}
    ${statsGrid([
      {label:"$\\bar{x}$", value:L4.mx.toFixed(4)},
      {label:"$\\bar{y}$", value:L4.my.toFixed(4)},
      {label:"$s_x$", value:L4.sx.toFixed(4)},
      {label:"$s_y$", value:L4.sy.toFixed(4)},
      {label:"$r_{xy}$", value:L4.r.toFixed(4)},
    ])}
    <p class="solution-text mt-2">Сильная отрицательная линейная связь (|r| > 0,9).</p>

    ${h("3.3", "Проверка значимости коэффициента корреляции")}
    <p class="solution-text">$H_0\\!: \\rho = 0$. Статистика $T = r\\sqrt{n-2}/\\sqrt{1-r^2} \\sim t(n-2)$.</p>
    ${statsGrid([
      {label:"$T_{набл}$", value:L4.T_corr.toFixed(4)},
      {label:"$t_{крит}(0{,}025;48)$", value:L4.t_crit.toFixed(4)},
    ])}
    <p class="solution-text mt-2">$|T_{набл}| = ${Math.abs(L4.T_corr).toFixed(2)} > ${L4.t_crit.toFixed(2)}$ ⇒ <span class="verdict reject">$H_0$ отвергаем</span> — корреляция значима.</p>

    ${h("3.4", "Уравнения линейной регрессии")}
    <p class="solution-text">МНК-оценки регрессии $Y$ на $X$ и $X$ на $Y$:</p>
    <div class="grid md:grid-cols-2 gap-3 mt-2">
      <div class="stat-cell"><div class="lbl">Y на X</div><div class="val">$\\hat{y} = ${L4.b_yx.toFixed(4)}\\,x + ${L4.a_yx.toFixed(4)}$</div></div>
      <div class="stat-cell"><div class="lbl">X на Y</div><div class="val">$\\hat{x} = ${L4.b_xy.toFixed(4)}\\,y + ${L4.a_xy.toFixed(4)}$</div></div>
    </div>
    <p class="solution-text mt-3">Коэффициент детерминации $R^2 = r^2 = ${L4.R2.toFixed(4)} = ${(L4.R2*100).toFixed(1)}\\%$.</p>

    ${h("3.5", "Корреляционная таблица и проверка значимости регрессии")}
    ${figure("./public/figures/lab4_scatter.png", "<b>Рис. 3.</b> Диаграмма рассеяния и регрессионные прямые")}
    ${figure("./public/figures/lab4_corr_table.png", "<b>Рис. 4.</b> Корреляционная таблица $7 \\times 7$ интервалов группировки")}

    ${statsGrid([
      {label:"$F_{набл}$", value:L4.F.toFixed(2)},
      {label:"$F_{крит}(0{,}95;1;48)$", value:L4.F_crit.toFixed(4)},
    ])}
    <p class="solution-text mt-2">$F_{набл} = ${L4.F.toFixed(1)} \\gg F_{крит} = ${L4.F_crit.toFixed(2)}$ ⇒ регрессия статистически значима.</p>

    ${codeBlock(`# Часть 3 — линейная регрессия
import numpy as np
from scipy import stats
X = np.array([${D.lab4.X.map(v=>v.toFixed(2)).join(", ")}])
Y = np.array([${D.lab4.Y.map(v=>v.toFixed(2)).join(", ")}])
r, _ = stats.pearsonr(X, Y); print(f"r = {r:.4f}")
sl, ic, rv, _, _ = stats.linregress(X, Y)
print(f"Y = {sl:.4f}·X + {ic:.4f}   (R² = {rv**2:.4f})")`, "python · часть 3")}
  `;

  // --- Сборка ---
  container.innerHTML = `
    ${note({ title: "Аннотация", body:
      "БДЗ-3 «Обработка и анализ статистических данных» — расчётно-аналитическая работа, состоящая из трёх частей. Каждая часть отрабатывает методы соответствующей лабораторной работы (№1, №3, №4) на индивидуальном массиве данных варианта 16. Уровень значимости $\\alpha = 0{,}05$ во всех проверках. Все расчёты выполнены в Python (NumPy, SciPy)."
    })}

    ${toc([
      {text:"Часть 1. Статистическая обработка одномерной выборки", href:"#part1"},
      {text:"Часть 2. Проверка гипотезы о законе распределения", href:"#part2"},
      {text:"Часть 3. Линейная регрессионная модель", href:"#part3"},
      {text:"Сводный вывод", href:"#conclusion"},
    ])}

    ${sectionBlock({
      num: "1", title: "Часть 1. Статистическая обработка одномерной выборки",
      subtitle: "$n = 50$, выборка из приложения 1 (соответствует ЛР-1)",
      body: part1
    })}

    ${sectionBlock({
      num: "2", title: "Часть 2. Проверка гипотезы о законе распределения",
      subtitle: "доверительные интервалы и критерий $\\chi^2$ (соответствует ЛР-3)",
      body: part2
    })}

    ${sectionBlock({
      num: "3", title: "Часть 3. Анализ в линейной регрессионной модели",
      subtitle: "парная выборка $(X,Y)$, $n=50$ (соответствует ЛР-4)",
      body: part3
    })}

    ${sectionBlock({
      num: "▣", title: "Сводный вывод",
      body: `
        <ul class="solution-text" style="list-style: disc; padding-left: 1.4rem; line-height: 1.85;">
          <li><b>Часть 1.</b> Среднее $\\bar{x} = ${L1.mean.toFixed(2)}$, СКО $s = ${L1.s.toFixed(2)}$. Распределение симметрично, с модой $${L1.mode}$ и медианой $${L1.median}$. Гистограмма по форме согласуется с нормальной кривой.</li>
          <li><b>Часть 2.</b> Доверительные интервалы при $\\gamma = 0{,}95$:
            $m \\in (${L3.m_low.toFixed(3)};\\ ${L3.m_high.toFixed(3)})$, $D \\in (${L3.D_low.toFixed(3)};\\ ${L3.D_high.toFixed(3)})$.
            Гипотезы $H_0^{(1)},\\ H_0^{(2)}$ — <b>отвергнуты</b> ($M_0,\\ A_0$ вне ДИ). Критерий $\\chi^2$ Пирсона: $\\chi^2_{набл}=${L3.chi2_obs.toFixed(2)} < \\chi^2_{крит}=${L3.chi2_crit.toFixed(2)}$ — гипотеза нормальности <b>принимается</b>.
          </li>
          <li><b>Часть 3.</b> $r = ${L4.r.toFixed(3)}$ — сильная отрицательная линейная связь. Уравнение регрессии $\\hat{y} = ${L4.b_yx.toFixed(3)}\\,x + ${L4.a_yx.toFixed(3)}$ объясняет $${(L4.R2*100).toFixed(1)}\\%$ дисперсии $Y$. F-критерий: регрессия значима ($F = ${L4.F.toFixed(0)} \\gg ${L4.F_crit.toFixed(2)}$).</li>
        </ul>
      `
    })}
  `;
}
