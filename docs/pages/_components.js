// Хелперы для построения блоков

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function taskBlock({ num, title, statement, solutionHtml, answerHtml, code, extra = "" }) {
  return `
  <article class="task">
    <div class="task-header">
      <div class="flex items-baseline">
        <span class="task-num">${num}</span>
        <h3 class="text-lg font-semibold text-white">${title}</h3>
      </div>
    </div>
    <div class="task-body">
      <div class="task-statement"><p>${statement}</p></div>

      <div class="solution-title">Решение</div>
      <div class="solution-text">${solutionHtml}</div>

      ${answerHtml ? `<div class="answer-box">${answerHtml}</div>` : ""}

      ${extra}

      ${code ? codeBlock(code) : ""}
    </div>
  </article>`;
}

export function sectionBlock({ title, body, code = "", subtitle = "" }) {
  return `
  <article class="task">
    <div class="task-header">
      <h3 class="text-lg font-semibold text-white">${title}</h3>
      ${subtitle ? `<div class="text-sm text-slate-400 mt-1">${subtitle}</div>` : ""}
    </div>
    <div class="task-body">
      ${body}
      ${code ? codeBlock(code) : ""}
    </div>
  </article>`;
}

export function codeBlock(code, title = "python") {
  return `
  <div class="code-block editor-only">
    <div class="code-bar">
      <div class="left">
        <div class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
        <span class="title">${title}.py</span>
      </div>
      <button class="run-btn">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        Запустить
      </button>
    </div>
    <textarea class="code-editor" spellcheck="false">${escapeAttr(code)}</textarea>
    <div class="code-output"></div>
  </div>`;
}

export function figure(src, caption) {
  return `<div class="figure"><img src="${src}" alt="${caption}"/><div class="figure-caption">${caption}</div></div>`;
}

export function statsGrid(items) {
  return `<div class="stats-grid">${items.map(i =>
    `<div class="stat-card"><div class="label">${i.label}</div><div class="value">${i.value}</div></div>`
  ).join("")}</div>`;
}

export function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function table(headers, rows) {
  return `<div class="overflow-x-auto"><table class="stat-table">
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td class="num">${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}
