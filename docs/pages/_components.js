// Компоненты UI

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* Задача БДЗ — карточка с номером, условием, решением, ответом, кодом */
export function taskBlock({ num, title, statement, solutionHtml, answerHtml, code, extra = "" }) {
  return `
  <article class="task" id="task-${num}">
    <div class="task-header">
      <span class="task-num">${num}.</span>
      <h3>${title}</h3>
    </div>
    <div class="task-body">
      <div class="task-statement">${statement}</div>

      <div class="task-section-label">Решение</div>
      <div class="solution-text">${solutionHtml}</div>

      ${extra}

      <div class="answer-banner">
        <span class="ans-label">Ответ</span>
        <span class="ans-value">${answerHtml}</span>
      </div>

      <div class="code-block code-area">
        <div class="code-toolbar">
          <span class="tag">python · проверка вычислений</span>
          <button class="run-btn">▶ Запустить</button>
        </div>
        <textarea class="code-editor" spellcheck="false" rows="${Math.max(3, code.split("\n").length)}">${escapeHtml(code)}</textarea>
        <div class="code-output"></div>
      </div>
    </div>
  </article>`;
}

/* Раздел лабораторной работы */
export function sectionBlock({ num = "", title, subtitle = "", body }) {
  const numHtml = num !== "" ? `<span class="section-num">§ ${num}</span>` : "";
  return `
  <article class="section-block">
    <div class="section-head">
      ${numHtml}
      <div>
        <h3>${title}</h3>
        ${subtitle ? `<div class="text-sm text-slate-400 font-serif italic mt-0.5">${subtitle}</div>` : ""}
      </div>
    </div>
    <div class="task-body">${body}</div>
  </article>`;
}

/* Рисунок */
export function figure(src, caption) {
  return `<figure class="fig">
    <img src="${src}" alt="${caption.replace(/<[^>]+>/g, "")}" loading="lazy">
    <figcaption>${caption}</figcaption>
  </figure>`;
}

/* Сетка статистик */
export function statsGrid(items) {
  return `<div class="stats-grid">
    ${items.map(({label, value}) => `
      <div class="stat-cell">
        <div class="lbl">${label}</div>
        <div class="val">${value}</div>
      </div>`).join("")}
  </div>`;
}

/* Таблица */
export function table(headers, rows, opts = {}) {
  const hCells = headers.map(h => `<th>${h}</th>`).join("");
  const bRows = rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
  let foot = "";
  if (opts.footer) {
    foot = `<tfoot><tr>${opts.footer.map(c => `<td>${c}</td>`).join("")}</tr></tfoot>`;
  }
  return `<div class="tbl-wrap"><table class="tbl">
    <thead><tr>${hCells}</tr></thead>
    <tbody>${bRows}</tbody>
    ${foot}
  </table></div>`;
}

/* Блок-выполняемый код (без задачи) */
export function codeBlock(code, label = "python") {
  return `<div class="code-block code-area">
    <div class="code-toolbar">
      <span class="tag">${label}</span>
      <button class="run-btn">▶ Запустить</button>
    </div>
    <textarea class="code-editor" spellcheck="false" rows="${Math.max(3, code.split("\n").length)}">${escapeHtml(code)}</textarea>
    <div class="code-output"></div>
  </div>`;
}

/* Заметка / комментарий */
export function note({ title = "Замечание", body, kind = "" }) {
  return `<div class="note ${kind}">
    <div class="note-title">${title}</div>
    <div>${body}</div>
  </div>`;
}

/* Подзаголовок секции (h-section) */
export function h(num, text) {
  return `<div class="h-section"><span class="h-num">${num}.</span><span class="h-text">${text}</span></div>`;
}

/* TOC */
export function toc(items) {
  return `<div class="toc">
    <div class="toc-title">Содержание раздела</div>
    <ol>${items.map(it => `<li><a href="${it.href || '#'}">${it.text}</a></li>`).join("")}</ol>
  </div>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
