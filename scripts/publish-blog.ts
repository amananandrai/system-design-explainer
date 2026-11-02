// Publishes the site blog to DEV through the local DevRelay gateway.
// Requires `devrelay login` (MLH account with a linked DEV profile) first.
//
//   npx tsx scripts/publish-blog.ts
//   npx tsx scripts/publish-blog.ts --publish
//
// Without --publish the command prints the article and exits.
import { spawnSync } from "node:child_process";
import { components, concepts, posts, systems, toDevMarkdown, withCounts } from "../src/content";

const publish = process.argv.includes("--publish");
const binary = process.env.DEVRELAY_BIN ?? `${process.env.HOME}/.devrelay/bin/dev_mlh_mcp_server`;
const post = posts[0];
const body = toDevMarkdown(
  withCounts(post.body, {
    systems: systems.length,
    components: components.length,
    concepts: concepts.length,
  }),
);

if (!publish) {
  process.stdout.write(body);
  process.stderr.write("\nPass --publish to send this draft to DEV via DevRelay.\n");
  process.exit(0);
}

const args = [
  "articles",
  "create",
  "--title",
  post.title,
  "--description",
  post.description,
  "--body",
  body,
  "--published",
  "--ai-disclosure",
  "fully_autonomous",
  ...post.tags.flatMap((tag) => ["--tag", tag]),
];

const result = spawnSync(binary, args, { encoding: "utf8" });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
