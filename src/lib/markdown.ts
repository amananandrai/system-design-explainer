/** A small markdown subset for site articles: headings, lists, tables, quotes, code, links. */

export type Inline =
  | { type: "text"; text: string }
  | { type: "code"; text: string }
  | { type: "strong"; text: string }
  | { type: "link"; text: string; href: string };

export type Block =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "rule" };

const splitCells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

const isRule = (line: string) => /^---+$/.test(line.trim());
const isTableSep = (line: string) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());

/** Inline code, bold, and links. Bold does not contain links. */
export function parseInline(input: string): Inline[] {
  const out: Inline[] = [];
  let rest = input;
  while (rest.length > 0) {
    const code = rest.match(/^`([^`]+)`/);
    const strong = rest.match(/^\*\*([^*]+)\*\*/);
    const link = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    const match = [code, strong, link]
      .filter((m): m is RegExpMatchArray => Boolean(m))
      .sort((a, b) => a.index! - b.index!)[0];
    if (!match || match.index !== 0) {
      const next = rest.search(/[`[*]/);
      const cut = next === -1 ? rest.length : Math.max(next, 1);
      out.push({ type: "text", text: rest.slice(0, cut) });
      rest = rest.slice(cut);
      continue;
    }
    if (match === code) out.push({ type: "code", text: match[1] });
    else if (match === strong) out.push({ type: "strong", text: match[1] });
    else out.push({ type: "link", text: match[1], href: match[2] });
    rest = rest.slice(match[0].length);
  }
  return out;
}

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const collect = (test: (line: string) => boolean, map: (line: string) => string) => {
    const items: string[] = [];
    while (i < lines.length && test(lines[i])) {
      items.push(map(lines[i]));
      i++;
    }
    return items;
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }

    if (isRule(line)) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }

    const heading = /^(#{2,4})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length as 2 | 3 | 4, text: heading[2].trim() });
      i++;
      continue;
    }

    if (line.startsWith("|")) {
      const headers = splitCells(line);
      i++;
      if (i < lines.length && isTableSep(lines[i])) i++;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(splitCells(lines[i]));
        i++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (line.startsWith("> ")) {
      const text = collect((l) => l.startsWith("> "), (l) => l.slice(2)).join(" ");
      blocks.push({ type: "quote", text });
      continue;
    }

    if (line.startsWith("- ")) {
      const items = collect((l) => l.startsWith("- "), (l) => l.slice(2));
      blocks.push({ type: "list", ordered: false, items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = collect((l) => /^\d+\.\s+/.test(l), (l) => l.replace(/^\d+\.\s+/, ""));
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("- ") &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !isRule(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }

  return blocks;
}

export function markdownToText(source: string): string {
  return parseMarkdown(source)
    .flatMap((block) => {
      if (block.type === "list") return block.items;
      if (block.type === "table") return [...block.headers, ...block.rows.flat()];
      if (block.type === "code") return [block.code];
      if (block.type === "rule") return [];
      return [block.text];
    })
    .join(" ");
}
