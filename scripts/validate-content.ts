// Validates every content file: schema (on import) plus cross-references.
import { components, concepts, getConcept, getSystem, posts, systems } from "../src/content";
import { validateContent } from "../src/lib/validate";
import { conceptDiagrams } from "../src/content/conceptDiagrams";
import { systemIcons } from "../src/lib/identity";

const problems = validateContent(components, systems, concepts);
for (const s of systems) {
  if (!systemIcons[s.slug]) problems.push(`system "${s.slug}" has no icon in src/lib/identity.ts`);
}
for (const slug of Object.keys(conceptDiagrams)) {
  if (!concepts.some((c) => c.slug === slug)) problems.push(`conceptDiagrams has an entry for unknown concept "${slug}"`);
}

const seenPosts = new Set<string>();
for (const post of posts) {
  if (seenPosts.has(post.slug)) problems.push(`duplicate blog slug "${post.slug}"`);
  seenPosts.add(post.slug);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt)) problems.push(`blog "${post.slug}" has a bad publishedAt`);
  if (post.tags.length === 0 || post.tags.length > 4) problems.push(`blog "${post.slug}" must have 1–4 tags`);
  for (const match of post.body.matchAll(/\]\((\/[^)]+)\)/g)) {
    const path = match[1].replace(/\/$/, "") || "/";
    const system = /^\/systems\/([^/]+)$/.exec(path);
    const concept = /^\/concepts\/([^/]+)$/.exec(path);
    const article = /^\/blog\/([^/]+)$/.exec(path);
    if (system && !getSystem(system[1])) problems.push(`blog "${post.slug}" links to unknown system "${system[1]}"`);
    else if (concept && !getConcept(concept[1])) problems.push(`blog "${post.slug}" links to unknown concept "${concept[1]}"`);
    else if (article && !posts.some((p) => p.slug === article[1])) problems.push(`blog "${post.slug}" links to unknown post "${article[1]}"`);
    else if (!system && !concept && !article && path !== "/") problems.push(`blog "${post.slug}" has an unknown link "${match[1]}"`);
  }
}

if (problems.length > 0) {
  console.error(`Content validation failed (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `Content OK: ${components.length} component kinds, ${systems.length} systems, ${concepts.length} concepts.`,
);
