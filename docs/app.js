// === Главный модуль ===
import { renderBDZ1 } from "./pages/bdz1.js";
import { renderBDZ3 } from "./pages/bdz3.js";
import { renderLab1 } from "./pages/lab1.js";
import { renderLab2 } from "./pages/lab2.js";
import { renderLab3 } from "./pages/lab3.js";
import { renderLab4 } from "./pages/lab4.js";

// ---- Глобальное состояние Pyodide ----
let pyodide = null;
let pyodideLoading = null;

async function getPyodide() {
  if (pyodide) return pyodide;
  if (pyodideLoading) return pyodideLoading;
  const statusEl = document.getElementById("py-status");
  statusEl?.classList.remove("hidden");
  statusEl.innerHTML = `<span class="loader" style="width:10px;height:10px;border-width:2px;vertical-align:-1px;margin-right:6px"></span>Загружаю Python…`;

  pyodideLoading = (async () => {
    const py = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" });
    await py.loadPackage(["numpy", "scipy", "matplotlib"]);
    py.runPython(`
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
plt.rcParams.update({
  "font.family": "DejaVu Sans",
  "axes.grid": True, "grid.alpha": 0.25,
  "axes.spines.top": False, "axes.spines.right": False,
  "figure.dpi": 100, "savefig.dpi": 110, "savefig.bbox": "tight",
})
import io, base64, sys
def _show_plt():
    buf = io.BytesIO(); plt.savefig(buf, format='png', bbox_inches='tight'); plt.close('all')
    import base64
    print('::IMG::' + base64.b64encode(buf.getvalue()).decode())
plt.show = _show_plt
`);
    pyodide = py;
    statusEl.innerHTML = `<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>Python готов`;
    return py;
  })();
  return pyodideLoading;
}

// Сделаем доступным для inline-вызовов
window.getPyodide = getPyodide;

// ---- Запуск кода в редакторе ----
async function runCode(editor, output, button) {
  const code = editor.value;
  output.innerHTML = `<span class="loader" style="width:10px;height:10px;border-width:2px;vertical-align:-1px;margin-right:6px"></span>Выполняю…`;
  button.disabled = true;
  try {
    const py = await getPyodide();
    // Перехват stdout
    py.runPython(`
import sys, io
_stdout_capture = io.StringIO()
sys.stdout = _stdout_capture
sys.stderr = _stdout_capture
`);
    let result;
    try {
      result = await py.runPythonAsync(code);
    } catch (e) {
      // Восстановить stdout перед ошибкой
      py.runPython("import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
      const captured = py.runPython("_stdout_capture.getvalue()");
      output.innerHTML = renderOutput(captured) + `<div class="err">${escapeHtml(e.message)}</div>`;
      button.disabled = false;
      return;
    }
    py.runPython("import sys; sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
    const captured = py.runPython("_stdout_capture.getvalue()");
    let rendered = renderOutput(captured);
    if (result !== undefined && result !== null && result.toString().length > 0 && typeof result !== "object") {
      rendered += `<div style="color:#94a3b8;margin-top:.35rem">${escapeHtml(result.toString())}</div>`;
    }
    output.innerHTML = rendered || `<span style="color:#6b7280">(нет вывода)</span>`;
  } catch (err) {
    output.innerHTML = `<div class="err">${escapeHtml(String(err))}</div>`;
  } finally {
    button.disabled = false;
  }
}

function renderOutput(captured) {
  if (!captured) return "";
  // Извлекаем картинки
  let html = "";
  const lines = captured.split("\n");
  for (const l of lines) {
    if (l.startsWith("::IMG::")) {
      const b64 = l.slice(7);
      html += `<img src="data:image/png;base64,${b64}" />\n`;
    } else {
      html += escapeHtml(l) + "\n";
    }
  }
  return html;
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---- Делегирование запуска кода ----
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".run-btn");
  if (!btn) return;
  const wrap = btn.closest(".code-block");
  const editor = wrap.querySelector(".code-editor");
  const output = wrap.querySelector(".code-output");
  runCode(editor, output, btn);
});

// Tab support
document.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  if (!e.target.matches(".code-editor")) return;
  e.preventDefault();
  const ta = e.target;
  const start = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.slice(0, start) + "    " + ta.value.slice(end);
  ta.selectionStart = ta.selectionEnd = start + 4;
});

// ---- Маршрутизация ----
const pages = ["home", "bdz1", "bdz3", "lab1", "lab2", "lab3", "lab4"];
function navigate() {
  const id = (location.hash || "#home").slice(1).split("?")[0];
  const target = pages.includes(id) ? id : "home";
  pages.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.toggle("hidden", p !== target);
  });
  document.querySelectorAll(".nav-link").forEach(a => {
    const matches = a.getAttribute("href") === "#" + target;
    a.classList.toggle("active", matches);
  });
  window.scrollTo(0, 0);
  // Re-render math after switching
  if (window.renderMathInDocument) renderMathInDocument();
}
window.addEventListener("hashchange", navigate);

// ---- Mode toggle (Edit / Presentation) ----
const modeBtn = document.getElementById("mode-toggle");
const modeLabel = document.getElementById("mode-label");
function setMode(mode) {
  document.body.classList.toggle("presentation", mode === "presentation");
  document.body.classList.toggle("edit", mode === "edit");
  modeLabel.textContent = mode === "presentation" ? "Редактирование" : "Презентация";
  localStorage.setItem("tvms-mode", mode);
}
modeBtn.addEventListener("click", () => {
  const next = document.body.classList.contains("presentation") ? "edit" : "presentation";
  setMode(next);
});

// ---- KaTeX render ----
window.renderMathInDocument = function() {
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }
};

// ---- Render pages ----
renderBDZ1(document.getElementById("bdz1-content"));
renderBDZ3(document.getElementById("bdz3-content"));
renderLab1(document.getElementById("lab1-content"));
renderLab2(document.getElementById("lab2-content"));
renderLab3(document.getElementById("lab3-content"));
renderLab4(document.getElementById("lab4-content"));

navigate();
// Default mode
setMode(localStorage.getItem("tvms-mode") || "presentation");

// Initial KaTeX render after a moment
setTimeout(() => window.renderMathInDocument(), 200);
