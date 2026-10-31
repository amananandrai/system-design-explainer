// Validates every content file: schema (on import) plus cross-references.
import { components, systems } from "../src/content";
import { validateContent } from "../src/lib/validate";

const problems = validateContent(components, systems);

if (problems.length > 0) {
  console.error(`Content validation failed (${problems.length}):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`Content OK: ${components.length} component kinds, ${systems.length} systems.`);
