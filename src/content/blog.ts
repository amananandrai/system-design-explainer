import { markdownToText } from "@/lib/markdown";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Calendar date, YYYY-MM-DD, independent of the server timezone. */
  publishedAt: string;
  tags: string[];
  /** Extra search terms that are not already in the title or description. */
  keywords?: string;
  /** Root-relative links stay inside the site. `{{systems}}`, `{{components}}` and `{{concepts}}` are filled from the catalogue. */
  body: string;
  /** Optional jump from the article to the interactive page it describes. */
  cta?: { href: string; label: string };
}

const urlShortener: BlogPost = {
  slug: "twenty-thousand-redirects",
  title: "A URL shortener that answers 20,000 redirects a second",
  description:
    "A worked design: the 100-to-1 read ratio, keys that cannot collide, a redirect path that never waits on analytics, and why a 301 can be the wrong status code.",
  publishedAt: "2026-11-02",
  tags: ["systemdesign", "architecture", "webdev", "tutorial"],
  keywords: "base62 cache redirect 301 302 key generation sharding",
  cta: { href: "/systems/url-shortener", label: "Open the interactive diagram" },
  body: `Most system-design interviews start with a blank page and a product name. The useful ones start with a ratio.

A URL shortener looks small until you count. Creating a link is rare. Following one is not. In the [URL shortener](/systems/url-shortener/) on this site, about 500 million new links a month works out to roughly 200 creates a second. Readers follow those links about 100 times as often, so the redirect path has to absorb on the order of 20,000 requests a second. Five years of that is about 30 billion links. At a few hundred bytes each, the store is around 15 TB. The cache does not need all of it. The usual 80/20 assumption says the hot slice of one day's redirects fits in about 170 GB.

Those numbers decide the architecture. The boxes come afterwards.

## What the service has to do

A creator submits a long URL and gets a short one back. A visitor who opens the short link is redirected. The owner can set an alias or an expiry, read click stats, and delete a link.

The bar around that is stricter than the feature list. Redirects should return in a few milliseconds and should keep working when a region is having a bad day. Keys must be unique, and they must not be guessable as a sequence. A link that has not expired must not disappear.

The API that falls out of that is small.

| Method | Path | What it does |
| --- | --- | --- |
| POST | \`/shorten\` | \`{ url, alias?, expiresIn? }\` returns \`{ shortUrl }\` |
| GET | \`/{key}\` | 301 or 302 to the original URL, or 404 |
| GET | \`/{key}/stats\` | Clicks by day, country, and referrer |
| DELETE | \`/{key}\` | The owner removes the link |

The estimates that sit next to that API are the ones worth memorising, because every later choice cites one of them.

| Figure | Value | Where it comes from |
| --- | --- | --- |
| New links | about 200/s | 500 million a month |
| Redirects | about 20,000/s | 100 reads per write |
| Store, 5 years | about 15 TB | 30 billion links, ~500 bytes each |
| Hot cache | about 170 GB | 20% of a day's redirects |
| Key space | 62⁷, about 3.5 trillion | 7 Base62 characters, more than 100× the 5-year need |

## Uniqueness without a collision check

The naive create path hashes the URL, looks in the database, and retries on a collision. At 200 writes a second that check is a round trip you do not need. Hashing the URL also means the same destination always maps to the same key, which fights per-user aliases and expiry.

This design splits key generation out. A key generation service hands each app instance a pre-allocated range of counter values, kept in a coordination store. The instance encodes the next counter in Base62. Seven characters is 62⁷, about 3.5 trillion keys. Because the ranges do not overlap, the key is unique by construction. The app writes \`shortKey → { longUrl, ownerId, createdAt, expiresAt }\` once and does not look for a duplicate.

The coordination call is rare. It happens when a generator exhausts its block, not on every create. Bits in the counter are shuffled so consecutive creates do not produce consecutive keys.

Storing a pool of every future key is the other well-known version of this idea, and it is a different cost. A pre-generated key database has to persist the unused keys. [Zeeshan Ali's walkthrough](https://dev.to/zeeshanali0704/design-a-url-shortner-tiny-url-4cb5) puts a 6-character pool at roughly 412 GB before a single URL is saved. Handing out counter ranges avoids that store. [Tejaswi Pandava's bit.ly design](https://dev.to/tejaswipandava/designing-a-url-shortener-like-bitly-5h4o) makes the same call: allocate an id block, encode it, and skip the read-before-write.

The only hot query is "key to URL", so the link store is a key-value database, sharded by a hash of the key. Click rows do not live there.

## The redirect never waits

A visitor hits an edge cache first. Popular links never reach the origin.

\`\`\`hops
Redirect
Visitor | Edge cache | Load balancer | Shortener service | Hot-link cache or link store
\`\`\`

On a miss, a load balancer picks any app server. The servers are stateless. The app checks a cache of hot links and only then reads the key-value store. Expired and unknown keys return 404.

The click is recorded after the decision, not before the response. The app emits an event and returns the redirect immediately. Analytics consumes the stream in the background, keyed by short key and time, with country, referrer, and device. Stats can lag. The visitor should not.

\`\`\`hops
Analytics
Shortener service | Click events | Click analytics
\`\`\`

There is a product choice hiding in the status code. A 301 lets browsers and the edge cache the redirect, which sheds load and also hides later clicks from analytics. A 302 sends the client back each time, so every click is visible and the origin stays busier. Pick 302 when the dashboard is the product. Pick 301 when the redirect itself is. [Rhuturaj Takle's write-up](https://dev.to/rhuturaj_takle/system-design-url-shortener-46l6) treats that as a product decision rather than an HTTP detail, which is the right weight for it.

New links are written to the cache as well as the database, because a link is often clicked in the minute it is created, before any popularity signal exists.

Expiry has a sharp edge. The requirement is that an expired key returns 404. A cache entry that outlives the link breaks that, quietly, for as long as the entry's TTL. [Mangesh Mandlik's caching notes](https://dev.to/mangeshmandlik/designing-a-url-shortener-architecture-base62-redis-caching-scaling-576n) spell out the failure: a fixed 24-hour cache TTL will keep redirecting a link that expired in ten minutes. The cache TTL has to be the minimum of the usual TTL and the time left before \`expiresAt\`, and a delete has to invalidate the entry rather than wait.

## What breaks first

Four bottlenecks show up every time this design is reviewed.

1. A single counter becomes both a bottleneck and a single point of failure. Pre-allocated ranges fix that. Each generator talks to the coordinator only when its block runs out. That coordinator is a [leader-election](/concepts/leader-election/) problem, not a per-request lock.
2. Twenty thousand redirects a second will flatten a database that does a read per click. Cache-aside with LRU, sized for the hot slice, plus the edge cache, is the fix. The pattern is [caching](/concepts/caching/), and the store behind it is [sharded](/concepts/sharding/) on the key.
3. The 301 versus 302 choice above. Getting it wrong does not crash the service. It either blinds analytics or keeps load you meant to shed.
4. Shorten is an open endpoint until you [rate-limit](/concepts/rate-limiting/) creates per user and IP and check destinations against a malware list. Otherwise the service becomes a spam redirector.

Scaling from there is ordinary, and worth saying in one breath. Shard the link store on the hash of the key. Replicate the cache and the store per region so a redirect resolves nearby. Add app servers behind the balancer. Keep analytics on the stream so it cannot slow the redirect.

Custom domains, QR codes, safety interstitials, and per-user dashboards are extensions. They do not change the hot path.

## The same boxes, four clouds

The interesting part of drawing this on a whiteboard is that the boxes are roles, not products. An edge cache is a CDN. The hot-link cache is a cache. The link store is a key-value database. The click pipe is an event stream. The range allocator is a coordination service. The job that deletes expired links is a scheduled function. The keys themselves are a [unique ID generation](/concepts/id-generation/) scheme.

On the URL shortener page those roles are the diagram. One control relabels every node for AWS, Google Cloud, Azure, or open source, so "cache" becomes the product you would type into a console without redrawing the edges. Two walkthroughs, "create a short link" and "follow a short link", play the hops above one at a time.

The same page shape is used across the catalogue: requirements, API, back-of-the-envelope numbers, data model, diagram, bottlenecks, scaling, extensions. There are {{systems}} systems, {{components}} component kinds, and {{concepts}} concepts, and a concept is linked from the designs that use it instead of being re-explained inside each one.

## Where to go next

The foundations path on the home page continues with three neighbours of this design.

- [Pastebin](/systems/pastebin/) is the same short key and a much larger value. The text lives in object storage. The metadata row is what the key points at.
- An [API rate limiter](/systems/rate-limiter/) is the check this shortener needs on \`POST /shorten\`. The interesting part is doing it in under a millisecond and failing open when the counter store is down.
- [Search autocomplete](/systems/typeahead/) flips the problem. The work happens before the keystroke, in a trie of the top completions, so the request itself is one lookup.

After those, the media path (Instagram, Twitter, YouTube, Netflix) is where fan-out and adaptive bitrate show up, and the money path (BookMyShow, Amazon, payments, buy-now-pay-later) is where [idempotency](/concepts/idempotency/) and the [saga pattern](/concepts/saga/) take over the design.

---

This article was drafted by an AI agent from the URL shortener design in this project. The estimates, the API, and the trade-offs come from that design.
`,
};

export const posts: BlogPost[] = [urlShortener];

const bySlug = new Map(posts.map((post) => [post.slug, post]));

export function getPost(slug: string): BlogPost | undefined {
  return bySlug.get(slug);
}

export interface CatalogueCounts {
  systems: number;
  components: number;
  concepts: number;
}

export function withCounts(body: string, counts: CatalogueCounts): string {
  return body
    .replaceAll("{{systems}}", String(counts.systems))
    .replaceAll("{{components}}", String(counts.components))
    .replaceAll("{{concepts}}", String(counts.concepts));
}

const REPO = "https://github.com/amananandrai/system-design-explainer";

/** Markdown for DEV. In-site links become plain text, and the diagram fences become Mermaid. */
export function toDevMarkdown(body: string): string {
  const withDiagrams = body.replace(/```hops\n([\s\S]*?)```/g, (_match, inner: string) => {
    const lines = inner
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const nodeLine = lines.find((line) => line.includes("|")) ?? "";
    const nodes = nodeLine
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);
    const ids = nodes.map((_, index) => `n${index}`);
    const diagram = [
      "```mermaid",
      "flowchart LR",
      ...nodes.map((label, index) => `  ${ids[index]}["${label.replaceAll('"', "'")}"]`),
      ...ids.slice(1).map((id, index) => `  ${ids[index]} --> ${id}`),
      "```",
    ];
    return diagram.join("\n");
  });

  const withoutLocalLinks = withDiagrams.replace(/\[([^\]]+)\]\(\/[^)]+\)/g, "$1");

  return `${withoutLocalLinks.trim()}

## Open the diagram

The interactive version of this design is the URL shortener in [System Design Explainer](${REPO}). The same boxes relabel for AWS, Google Cloud, Azure, or open source, and the create and redirect flows play hop by hop. The notes behind this article are in [\`src/content/systems/url-shortener.ts\`](${REPO}/blob/master/src/content/systems/url-shortener.ts).
`;
}

export function readingMinutes(body: string): number {
  const words = markdownToText(body).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
