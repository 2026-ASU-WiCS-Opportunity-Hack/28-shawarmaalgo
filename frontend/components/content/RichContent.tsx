import type { ReactNode } from 'react';

type RichContentProps = {
  content: string;
  className?: string;
};

type ParsedBlock =
  | { type: 'image'; alt: string; src: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string };

const imagePattern = /^!\[(.*?)\]\((.*?)\)$/;
const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(linkPattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    nodes.push(
      <a
        key={`${match[2]}-${index}`}
        href={match[2]}
        className="font-semibold text-brand-navy underline decoration-brand-teal/50 underline-offset-4 hover:text-brand-teal dark:text-slate-100 dark:hover:text-brand-gold"
      >
        {match[1]}
      </a>
    );

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function parseContent(content: string): ParsedBlock[] {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const imageMatch = block.match(imagePattern);
      if (imageMatch) {
        return { type: 'image', alt: imageMatch[1] || 'Uploaded image', src: imageMatch[2] };
      }

      if (block.startsWith('## ')) {
        return { type: 'heading', text: block.replace(/^##\s+/, '').trim() };
      }

      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      const listItems = lines
        .filter((line) => /^[-*]\s+/.test(line))
        .map((line) => line.replace(/^[-*]\s+/, '').trim());

      if (lines.length > 0 && listItems.length === lines.length) {
        return { type: 'list', items: listItems };
      }

      return { type: 'paragraph', text: lines.join(' ').trim() };
    });
}

export function RichContent({ content, className = '' }: RichContentProps) {
  const blocks = parseContent(content);
  if (blocks.length === 0) return null;

  return (
    <div className={['space-y-5 text-base leading-8 text-slate-700 dark:text-slate-300', className].filter(Boolean).join(' ')}>
      {blocks.map((block, index) => {
        if (block.type === 'image') {
          return (
            <div
              key={`${block.src}-${index}`}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950"
            >
              <img src={block.src} alt={block.alt} className="max-h-[28rem] w-full object-cover" />
            </div>
          );
        }

        if (block.type === 'heading') {
          return (
            <h3 key={`${block.text}-${index}`} className="text-2xl font-semibold text-brand-navy dark:text-white">
              {block.text}
            </h3>
          );
        }

        if (block.type === 'list') {
          return (
            <ul
              key={`list-${index}`}
              className="space-y-2 rounded-[1.5rem] border border-slate-200 bg-white px-6 py-5 shadow-soft dark:border-slate-800 dark:bg-slate-950"
            >
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-teal" />
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`${block.text}-${index}`}
            className="rounded-[1.5rem] border border-slate-200 bg-white px-6 py-5 shadow-soft dark:border-slate-800 dark:bg-slate-950"
          >
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
