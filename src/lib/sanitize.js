import DOMPurify from 'dompurify';

// Article bodies are HTML written in the editor and shown to the public. Never render
// them raw: a single <script>, onerror= or javascript: link would run in every reader's
// browser (and could steal a signed-in admin's session). This keeps the formatting the
// editor produces and strips everything that can execute.
const ALLOWED_TAGS = [
  'p', 'br', 'hr', 'div', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'blockquote', 'pre', 'code',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td'
];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'class', 'style', 'colspan', 'rowspan'];

let hooked = false;
const ensureHooks = () => {
  if (hooked) return;
  hooked = true;
  // Links that open a new tab must not be able to control the page that opened them.
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });
};

export const sanitizeHtml = (html) => {
  ensureHooks();
  return DOMPurify.sanitize(String(html ?? ''), {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['style', 'script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i
  });
};
