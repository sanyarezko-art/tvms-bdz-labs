import { sectionBlock, figure, statsGrid, codeBlock, note, toc } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab2;

export function renderLab2(container) {
  container.innerHTML = `
  ${toc([
    {text:"Параметры распределений для варианта 16"},
    {text:"Функции плотности f(x): нормальное, равномерное, экспоненциальное"},
    {text:"Функции распределения F(x)"},
    {text:"Моделирование выборок n=300"},
    {text:"Распределения χ², Стьюдента, Фишера: формула vs scipy"},
  ])}

  ${sectionBlock({
    num:"1", title:"Параметры распределений (вариант N = 16)",
    body: `
      ${statsGrid([
        {label:"$N(m, \\sigma)$", value:`$m = ${d.m},\\ \\sigma = ${d.sigma}$`},
        {label:"$R(a, b)$",       value:`$a = ${d.a},\\ b = ${d.b}$`},
        {label:"$E(\\lambda)$",  value:`$\\lambda = N/5 = ${d.lam}$`},
        {label:"объём выборки", value:`$n_{\\mathrm{мод}} = ${d.n_sim}$`},
      ])}
      <p class="solution-text mt-3">
        Для $N=16$ ($10\\le N \\le 20$): $\\lambda = N/5 = 3{,}2$.
        Для равномерного: $a = N = 16,\\ b = 2a = 32$.
        Для нормального: $m = \\sigma = N = 16$.
      </p>
    `,
  })}

  ${sectionBlock({
    num:"2", title:"Функции плотности (по формулам и через SciPy)",
    body: `
      <p class="solution-text">
        $f_N(x) = \\dfrac{1}{\\sigma\\sqrt{2\\pi}}\\,e^{-(x-m)^2/(2\\sigma^2)}$,
        $f_R(x) = \\dfrac{1}{b-a}$ на $[a,b]$,
        $f_E(x) = \\lambda e^{-\\lambda x}$ при $x \\ge 0$.
      </p>
      ${figure("./public/figures/lab2_pdfs.png",
        "<b>Рис. 2.1.</b> Графики функций плотности вероятности для $N(16,16)$, $R(16,32)$, $E(\\lambda{=}3{,}2)$. Цветной — собственная программа; пунктир — scipy.stats")}
      ${codeBlock(`import numpy as np, matplotlib.pyplot as plt
from scipy import stats
m, sig, a, b, lam = 16, 16, 16, 32, 3.2
xs = np.linspace(m-4*sig, m+4*sig, 400)
plt.plot(xs, stats.norm.pdf(xs, m, sig), label="N(16,16)")
plt.title("Плотность нормального распределения"); plt.legend(); plt.show()`, "python")}
    `
  })}

  ${sectionBlock({
    num:"3", title:"Функции распределения $F(x)$",
    body: `
      ${figure("./public/figures/lab2_cdfs.png",
        "<b>Рис. 2.2.</b> Функции распределения для $N(16,16)$, $R(16,32)$, $E(\\lambda=3{,}2)$")}
      <p class="solution-text mt-2">Свойства: $0 \\le F(x) \\le 1$, $F$ неубывает, $\\lim_{x\\to-\\infty}F(x)=0$, $\\lim_{x\\to+\\infty}F(x)=1$.</p>
    `
  })}

  ${sectionBlock({
    num:"4", title:"Моделирование выборок объёмом 300",
    body: `
      <p class="solution-text">Для каждого из трёх законов смоделирована выборка размера $n = 300$.</p>
      ${figure("./public/figures/lab2_simulated.png",
        "<b>Рис. 2.3.</b> Гистограммы плотности относительных частот моделируемых выборок")}
      ${statsGrid([
        {label:"$\\bar{x}_N \\approx m$?", value:`${d.sim_norm_mean.toFixed(3)} (теор. 16)`},
        {label:"$D_N \\approx \\sigma^2$?", value:`${d.sim_norm_var.toFixed(2)} (теор. 256)`},
        {label:"$\\bar{x}_R \\approx (a{+}b)/2$?", value:`${d.sim_uni_mean.toFixed(3)} (теор. 24)`},
        {label:"$\\bar{x}_E \\approx 1/\\lambda$?", value:`${d.sim_exp_mean.toFixed(3)} (теор. ${(1/d.lam).toFixed(3)})`},
      ])}
      ${codeBlock(`import numpy as np
rng = np.random.default_rng(16)
sample_norm = rng.normal(16, 16, 300)
sample_uni  = rng.uniform(16, 32, 300)
sample_exp  = rng.exponential(1/3.2, 300)
for name, s in [("N", sample_norm), ("R", sample_uni), ("E", sample_exp)]:
    print(f"{name}: mean={s.mean():.3f}, var={s.var(ddof=1):.3f}")`, "python")}
    `
  })}

  ${sectionBlock({
    num:"5", title:"Распределения $\\chi^2$, Стьюдента и Фишера",
    body: `
      <p class="solution-text">Сравнение собственной реализации функций плотности (через формулы из раздела 1.1 практикума) с эталоном из SciPy. Степени свободы выбраны: $k_{\\chi^2} = 5$, $k_t = 5$, $(k_1, k_2) = (5, 7)$.</p>
      ${figure("./public/figures/lab2_special.png",
        "<b>Рис. 2.4.</b> Функции плотности $\\chi^2(5)$, Стьюдента $t(5)$, Фишера $F(5,7)$. Сплошная — собственная программа; пунктир — scipy.stats")}
    `
  })}

  ${sectionBlock({
    num:"▣", title:"Вывод",
    body: `
      <p class="solution-text">Графики собственных реализаций функций плотности и распределения с высокой точностью совпадают с эталонными из SciPy. Гистограммы смоделированных выборок (n=300) имеют форму, характерную для соответствующих теоретических распределений: симметричный «колокол» для нормального, плоская площадка для равномерного, монотонно убывающая кривая для экспоненциального.</p>
    `
  })}
  `;
}
