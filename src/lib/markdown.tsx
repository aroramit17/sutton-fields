import React from "react";

// Minimal markdown → React renderer for admin-authored Answer content.
// Deliberately tiny: headings (##/###), paragraphs, unordered lists, bold,
// italic, and links. Everything renders as React text nodes — raw HTML in the
// source is displayed literally, never parsed, so there is no injection
// surface even if an admin pastes untrusted text.

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;
const ITALIC_RE = /\*([^*]+)\*/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  // Tokenize links first, then bold, then italic within plain segments.
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK_RE)) {
    if (m.index! > last) {
      nodes.push(...renderEmphasis(text.slice(last, m.index), `${keyPrefix}-t${i}`));
    }
    const href = m[2];
    const external = href.startsWith("http");
    nodes.push(
      <a
        key={`${keyPrefix}-a${i}`}
        href={href}
        className="text-primary underline underline-offset-2 hover:text-primary-container"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {m[1]}
      </a>
    );
    last = m.index! + m[0].length;
    i++;
  }
  if (last < text.length) {
    nodes.push(...renderEmphasis(text.slice(last), `${keyPrefix}-tail`));
  }
  return nodes;
}

function renderEmphasis(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(BOLD_RE)) {
    if (m.index! > last) nodes.push(renderItalic(text.slice(last, m.index), `${keyPrefix}-i${i}`));
    nodes.push(<strong key={`${keyPrefix}-b${i}`}>{m[1]}</strong>);
    last = m.index! + m[0].length;
    i++;
  }
  if (last < text.length) nodes.push(renderItalic(text.slice(last), `${keyPrefix}-iend`));
  return nodes;
}

function renderItalic(text: string, keyPrefix: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(ITALIC_RE)) {
    if (m.index! > last) parts.push(text.slice(last, m.index));
    parts.push(<em key={`${keyPrefix}-e${i}`}>{m[1]}</em>);
    last = m.index! + m[0].length;
    i++;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <React.Fragment key={keyPrefix}>{parts}</React.Fragment>;
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n{2,}/);

  return (
    <div className="space-y-4">
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={bi} className="font-headline text-xl font-bold text-on-surface pt-2">
              {renderInline(trimmed.slice(4), `h3-${bi}`)}
            </h3>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={bi} className="font-headline text-2xl font-bold text-on-surface pt-3">
              {renderInline(trimmed.slice(3), `h2-${bi}`)}
            </h2>
          );
        }

        const lines = trimmed.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={bi} className="list-disc space-y-1.5 pl-6 text-on-surface">
              {lines.map((l, li) => (
                <li key={li} className="leading-relaxed">
                  {renderInline(l.trim().slice(2), `li-${bi}-${li}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={bi} className="leading-relaxed text-on-surface">
            {renderInline(lines.join(" "), `p-${bi}`)}
          </p>
        );
      })}
    </div>
  );
}
