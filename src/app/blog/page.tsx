import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, posts, readingMinutes } from "@/content";

export const metadata: Metadata = {
  title: "Blog · System Design Explainer",
  description: "Worked system designs from the catalogue: the numbers, the trade-offs, and the page where you can click through them.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-4xl">Blog</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Essays that walk one design the way the interactive pages do: requirements, numbers, the hot path, and the
        trade-off that decides it.
      </p>
      <ul className="mt-8 space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                {formatPostDate(post.publishedAt)} · {readingMinutes(post.body)} min
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg">{post.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
