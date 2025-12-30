/* eslint-disable @typescript-eslint/no-explicit-any */
import MarkdownIt from 'markdown-it';

// Custom renderer that adds Tailwind classes and handles Reddit tags
function createRedditRenderer(darkMode: boolean = false) {
  // Create markdown-it instance
  const md = new MarkdownIt();

  // Helper function for default rendering
  const defaultRender = (tokens: any[], idx: number, options: any, env: any, self: any) => {
    return self.renderToken(tokens, idx, options);
  };

  // Override paragraph rendering
  const defaultParagraphOpen = md.renderer.rules.paragraph_open || defaultRender;
  md.renderer.rules.paragraph_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'mb-4');
    return defaultParagraphOpen(tokens, idx, options, env, self);
  };

  // Override list item rendering
  const defaultListItemOpen = md.renderer.rules.list_item_open || defaultRender;
  md.renderer.rules.list_item_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'mb-1');
    return defaultListItemOpen(tokens, idx, options, env, self);
  };

  // Override bullet list rendering
  const defaultBulletListOpen = md.renderer.rules.bullet_list_open || defaultRender;
  md.renderer.rules.bullet_list_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'list-disc list-inside ml-6 mb-4');
    return defaultBulletListOpen(tokens, idx, options, env, self);
  };

  // Override ordered list rendering
  const defaultOrderedListOpen = md.renderer.rules.ordered_list_open || defaultRender;
  md.renderer.rules.ordered_list_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', 'list-decimal list-inside ml-6 mb-4');
    return defaultOrderedListOpen(tokens, idx, options, env, self);
  };

  // Override blockquote rendering
  const defaultBlockquoteOpen = md.renderer.rules.blockquote_open || defaultRender;
  md.renderer.rules.blockquote_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    tokens[idx].attrJoin('class', `border-l-4 ${darkMode ? 'border-gray-600' : 'border-gray-300'} pl-4 italic my-4`);
    return defaultBlockquoteOpen(tokens, idx, options, env, self);
  };

  // Override code inline rendering
  md.renderer.rules.code_inline = function(tokens: any[], idx: number) {
    const token = tokens[idx];
    return `<code class="bg-${darkMode ? 'gray-700' : 'gray-200'} px-2 py-1 rounded text-sm font-mono">${md.utils.escapeHtml(token.content)}</code>`;
  };

  // Override code block rendering
  md.renderer.rules.fence = function(tokens: any[], idx: number) {
    const token = tokens[idx];
    const highlighted = token.content ? md.utils.escapeHtml(token.content) : '';

    return `<pre class="bg-${darkMode ? 'gray-800' : 'gray-100'} p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">${highlighted}</code></pre>`;
  };

  // Override link rendering with better colors
  const defaultLinkOpen = md.renderer.rules.link_open || defaultRender;
  md.renderer.rules.link_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');
    if (hrefIndex >= 0) {
      const href = token.attrs[hrefIndex][1];
      if (href && href[0] !== '#') {
        token.attrSet('target', '_blank');
        token.attrSet('rel', 'noopener noreferrer');
      }
    }
    token.attrJoin('class', 'text-blue-600 hover:text-blue-800 underline');
    return defaultLinkOpen(tokens, idx, options, env, self);
  };

  // Override heading rendering
  const defaultHeadingOpen = md.renderer.rules.heading_open || defaultRender;
  md.renderer.rules.heading_open = function(tokens: any[], idx: number, options: any, env: any, self: any) {
    const token = tokens[idx];
    const level = parseInt(token.tag.substr(1));
    const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
    if (level >= 1 && level <= 6) {
      token.attrJoin('class', `${sizes[level - 1]} font-bold mb-3`);
    }
    return defaultHeadingOpen(tokens, idx, options, env, self);
  };

  // Return the configured markdown-it instance
  return md;
}

export function parseRedditMarkdown(text: string, darkMode: boolean = false): string {
  if (!text) return '';

  try {
    // Create markdown-it instance with our custom renderer
    const md = createRedditRenderer(darkMode);

    // Render the markdown
    let parsed = md.render(text);

    // Process Reddit tags after markdown parsing
    parsed = parsed
      // r/subreddit or R/subreddit links
      .replace(/\b[rR]\/([a-zA-Z0-9_-]+)\b/g, (match, subreddit) => {
        const originalPrefix = match.slice(0, 2); // Preserve original case (r/ or R/)
        return `<a href="https://reddit.com/r/${subreddit.toLowerCase()}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">${originalPrefix}${subreddit}</a>`;
      })
      // u/username or U/username links
      .replace(/\b[uU]\/([a-zA-Z0-9_-]+)\b/g, (match, username) => {
        const originalPrefix = match.slice(0, 2); // Preserve original case (u/ or U/)
        return `<a href="https://reddit.com/u/${username.toLowerCase()}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">${originalPrefix}${username}</a>`;
      });

    return parsed;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    // Fallback to basic HTML escaping
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
