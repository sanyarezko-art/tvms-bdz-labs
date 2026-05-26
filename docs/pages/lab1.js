import { sectionBlock, figure, statsGrid, table } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab1;

export function renderLab1(container) {
  const sample = d.sample.join(", ");
  const varRow = d.var_row.join(", ");

  // Статистический ряд таблица
  const statRows = d.uniq.map((u, i) => [u, d.freq[i], (d.freq[i]/50).toFixed(3)]);

  // Таблица интервалов
  const intRows = d.counts.map((c, i) => [
    i+1,
    `[${d.edges[i].toFixed(3)};  ${d.edges[i+1].toFixed(3)}]`,
    c,
    d.rel[i].toFixed(3),
    d.centers[i].toFixed(3)
  ]);

  container.innerHTML = `
  ${sectionBlock({
    title: "1. Исходные данные",
    subtitle: `Вариант 16, объём выборки $n=50$ (приложение 1 практикума)`,
    body: `
      <p class="solution-text">Выборка из приложения 1, столбец $N=16$:</p>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${sample}</pre>
      <p class="solution-text mt-3">Вариационный ряд (упорядоченные значения):</p>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${varRow}</pre>
      <p class="solution-text mt-3">Размах выборки: $R = x_{(n)} - x_{(1)} = 14 - 2 = 12$.</p>
    `,
    code:
`import numpy as np
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
print(f"n = {len(X)}, R = {X.max() - X.min()}")
print(f"min = {X.min()}, max = {X.max()}")
print(f"вариационный ряд:\\n{np.sort(X)}")`
  })}

  ${sectionBlock({
    title: "2. Статистический ряд",
    subtitle: "Уникальные значения и их относительные частоты",
    body: `
      ${table(["$x_i$", "$n_i$", "$w_i = n_i/n$"], statRows)}
    `,
    code:
`import numpy as np
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
u, n = np.unique(X, return_counts=True)
print("x_i\\tn_i\\tw_i")
for ui, ni in zip(u, n):
    print(f"{ui}\\t{ni}\\t{ni/len(X):.3f}")`
  })}

  ${sectionBlock({
    title: "3. Группировка в 7 интервалов",
    subtitle: `Шаг $h = R/7 = 12/7 \\approx 1{,}714$`,
    body: `
      ${table(["№", "$[a;b]$", "$n_i$", "$w_i$", "середина"], intRows)}
    `,
    code:
`import numpy as np
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
k = 7
edges = np.linspace(X.min(), X.max(), k+1)
counts, _ = np.histogram(X, bins=edges)
centers = (edges[:-1] + edges[1:])/2
print("№  [a;b]\\t\\tn_i  w_i")
for i in range(k):
    print(f"{i+1}  [{edges[i]:.3f}; {edges[i+1]:.3f}]  {counts[i]}  {counts[i]/len(X):.3f}")`
  })}

  ${sectionBlock({
    title: "4. Гистограмма и полигон относительных частот",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab1_hist_polygon.png", "Рис. 1. Гистограмма плотности и полигон частот.")}</div>
      <p class="hint">В режиме редактирования — запустите код ниже, чтобы заново построить график.</p>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
k = 7
edges = np.linspace(X.min(), X.max(), k+1)
counts, _ = np.histogram(X, bins=edges)
centers = (edges[:-1] + edges[1:])/2
h = (X.max() - X.min())/k
rel = counts / len(X)

fig, ax = plt.subplots(figsize=(8,4.5))
ax.bar(centers, rel/h, width=h*0.95, color="#6366f1", alpha=0.55, edgecolor="white", label="гистограмма")
ax.plot(centers, rel/h, "o-", color="#ef4444", lw=2, ms=6, label="полигон")
ax.set_xlabel("x"); ax.set_ylabel("плотность отн. частоты")
ax.set_title("Гистограмма и полигон частот")
ax.legend(frameon=False)
plt.show()`
  })}

  ${sectionBlock({
    title: "5. Эмпирическая функция распределения",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab1_empirical_cdf.png", "Рис. 2. F*(x) — негруппированная (ступенчатая) и группированная (линейная).")}</div>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
xs = np.sort(X); ys = np.arange(1, len(xs)+1)/len(xs)

edges = np.linspace(X.min(), X.max(), 8)
counts, _ = np.histogram(X, bins=edges)
cum = np.concatenate(([0], np.cumsum(counts/len(X))))

fig, ax = plt.subplots(figsize=(8,4.5))
ax.step(np.concatenate(([xs[0]-1], xs)), np.concatenate(([0], ys)),
        where="post", color="#6366f1", lw=2.2, label="F* (негруп.)")
ax.plot(edges, cum, "o-", color="#10b981", lw=2, ms=6, label="F* (группир.)")
ax.set_title("Эмпирическая функция распределения")
ax.legend(frameon=False)
plt.show()`
  })}

  ${sectionBlock({
    title: "6. Числовые характеристики",
    body: `
      <h4 class="font-semibold text-white mt-1 mb-2">Негруппированная выборка</h4>
      ${statsGrid([
        {label:"Среднее $\\bar{x}$", value:d.mean.toFixed(4)},
        {label:"Смещ. дисп. $D_в$", value:d.D_b.toFixed(4)},
        {label:"Несмещ. $s^2$", value:d.D_unb.toFixed(4)},
        {label:"СКО $s$", value:d.s.toFixed(4)},
        {label:"Медиана", value:d.median.toFixed(2)},
        {label:"Мода", value:d.mode},
      ])}
      <h4 class="font-semibold text-white mt-4 mb-2">Группированная выборка (по серединам интервалов)</h4>
      ${statsGrid([
        {label:"Среднее $\\bar{x}_г$", value:d.mean_g.toFixed(4)},
        {label:"Смещ. дисп.", value:d.D_b_g.toFixed(4)},
        {label:"Несмещ. $s^2_г$", value:d.D_unb_g.toFixed(4)},
        {label:"СКО $s_г$", value:d.s_g.toFixed(4)},
        {label:"Медиана", value:d.median_g.toFixed(3)},
        {label:"Мода", value:d.mode_g.toFixed(3)},
      ])}
      <p class="solution-text mt-4">
        Формулы (для негруппированной): $\\bar{x}=\\tfrac{1}{n}\\sum x_i$;
        $D_в=\\tfrac{1}{n}\\sum (x_i-\\bar{x})^2$;
        $s^2=\\tfrac{n}{n-1}D_в$.
        Для группированной по серединам $\\tilde{x}_i$ интервалов:
        $\\bar{x}_г=\\tfrac{1}{n}\\sum \\tilde{x}_i n_i$, аналогично для дисперсии.
      </p>
    `,
    code:
`import numpy as np
X = np.array([11,4,2,10,7,8,9,5,4,10,2,9,11,7,8,5,11,11,14,2,
              10,7,10,6,8,7,13,2,8,7,6,10,8,6,4,9,11,6,8,3,
              5,10,9,9,6,3,8,10,11,4])
from scipy import stats
print(f"среднее   = {X.mean():.4f}")
print(f"D смещ.   = {X.var(ddof=0):.4f}")
print(f"s^2 нес.  = {X.var(ddof=1):.4f}")
print(f"s         = {X.std(ddof=1):.4f}")
print(f"медиана   = {np.median(X)}")
print(f"мода      = {stats.mode(X, keepdims=True).mode[0]}")`
  })}
  `;
}
