import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const deckDir = path.dirname(fileURLToPath(import.meta.url));
const copyPath = path.join(deckDir, 'copy.md');
const htmlPath = path.join(deckDir, 'index.html');
const checkOnly = process.argv.includes('--check');

const blockPattern = /<!--\s*copy:([a-z0-9._-]+)\s*-->([\s\S]*?)<!--\s*\/copy\s*-->/gi;

function readCopyBlocks(markdown) {
  const blocks = new Map();
  for (const match of markdown.matchAll(blockPattern)) {
    const id = match[1];
    const value = match[2].replace(/^\r?\n/, '').replace(/\r?\n$/, '');
    if (blocks.has(id)) {
      throw new Error(`Duplicate copy block in copy.md: ${id}`);
    }
    blocks.set(id, value);
  }
  return blocks;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isSafeLinkUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function renderInline(value) {
  const linkPattern = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
  let rendered = '';
  let lastIndex = 0;

  for (const match of value.matchAll(linkPattern)) {
    const [raw, label, href] = match;
    rendered += escapeHtml(value.slice(lastIndex, match.index));

    if (isSafeLinkUrl(href)) {
      const target = href.startsWith('mailto:') ? '' : ' target="_blank" rel="noopener"';
      rendered += `<a class="copy-link" href="${escapeHtml(href)}"${target}>${escapeHtml(label)}</a>`;
    } else {
      rendered += escapeHtml(raw);
    }

    lastIndex = match.index + raw.length;
  }

  rendered += escapeHtml(value.slice(lastIndex));
  return rendered;
}

function renderCopy(value) {
  return value.split(/\r?\n/).map(renderInline).join('<br>');
}

const markdown = fs.readFileSync(copyPath, 'utf8');
const html = fs.readFileSync(htmlPath, 'utf8');
const copyBlocks = readCopyBlocks(markdown);
const htmlBlockIds = new Set();
const missingFromMarkdown = [];
let updates = 0;

const nextHtml = html.replace(blockPattern, (fullMatch, id) => {
  htmlBlockIds.add(id);
  if (!copyBlocks.has(id)) {
    missingFromMarkdown.push(id);
    return fullMatch;
  }

  const rendered = renderCopy(copyBlocks.get(id));
  const replacement = `<!-- copy:${id} -->${rendered}<!-- /copy -->`;
  if (replacement !== fullMatch) updates += 1;
  return replacement;
});

const unusedBlocks = [...copyBlocks.keys()].filter((id) => !htmlBlockIds.has(id));

if (missingFromMarkdown.length || unusedBlocks.length) {
  if (missingFromMarkdown.length) {
    console.error('HTML copy blocks missing from copy.md:');
    for (const id of missingFromMarkdown) console.error(`- ${id}`);
  }
  if (unusedBlocks.length) {
    console.error('copy.md blocks not found in index.html:');
    for (const id of unusedBlocks) console.error(`- ${id}`);
  }
  process.exit(1);
}

if (checkOnly) {
  if (updates > 0) {
    console.error(`copy.md and index.html are out of sync: ${updates} block(s) differ.`);
    process.exit(1);
  }
  console.log(`copy.md and index.html are in sync (${htmlBlockIds.size} block(s)).`);
} else {
  fs.writeFileSync(htmlPath, nextHtml);
  console.log(`Synced ${htmlBlockIds.size} copy block(s) into index.html.`);
}
