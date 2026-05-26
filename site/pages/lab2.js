import { sectionBlock, figure, statsGrid } from "./_components.js";
import { D } from "./_data.js";

const d = D.lab2;

export function renderLab2(container) {
  container.innerHTML = `
  ${sectionBlock({
    title: "Параметры распределений (вариант 16)",
    body: `
      ${statsGrid([
        {label:"$N(m,\\sigma)$", value:`m=${d.m}, σ=${d.sigma}`},
        {label:"$R(a,b)$",       value:`a=${d.a}, b=${d.b}`},
        {label:"$E(\\lambda)$",  value:`λ = N/5 = ${d.lam}`},
        {label:"Объём моделирования", value:`n = ${d.n_sim}`},
      ])}
      <p class="solution-text mt-3">
        Для варианта $N=16$ ($10\\le N\\le 20$): $\\lambda = N/5 = 3{,}2$. Для равномерного: $a=N,\\ b=2a=2N$.
        Нормальные параметры: $m=\\sigma=N$.
      </p>
    `,
  })}

  ${sectionBlock({
    title: "1. Функции плотности — N, R, E",
    subtitle: "Свои формулы (сплошная линия) и встроенные функции scipy (пунктир) — должны совпадать",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab2_pdfs.png", "Плотности нормального, равномерного и экспоненциального распределений.")}</div>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
from scipy import stats
m, sigma = 16, 16
a, b = 16, 32
lam = 16/5

def normal_pdf(x, m, s): return np.exp(-(x-m)**2/(2*s**2))/(s*np.sqrt(2*np.pi))
def unif_pdf(x, a, b):
    p = np.zeros_like(x); p[(x>=a)&(x<=b)] = 1/(b-a); return p
def exp_pdf(x, lam):
    p = np.zeros_like(x); m=x>=0; p[m] = lam*np.exp(-lam*x[m]); return p

xs1 = np.linspace(m-4*sigma, m+4*sigma, 400)
xs2 = np.linspace(a-3, b+3, 400)
xs3 = np.linspace(0, 5/lam, 400)

fig, axes = plt.subplots(1,3, figsize=(13,3.5))
axes[0].plot(xs1, normal_pdf(xs1,m,sigma), color="#6366f1", lw=2.4, label="формула")
axes[0].plot(xs1, stats.norm.pdf(xs1,m,sigma), "--", color="#ef4444", lw=2, label="scipy")
axes[0].set_title(f"N({m},{sigma})"); axes[0].legend(frameon=False)
axes[1].plot(xs2, unif_pdf(xs2,a,b), color="#10b981", lw=2.4, label="формула")
axes[1].plot(xs2, stats.uniform.pdf(xs2,a,b-a), "--", color="#ef4444", lw=2, label="scipy")
axes[1].set_title(f"R({a},{b})"); axes[1].legend(frameon=False)
axes[2].plot(xs3, exp_pdf(xs3,lam), color="#f59e0b", lw=2.4, label="формула")
axes[2].plot(xs3, stats.expon.pdf(xs3,scale=1/lam), "--", color="#ef4444", lw=2, label="scipy")
axes[2].set_title(f"E(λ={lam})"); axes[2].legend(frameon=False)
plt.tight_layout(); plt.show()`
  })}

  ${sectionBlock({
    title: "2. Функции распределения — N, R, E",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab2_cdfs.png", "Функции распределения N(16,16), R(16,32), E(3.2).")}</div>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
from scipy import stats
m, sigma, a, b, lam = 16, 16, 16, 32, 3.2
xs1 = np.linspace(m-4*sigma, m+4*sigma, 400)
xs2 = np.linspace(a-3, b+3, 400)
xs3 = np.linspace(0, 5/lam, 400)
fig, axes = plt.subplots(1,3, figsize=(13,3.5))
axes[0].plot(xs1, stats.norm.cdf(xs1,m,sigma), color="#6366f1", lw=2.4); axes[0].set_title(f"N({m},{sigma})")
axes[1].plot(xs2, stats.uniform.cdf(xs2,a,b-a), color="#10b981", lw=2.4); axes[1].set_title(f"R({a},{b})")
axes[2].plot(xs3, stats.expon.cdf(xs3,scale=1/lam), color="#f59e0b", lw=2.4); axes[2].set_title(f"E(λ={lam})")
for ax in axes: ax.set_ylabel("F(x)")
plt.tight_layout(); plt.show()`
  })}

  ${sectionBlock({
    title: "3. Специальные распределения χ², Стьюдента, Фишера",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab2_special.png", "Плотности χ²(5), t(5) и F(5,7).")}</div>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
from scipy import stats, special as sp
def chi2_pdf(x,k):
    p = np.zeros_like(x); m=x>0
    p[m] = x[m]**(k/2-1)*np.exp(-x[m]/2)/(2**(k/2)*sp.gamma(k/2))
    return p
def t_pdf(x,k):
    return sp.gamma((k+1)/2)/(np.sqrt(np.pi*k)*sp.gamma(k/2))*(1+x**2/k)**(-(k+1)/2)
def f_pdf(x,k1,k2):
    p=np.zeros_like(x); m=x>0
    c=sp.gamma((k1+k2)/2)/(sp.gamma(k1/2)*sp.gamma(k2/2))*(k1/k2)**(k1/2)
    p[m] = c*x[m]**(k1/2-1)*(1+k1*x[m]/k2)**(-(k1+k2)/2); return p

x1 = np.linspace(0,30,400); x2 = np.linspace(-5,5,400); x3 = np.linspace(0.01,5,400)
fig, axes = plt.subplots(1,3, figsize=(13,3.5))
axes[0].plot(x1, chi2_pdf(x1,5), "#6366f1", lw=2.4, label="форм.")
axes[0].plot(x1, stats.chi2.pdf(x1,5), "--", color="#ef4444", lw=2, label="scipy")
axes[0].set_title("χ² (k=5)"); axes[0].legend(frameon=False)
axes[1].plot(x2, t_pdf(x2,5), "#10b981", lw=2.4, label="форм.")
axes[1].plot(x2, stats.t.pdf(x2,5), "--", color="#ef4444", lw=2, label="scipy")
axes[1].set_title("Стьюдента (k=5)"); axes[1].legend(frameon=False)
axes[2].plot(x3, f_pdf(x3,5,7), "#f59e0b", lw=2.4, label="форм.")
axes[2].plot(x3, stats.f.pdf(x3,5,7), "--", color="#ef4444", lw=2, label="scipy")
axes[2].set_title("Фишера (k₁=5, k₂=7)"); axes[2].legend(frameon=False)
plt.tight_layout(); plt.show()`
  })}

  ${sectionBlock({
    title: "4. Моделирование выборок объёма 300",
    subtitle: "Гистограммы относительных частот для N(16,16), R(16,32), E(3.2)",
    body: `
      <div class="presentation-only">${figure("./public/figures/lab2_simulated.png", "Гистограммы смоделированных выборок n=300.")}</div>
      <p class="solution-text mt-3">
        Гистограмма нормальной выборки имеет колоколообразную форму, равномерной — прямоугольную (примерно плоскую), экспоненциальной — резкий пик в нуле с экспоненциальным убыванием.
      </p>
    `,
    code:
`import numpy as np, matplotlib.pyplot as plt
np.random.seed(16)
m, sigma, a, b, lam = 16, 16, 16, 32, 3.2
sN = np.random.normal(m, sigma, 300)
sR = np.random.uniform(a, b, 300)
sE = np.random.exponential(1/lam, 300)
fig, axes = plt.subplots(1,3, figsize=(13,3.7))
for ax,(d,name,c) in zip(axes, [(sN,"N(16,16)","#6366f1"),(sR,"R(16,32)","#10b981"),(sE,"E(3.2)","#f59e0b")]):
    ax.hist(d, bins=7, density=True, color=c, alpha=0.75, edgecolor="white")
    ax.set_title(f"{name}, n=300")
plt.tight_layout(); plt.show()`
  })}
  `;
}
