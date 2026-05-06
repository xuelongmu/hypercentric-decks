import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const knownDecks = [
  'sponsorship-deck',
  'generative-production-challenge',
  'creative-ai-nyc',
];
const blockPattern = /<!--\s*copy:([a-z0-9._-]+)\s*-->([\s\S]*?)<!--\s*\/copy\s*-->/gi;

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const syncAll = args.includes('--all');
const deckArgs = args.filter((arg) => !arg.startsWith('--'));

function usage() {
  console.error(`Usage:
  node scripts/sync-copy.mjs --all [--check]
  node scripts/sync-copy.mjs <deck-folder> [--check]

Known decks:
  ${knownDecks.join('\n  ')}`);
}

function readCopyBlocks(markdown, copyPath) {
  const blocks = new Map();
  for (const match of markdown.matchAll(blockPattern)) {
    const id = match[1];
    const value = match[2].replace(/^\r?\n/, '').replace(/\r?\n$/, '');
    if (blocks.has(id)) {
      throw new Error(`Duplicate copy block in ${path.relative(repoRoot, copyPath)}: ${id}`);
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

function syncDeck(deckName) {
  const deckDir = path.resolve(repoRoot, deckName);
  const copyPath = path.join(deckDir, 'copy.md');
  const htmlPath = path.join(deckDir, 'index.html');

  if (!deckDir.startsWith(repoRoot + path.sep)) {
    throw new Error(`Deck path escapes repo root: ${deckName}`);
  }
  if (!fs.existsSync(copyPath)) {
    throw new Error(`Missing copy.md for deck: ${deckName}`);
  }
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`Missing index.html for deck: ${deckName}`);
  }

  const markdown = fs.readFileSync(copyPath, 'utf8');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const copyBlocks = readCopyBlocks(markdown, copyPath);
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
    const errors = [];
    if (missingFromMarkdown.length) {
      errors.push(`HTML copy blocks missing from ${deckName}/copy.md:`);
      for (const id of missingFromMarkdown) errors.push(`- ${id}`);
    }
    if (unusedBlocks.length) {
      errors.push(`${deckName}/copy.md blocks not found in index.html:`);
      for (const id of unusedBlocks) errors.push(`- ${id}`);
    }
    throw new Error(errors.join('\n'));
  }

  if (checkOnly) {
    if (updates > 0) {
      throw new Error(`${deckName}: copy.md and index.html are out of sync: ${updates} block(s) differ.`);
    }
    console.log(`${deckName}: copy.md and index.html are in sync (${htmlBlockIds.size} block(s)).`);
    return;
  }

  fs.writeFileSync(htmlPath, nextHtml);
  console.log(`${deckName}: synced ${htmlBlockIds.size} copy block(s) into index.html.`);
}

if ((!syncAll && deckArgs.length === 0) || (syncAll && deckArgs.length > 0)) {
  usage();
  process.exit(1);
}

const decks = syncAll ? knownDecks : deckArgs;

try {
  for (const deckName of decks) {
    syncDeck(deckName);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
