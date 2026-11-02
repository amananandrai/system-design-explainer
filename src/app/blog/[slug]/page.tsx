import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import MarkdownBody from "@/components/blog/MarkdownBody";
import { components, concepts, formatPostDate, getPost, posts, readingMinutes, systems, withCounts } from "@/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} · Blog · System Design Explainer`,
    description: post.description,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const body = withCounts(post.body, {
    systems: systems.length,
    components: components.length,
    concepts: concepts.length,
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <p className="text-sm font-medium text-accent">
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted">
        <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
        <span aria-hidden> · </span>
        {readingMinutes(body)} min read
      </p>
      <p className="mt-4 text-lg leading-relaxed text-muted">{post.description}</p>
      {post.cta && (
        <Link
          href={post.cta.href}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-[#fff] shadow-soft transition-all hover:-translate-y-0.5 hover:opacity-95"
        >
          {post.cta.label} <ArrowRight size={16} aria-hidden />
        </Link>
      )}
      <div className="mt-10">
        <MarkdownBody source={body} />
      </div>
    </article>
  );
}
