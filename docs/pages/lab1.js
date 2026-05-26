import { sectionBlock, figure, statsGrid, table, codeBlock, note, h, toc } from "./_components.js";
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
    `[${d.edges[i].toFixed(3)};\u00A0${d.edges[i+1].toFixed(3)}]`,
    c,
    d.rel[i].toFixed(3),
    d.centers[i].toFixed(3)
  ]);

  container.innerHTML = `
  ${toc([
    {text:"Исходные данные и вариационный ряд", href:"#"},
    {text:"Статистический ряд и группировка", href:"#"},
    {text:"Гистограмма, полигон и эмпирическая ф.р.", href:"#"},
    {text:"Числовые характеристики выборки", href:"#"},
  ])}

  ${sectionBlock({
    num:"1", title:"Исходные данные",
    subtitle:"Вариант 16, объём выборки $n=50$ (приложение 1 практикума)",
    body: `
      <p class="solution-text">Выборка из приложения 1, столбец $N=16$:</p>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${sample}</pre>
      ${statsGrid([
        {label:"n", value:50},
        {label:"min", value:d.min},
        {label:"max", value:d.max},
        {label:"размах R", value:d.R},
        {label:"уник. значений", value:d.uniq.length},
      ])}
    `
  })}

  ${sectionBlock({
    num:"2", title:"Вариационный и статистический ряды",
    body: `
      <p class="solution-text"><b>Вариационный ряд</b> — выборка, упорядоченная по возрастанию:</p>
      <pre class="text-xs font-mono bg-ink-950 border border-ink-800 rounded p-3 overflow-x-auto whitespace-pre-wrap text-slate-300">${varRow}</pre>
      <p class="solution-text mt-3"><b>Статистический ряд</b> (значение $x_i$, абсолютная частота $n_i$, относительная частота $w_i = n_i/n$):</p>
      ${table(["$x_i$","$n_i$","$w_i = n_i/n$"], statRows)}
      ${codeBlock(`import numpy as np
x = np.array([${d.sample.join(", ")}])
print("вариационный ряд:", np.sort(x))
vals, cnts = np.unique(x, return_counts=True)
print("статистический ряд:")
for v, c in zip(vals, cnts):
    print(f"  x={v:>3}: n={c}, w={c/len(x):.3f}")`, "python")}
    `
  })}

  ${sectionBlock({
    num:"3", title:"Группировка на 7 интервалов",
    body: `
      <p class="solution-text">Длина интервала: $h = \\dfrac{x_{\\max} - x_{\\min}}{7} = \\dfrac{${d.R}}{7} = ${(d.R/7).toFixed(4)}$.</p>
      ${table(["№","Интервал","$n_i$","$w_i = n_i/n$","Центр $c_i$"], intRows)}
      ${note({title:"Замечание",
        body:"Граничные элементы выборки относятся к интервалу слева (стандартное правило); первый интервал включает левую границу."})}
    `
  })}

  ${sectionBlock({
    num:"4", title:"Гистограмма и полигон относительных частот",
    body: `
      ${figure("./public/figures/lab1_hist_polygon.png",
        "<b>Рис. 1.1.</b> Гистограмма частот и полигон относительных частот для семи интервалов группировки")}
      ${codeBlock(`import numpy as np, matplotlib.pyplot as plt
x = np.array([${d.sample.join(", ")}])
edges = np.linspace(x.min(), x.max(), 8)
counts, _ = np.histogram(x, bins=edges)
centers = (edges[:-1] + edges[1:]) / 2
h = edges[1] - edges[0]
rel = counts / len(x)
fig, ax = plt.subplots(figsize=(9, 5))
ax.bar(centers, rel/h, width=h*0.9, color="#6366f1", alpha=0.6, edgecolor="#ef4444", label="гистограмма")
ax.plot(centers, rel/h, "o-", color="#ef4444", lw=2, ms=7, label="полигон")
ax.set_xlabel("x"); ax.set_ylabel("плотность w/h"); ax.legend(frameon=False)
ax.set_title("Гистограмма и полигон выборки (вариант 16)")
plt.show()`, "python · построение графика")}
    `
  })}

  ${sectionBlock({
    num:"5", title:"Эмпирическая функция распределения",
    body: `
      <p class="solution-text">$F_n(x) = \\dfrac{1}{n}\\sum_{i=1}^{n} \\mathbb{1}\\{x_i \\le x\\}$ — ступенчатая функция со скачком $1/n$ в каждой точке выборки.</p>
      ${figure("./public/figures/lab1_empirical_cdf.png",
        "<b>Рис. 1.2.</b> Эмпирическая функция распределения $F_n(x)$")}
    `
  })}

  ${sectionBlock({
    num:"6", title:"Числовые характеристики выборки",
    body: `
      <h4 class="text-white font-semibold mt-2 mb-2">Негруппированная выборка</h4>
      ${statsGrid([
        {label:"$\\bar{x}$ (среднее)", value:d.mean.toFixed(4)},
        {label:"$D_x$ (смещ.)", value:d.D.toFixed(4)},
        {label:"$S^2$ (несм.)", value:d.S2.toFixed(4)},
        {label:"$s$ (СКО)", value:d.s.toFixed(4)},
        {label:"медиана", value:d.median},
        {label:"мода", value:d.mode},
      ])}
      <h4 class="text-white font-semibold mt-4 mb-2">Группированная выборка (7 интервалов)</h4>
      ${statsGrid([
        {label:"$\\bar{x}_g$", value:d.mean_g.toFixed(4)},
        {label:"$S^2_g$", value:d.S2_g.toFixed(4)},
        {label:"$s_g$", value:d.s_g.toFixed(4)},
      ])}
      ${codeBlock(`import numpy as np
x = np.array([${d.sample.join(", ")}])
print(f"среднее = {x.mean():.4f}")
print(f"D (смещ) = {x.var():.4f}")
print(f"S^2 (несм) = {x.var(ddof=1):.4f}")
print(f"s = {x.std(ddof=1):.4f}")
print(f"медиана = {np.median(x)}")
vals, cnts = np.unique(x, return_counts=True)
print(f"мода = {vals[cnts.argmax()]} (частота {cnts.max()})")`, "python")}
    `
  })}

  ${sectionBlock({
    num: "▣", title: "Вывод",
    body: `
      <p class="solution-text">Выборочное среднее $\\bar{x} = ${d.mean.toFixed(2)}$, $S^2 \\approx ${d.S2.toFixed(2)}$. Распределение симметрично — мода и медиана близки ($${d.mode}$ и $${d.median}$). Гистограмма имеет колоколообразную форму, что позволяет выдвинуть гипотезу о нормальности (проверяется в ЛР-3).</p>
    `
  })}
  `;
}
