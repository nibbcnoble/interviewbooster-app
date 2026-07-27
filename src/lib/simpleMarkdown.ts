// A deliberately small markdown -> HTML renderer. Blog posts are
// hand-written and simple, so we don't need a full CommonMark implementation
// or an extra dependency — this covers headers, paragraphs, fenced code
// blocks, unordered lists, bold, and inline code, which is all the sample
// posts use.

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderInline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];

  let i = 0;
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  while (i < lines.length) {
    const line = lines[i] ?? '';

    // fenced code block
    if (line.trim().startsWith('```')) {
      closeList();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').trim().startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i++;
      }
      i++; // skip closing fence
      html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    // headers
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      closeList();
      const level = (headerMatch[1] ?? '#').length;
      html.push(`<h${level}>${renderInline(headerMatch[2] ?? '')}</h${level}>`);
      i++;
      continue;
    }

    // unordered list item
    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${renderInline(listMatch[1] ?? '')}</li>`);
      i++;
      continue;
    }

    closeList();

    if (line.trim() === '') {
      i++;
      continue;
    }

    // paragraph: gather contiguous non-empty lines
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      (lines[i] ?? '').trim() !== '' &&
      !(lines[i] ?? '').match(/^(#{1,6})\s+/) &&
      !(lines[i] ?? '').trim().startsWith('```') &&
      !(lines[i] ?? '').match(/^[-*]\s+/)
    ) {
      paraLines.push(lines[i] ?? '');
      i++;
    }
    html.push(`<p>${renderInline(paraLines.join(' '))}</p>`);
  }

  closeList();
  return html.join('\n');
}
