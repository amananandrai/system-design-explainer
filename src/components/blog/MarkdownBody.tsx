import Link from "next/link";
import type { ReactNode } from "react";
import { parseInline, parseMarkdown, type Inline } from "@/lib/markdown";

function InlineText({ text }: { text: string }) {
  return <>{parseInline(text).map((part, index) => renderInline(part, index))}</>;
}

function renderInline(part: Inline, key: number): ReactNode {
  if (part.type === "text") return <span key={key}>{part.text}</span>;
  if (part.type === "code") {
    return (
      <code key={key} className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-fg">
        {part.text}
      </code>
    );
  }
  if (part.type === "strong") {
    return (
      <strong key={key} className="font-semibold text-fg">
        {part.text}
      </strong>
    );
  }
  const external = part.href.startsWith("http");
  const className = "font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent";
  if (external) {
    return (
      <a key={key} href={part.href} className={className} target="_blank" rel="noreferrer">
        {part.text}
      </a>
    );
  }
  return (
    <Link key={key} href={part.href} className={className}>
      {part.text}
    </Link>
  );
}

function HopTrail({ code }: { code: string }) {
  const lines = code
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const labelled = lines.length > 1 && !lines[0].includes("|");
  const label = labelled ? lines[0] : "Request path";
  const nodes = (labelled ? lines.slice(1).join(" ") : lines.join(" "))
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  return (
    <figure>
      <figcaption className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">{label}</figcaption>
      <ol aria-label={label} className="flex flex-wrap items-center gap-2">
      {nodes.map((node, index) => (
        <li key={node} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="text-muted">
              →
            </span>
          )}
          <span className="rounded-full border border-line bg-surface px-3 py-1 text-sm font-medium text-fg">{node}</span>
        </li>
      ))}
      </ol>
    </figure>
  );
}

export default function MarkdownBody({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="space-y-5 text-[17px] leading-relaxed text-fg-soft">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = `h${block.level}` as "h2" | "h3" | "h4";
          const size = block.level === 2 ? "text-2xl" : block.level === 3 ? "text-xl" : "text-lg";
          return (
            <Tag key={index} className={`pt-4 font-semibold tracking-tight text-fg ${size}`}>
              {block.text}
            </Tag>
          );
        }
        if (block.type === "paragraph") {
          return (
            <p key={index}>
              <InlineText text={block.text} />
            </p>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={index} className="border-l-2 border-accent pl-4 text-muted">
              <InlineText text={block.text} />
            </blockquote>
          );
        }
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={index} className={`space-y-2 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <InlineText text={item} />
                </li>
              ))}
            </Tag>
          );
        }
        if (block.type === "code" && block.lang === "hops") {
          return <HopTrail key={index} code={block.code} />;
        }
        if (block.type === "code") {
          return (
            <pre key={index} className="overflow-x-auto rounded-xl border border-line bg-surface-2 p-4 font-mono text-sm text-fg">
              <code>{block.code}</code>
            </pre>
          );
        }
        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                <thead className="bg-surface-2 text-fg">
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} scope="col" className="px-3 py-2 font-semibold">
                        <InlineText text={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join("|")} className="border-t border-line">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 align-top">
                          <InlineText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <hr key={index} className="border-line" />;
      })}
    </div>
  );
}
